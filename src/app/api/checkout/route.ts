/**
 * Checkout API Route - Sends order data to n8n ORDER webhook
 * 
 * Order Type: "site visit"
 * Order Number Format: TINT-0001, TINT-0002, etc.
 * Date/Time: Separate fields for easier n8n processing
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    console.log('📦 Received order data:', orderData)

    const N8N_ORDER_WEBHOOK_URL = process.env.N8N_ORDER_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL

    if (!N8N_ORDER_WEBHOOK_URL || N8N_ORDER_WEBHOOK_URL === 'YOUR_ORDER_WEBHOOK_URL_HERE') {
      console.warn('⚠️  N8N_ORDER_WEBHOOK_URL not configured in .env.local')
      
      // Return success anyway for development
      return NextResponse.json({ 
        success: true, 
        message: 'Order received (webhook not configured - check console)',
        orderId: orderData.orderId,
        warning: 'N8N webhook not configured. Add N8N_ORDER_WEBHOOK_URL to .env.local'
      })
    }

    // Format order items with complete customization info
    const formattedItems = orderData.items.map((item: any) => {
      const formattedItem: any = {
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        pricePerUnit: item.price,
        subtotal: item.subtotal,
        image: item.image
      }

      // Paint product with color + finish
      if (item.paintCustomization) {
        formattedItem.customization = {
          type: 'paint',
          color: {
            name: item.paintCustomization.color.name,
            hex: item.paintCustomization.color.hex
          },
          finish: {
            type: item.paintCustomization.finish.type,
            name: item.paintCustomization.finish.name
          }
        }
      }
      // Generic variant (materials, patterns, finishes)
      else if (item.variant) {
        formattedItem.customization = {
          type: 'variant',
          variantType: item.variant.type,
          variantName: item.variant.name,
          variantValue: item.variant.value
        }
      }

      return formattedItem
    })

    // Create date object for splitting
    const orderDateTime = new Date(orderData.orderDate)
    
    // Format date (YYYY-MM-DD)
    const orderDate = orderDateTime.toISOString().split('T')[0]
    
    // Format time (HH:MM:SS)
    const orderTime = orderDateTime.toTimeString().split(' ')[0]
    
    // Human-readable formats
    const orderDateFormatted = orderDateTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const orderTimeFormatted = orderDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    // Prepare payload for n8n
    const n8nPayload = {
      // Order metadata
      orderId: orderData.orderId,
      
      // Split date and time fields
      orderDate: orderDate, // "2025-01-12"
      orderTime: orderTime, // "15:30:45"
      orderDateFormatted: orderDateFormatted, // "January 12, 2025"
      orderTimeFormatted: orderTimeFormatted, // "03:30 PM"
      orderTimestamp: orderData.orderDate, // Full ISO timestamp
      
      orderType: 'site visit',
      status: orderData.status,
      
      // Customer information
      customer: {
        firstName: orderData.customer.firstName,
        lastName: orderData.customer.lastName,
        fullName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        address: {
          street: orderData.customer.address,
          city: orderData.customer.city,
          state: orderData.customer.state,
          zipCode: orderData.customer.zipCode,
          fullAddress: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state} ${orderData.customer.zipCode}`
        },
        visitDate: orderData.customer.visitDate || null,
        notes: orderData.customer.notes || ''
      },
      
      // Order items with full customization details
      items: formattedItems,
      
      // Financial summary
      pricing: {
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total: orderData.total,
        currency: 'USD'
      },
      
      // Metadata for your workflow
      metadata: {
        source: 'tintco-website',
        webhookType: 'order',
        visitType: 'site visit',
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    }

    console.log('📤 Sending to n8n:', N8N_ORDER_WEBHOOK_URL)

    // Send order data to n8n ORDER webhook
    const n8nResponse = await fetch(N8N_ORDER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload)
    })

    console.log('📥 n8n response status:', n8nResponse.status)

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('❌ n8n webhook error:', errorText)
      throw new Error(`n8n webhook returned ${n8nResponse.status}: ${errorText}`)
    }

    let n8nResult
    try {
      n8nResult = await n8nResponse.json()
    } catch (e) {
      // Some webhooks don't return JSON
      n8nResult = { success: true }
    }

    console.log('✅ Site visit order sent to n8n successfully:', orderData.orderId)

    return NextResponse.json({ 
      success: true, 
      message: 'Site visit scheduled successfully',
      orderId: orderData.orderId,
      n8nResponse: n8nResult
    })

  } catch (error) {
    console.error('❌ Checkout API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to schedule site visit',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}