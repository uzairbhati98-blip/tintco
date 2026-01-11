import { NextResponse } from 'next/server'

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

export async function POST(request: Request) {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.error('❌ N8N_WEBHOOK_URL not configured')
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()

    console.log('📤 Sending to n8n:', N8N_WEBHOOK_URL)
    console.log('📦 Payload:', body)

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    console.log('📥 n8n status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ n8n error:', errorText)
      throw new Error(`n8n returned ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ n8n response:', data)

    return NextResponse.json(data)

  } catch (error) {
    console.error('❌ Chat API error:', error)
    return NextResponse.json(
      { message: "I'm having trouble connecting. Please try again later." },
      { status: 500 }
    )
  }
}