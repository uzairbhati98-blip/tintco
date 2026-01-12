/**
 * Checkout API Route - Sends order data to n8n workflow
 * 
 * This endpoint receives order data from the checkout page and forwards it to your n8n webhook
 * for purchase ticket creation.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // TODO: Replace with your actual n8n webhook URL
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'YOUR_N8N_WEBHOOK_URL_HERE'

    if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_URL_HERE') {
      console.warn('⚠️  N8N_WEBHOOK_URL not configured! Add it to your .env.local file')
      // Still return success for development/testing
      return NextResponse.json({ 
        success: true, 
        message: 'Order received (n8n webhook not configured)',
        orderId: orderData.orderId 
      })
    }

    // Send order data to n8n workflow
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Order metadata
        orderId: orderData.orderId,
        orderDate: orderData.orderDate,
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
            zipCode: orderData.customer.zipCode
          },
          notes: orderData.customer.notes || ''
        },
        
        // Order items with variant details
        items: orderData.items.map((item: any) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          pricePerUnit: item.price,
          subtotal: item.subtotal,
          
          // Variant information (if applicable)
          variant: item.variant ? {
            type: item.variant.type,
            name: item.variant.name,
            value: item.variant.value
          } : null
        })),
        
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
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })
    })

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook returned ${n8nResponse.status}`)
    }

    const n8nResult = await n8nResponse.json()

    console.log('✅ Order sent to n8n successfully:', orderData.orderId)

    return NextResponse.json({ 
      success: true, 
      message: 'Order processed successfully',
      orderId: orderData.orderId,
      n8nResponse: n8nResult
    })

  } catch (error) {
    console.error('❌ Checkout API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}