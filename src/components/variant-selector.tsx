'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { VariantPalette } from './variant-palette'
import type { Variant, VariantType, SelectedVariant } from '@/lib/types'

interface VariantSelectorProps {
  title: string
  variantType: VariantType
  allVariants: Variant[]
  popularVariants: Variant[]
  onVariantChange?: (variant: SelectedVariant | null) => void
}

export function VariantSelector({
  title,
  variantType,
  allVariants,
  popularVariants,
  onVariantChange
}: VariantSelectorProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [showAllVariants, setShowAllVariants] = useState(false)

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    
    // Find the full variant object
    const variant = allVariants.find(v => v.value === value)
    
    if (variant && onVariantChange) {
      onVariantChange({
        id: variant.id,
        name: variant.name,
        value: variant.value
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        {/* Popular/Featured Variants */}
        {popularVariants.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text/70 mb-3">Popular</h4>
            <VariantPalette
              variants={popularVariants}
              selected={selectedValue}
              onSelect={handleSelect}
              compact={false}
            />
          </div>
        )}

        {/* TASK 5: Enhanced Show More Button with Arrow */}
        {allVariants.length > popularVariants.length && (
          <div className="mb-4">
            <button
              onClick={() => setShowAllVariants(!showAllVariants)}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand/80 transition-all group"
            >
              <span>{showAllVariants ? 'Show Less' : `See All (${allVariants.length})`}</span>
              {/* Arrow icon that rotates */}
              {showAllVariants ? (
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              )}
            </button>
          </div>
        )}

        {/* All Variants (when expanded) */}
        {showAllVariants && (
          <div>
            <h4 className="text-sm font-medium text-text/70 mb-3">All Options</h4>
            <VariantPalette
              variants={allVariants}
              selected={selectedValue}
              onSelect={handleSelect}
              compact={true}
            />
          </div>
        )}

        {/* Selected variant info */}
        {selectedValue && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <span className="text-text/60">Selected:</span>{' '}
              <span className="font-medium">
                {allVariants.find(v => v.value === selectedValue)?.name}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}