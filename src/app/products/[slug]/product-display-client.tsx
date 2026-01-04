'use client'

import { useState } from 'react'
import { ProductGallery } from '@/components/product-gallery'
import { PaintCustomizer } from '@/components/paint-customizer'
import type { Product, SelectedColor } from '@/lib/types'

interface ProductDisplayClientProps {
  product: Product
  renderGalleryOnly?: boolean
  renderCustomizerOnly?: boolean
}

export function ProductDisplayClient({ 
  product, 
  renderGalleryOnly,
  renderCustomizerOnly 
}: ProductDisplayClientProps) {
  const [selectedColor, setSelectedColor] = useState<SelectedColor | null>(null)

  // Render only gallery (for left column)
  if (renderGalleryOnly) {
    return (
      <ProductGallery
        images={product.images}
        name={product.name}
        product={product}
        selectedColorHex={selectedColor?.hex}
      />
    )
  }

  // Render only customizer (for right column)
  if (renderCustomizerOnly) {
    return <PaintCustomizer onColorChange={setSelectedColor} />
  }

  // Default: render both (shouldn't happen but just in case)
  return null
}