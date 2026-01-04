import { notFound } from 'next/navigation'
import products from '@/data/products.json'
import type { Product } from '@/lib/types'
import { ProductDisplayClient } from './product-display-client'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const product = (products as any[]).find(
    (p) => p.slug === slug
  ) as Product | undefined

  if (!product) return notFound()

  const reviews = {
    average: 4.8,
    count: 127,
  }

  const isPaintProduct = product.categorySlug === 'Wall-painting'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Single ProductDisplayClient handles everything */}
      <ProductDisplayClient 
        product={product}
        isPaintProduct={isPaintProduct}
        reviews={reviews}
      />
    </div>
  )
}