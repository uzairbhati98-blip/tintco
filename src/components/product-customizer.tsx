'use client'

import { useState } from 'react'
import { PaintCustomizer } from './paint-customizer'
import { VariantSelector } from './variant-selector'
import { getMaterialsByProduct, getPopularMaterials } from '@/lib/variants/materials'
import { getPatternsByProduct, getPopularPatterns } from '@/lib/variants/patterns'
import { getFinishesByProduct, getPopularFinishes } from '@/lib/variants/finishes'
import type { Product, SelectedColor, SelectedVariant, FinishType } from '@/lib/types'

interface ProductCustomizerProps {
  product: Product
  onColorChange?: (color: SelectedColor | null) => void
  onVariantChange?: (variant: SelectedVariant | null) => void
  onPaintCustomization?: (customization: { color: SelectedColor | null; finish: FinishType | null }) => void
}

export function ProductCustomizer({ 
  product, 
  onColorChange,
  onVariantChange,
  onPaintCustomization 
}: ProductCustomizerProps) {
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(null)
  
  // Determine what type of customization to show
  const showColorPicker = product.colorPickerEnabled === true && product.slug === 'classic-paint'
  const showVariantSelector = product.variantType && product.slug !== 'micro-cement-wall'

  // Handle variant selection
  const handleVariantSelect = (variant: SelectedVariant | null) => {
    setSelectedVariant(variant)
    if (onVariantChange) {
      onVariantChange(variant)
    }
  }

  // If neither, show nothing
  if (!showColorPicker && !showVariantSelector) {
    return null
  }

  // Show color picker for Classic Paint
  if (showColorPicker) {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-2xl border-2 border-gray-100">
          <PaintCustomizer 
            onColorChange={onColorChange}
            onCustomizationChange={onPaintCustomization}
          />
        </div>
      </div>
    )
  }

  // Show variant selector for other products
  if (showVariantSelector && product.variantType) {
    let variants: any[] = []
    let popularVariants: any[] = []
    let title = ''

    switch (product.variantType) {
      case 'material':
        variants = getMaterialsByProduct(product.slug)
        popularVariants = getPopularMaterials(variants)
        title = 'Choose Material'
        break
      case 'pattern':
        variants = getPatternsByProduct(product.slug)
        popularVariants = getPopularPatterns(variants)
        title = 'Choose Pattern'
        break
      case 'finish':
        variants = getFinishesByProduct(product.slug)
        popularVariants = getPopularFinishes(variants)
        title = 'Choose Finish'
        break
    }

    return (
      <div className="p-6 bg-white rounded-2xl border-2 border-gray-100">
        <VariantSelector
          title={title}
          variantType={product.variantType}
          allVariants={variants}
          popularVariants={popularVariants}
          onVariantChange={handleVariantSelect}
        />
      </div>
    )
  }

  return null
}