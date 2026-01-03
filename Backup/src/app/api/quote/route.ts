import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest){
const body = await req.json()
// You could validate with Zod here, send email, etc.
const quoteId = Math.random().toString(36).slice(2,8).toUpperCase()
return NextResponse.json({ ok:true, quoteId })
}