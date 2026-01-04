'use client'

import { useState } from 'react'
import { ProductGallery } from '@/components/product-gallery'
import { PaintCustomizer } from '@/components/paint-customizer'
import type { Product, SelectedColor } from '@/lib/types'

interface ProductDisplayProps {
  product: Product
  isPaintProduct: boolean
}

export function ProductDisplay({ product, isPaintProduct }: ProductDisplayProps) {
  const [selectedColor, setSelectedColor] = useState<SelectedColor | null>(null)

  // Get images based on selected color
  const getDisplayImages = (): string[] => {
    if (!selectedColor || !product.colorVariants) {
      return product.images
    }

    // Try to find exact color match
    const variantImages = product.colorVariants[selectedColor.hex]
    if (variantImages && variantImages.length > 0) {
      return variantImages
    }

    // Fallback to default images
    return product.images
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div>
        <ProductGallery
          images={getDisplayImages()}
          name={product.name}
        />
      </div>

      <div className="space-y-6">
        {isPaintProduct && (
          <PaintCustomizer onColorChange={setSelectedColor} />
        )}
      </div>
    </div>
  )
}