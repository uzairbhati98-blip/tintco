import { NextRequest, NextResponse } from 'next/server'
import products from '@/data/products.json'


export async function GET(req: NextRequest){
const { searchParams } = new URL(req.url)
const category = searchParams.get('category')
const page = parseInt(searchParams.get('page') ?? '1')
const pageSize = parseInt(searchParams.get('pageSize') ?? '9')
let filtered = products as any[]
if(category) filtered = filtered.filter(p => p.categorySlug === category)
const total = filtered.length
const start = (page-1)*pageSize
return NextResponse.json({ items: filtered.slice(start, start+pageSize), total })
}