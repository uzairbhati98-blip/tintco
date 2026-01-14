/**
 * Chat API Route - Sends chat messages to n8n support webhook
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const chatData = await request.json()

    console.log('💬 Chat message received:', chatData)

    // Get support webhook URL from env
    const N8N_SUPPORT_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

    if (!N8N_SUPPORT_WEBHOOK_URL) {
      console.warn('⚠️  N8N_WEBHOOK_URL not configured!')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Message received (webhook not configured)',
        warning: 'Chat webhook not configured'
      })
    }

    // Prepare payload for n8n
    const n8nPayload = {
      type: 'chat',
      message: chatData.message,
      timestamp: chatData.timestamp,
      conversationId: chatData.conversationId,
      metadata: {
        source: 'tintco-chat-widget',
        userAgent: request.headers.get('user-agent') || 'unknown',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    }

    console.log('📤 Sending to n8n:', N8N_SUPPORT_WEBHOOK_URL)

    // Send to n8n
    const n8nResponse = await fetch(N8N_SUPPORT_WEBHOOK_URL, {
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
      throw new Error(`n8n webhook returned ${n8nResponse.status}`)
    }

    let n8nResult
    try {
      const responseText = await n8nResponse.text()
      n8nResult = responseText ? JSON.parse(responseText) : { success: true }
    } catch (e) {
      n8nResult = { success: true }
    }

    console.log('✅ Chat message sent to n8n')

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      n8nResponse: n8nResult
    })

  } catch (error) {
    console.error('❌ Chat API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send message',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}