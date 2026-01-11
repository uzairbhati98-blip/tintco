'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Sparkles, ChevronDown } from 'lucide-react'
import { VariantPalette } from './variant-palette'
import type { Variant, SelectedVariant, VariantType } from '@/lib/types'

interface VariantSelectorProps {
  title: string
  variantType: VariantType
  allVariants: Variant[]
  popularVariants?: Variant[]
  onVariantChange?: (variant: SelectedVariant) => void
}

export function VariantSelector({ 
  title, 
  variantType,
  allVariants, 
  popularVariants,
  onVariantChange 
}: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(null)
  const [showAllVariants, setShowAllVariants] = useState(false)

  const popular = popularVariants || allVariants.filter(v => v.popular)
  const hasPopular = popular.length > 0

  const handleVariantSelect = (variant: Variant) => {
    const selected: SelectedVariant = {
      id: variant.id,
      name: variant.name,
      value: variant.value
    }

    setSelectedVariant(selected)
    onVariantChange?.(selected)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-brand" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        {selectedVariant && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand/10 rounded-full">
            <div 
              className="w-4 h-4 rounded-full border border-brand/30"
              style={{ 
                backgroundColor: allVariants.find(v => v.value === selectedVariant.value)?.thumbnail || '#E5E7EB' 
              }}
            />
            <span className="text-sm font-medium">{selectedVariant.name}</span>
          </div>
        )}
      </div>

      {/* Popular Variants - Match color picker grid */}
      {hasPopular && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-brand" />
            <p className="text-sm font-medium text-text/70">Popular {variantType === 'material' ? 'Materials' : variantType === 'pattern' ? 'Patterns' : 'Finishes'}</p>
          </div>
          <VariantPalette 
            variants={popular}
            selectedVariant={selectedVariant?.value || null}
            onVariantSelect={handleVariantSelect}
            compact={true}
          />
        </div>
      )}

      {/* Show All Variants Toggle */}
      {allVariants.length > (hasPopular ? popular.length : 0) && (
        <button
          onClick={() => setShowAllVariants(!showAllVariants)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-brand/50 transition-colors"
        >
          <span className="font-medium">
            {showAllVariants ? 'Show Less' : `Show All ${variantType === 'material' ? 'Materials' : variantType === 'pattern' ? 'Patterns' : 'Finishes'}`}
          </span>
          <ChevronDown 
            className={`w-5 h-5 transition-transform ${showAllVariants ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {/* All Variants (Expandable) */}
      <AnimatePresence>
        {showAllVariants && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <VariantPalette 
              variants={allVariants}
              selectedVariant={selectedVariant?.value || null}
              onVariantSelect={handleVariantSelect}
              compact={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variant Details */}
      {selectedVariant && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-4"
        >
          <p className="text-sm font-medium mb-2">Selected {variantType === 'material' ? 'Material' : variantType === 'pattern' ? 'Pattern' : 'Finish'}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text/60">Name</p>
              <p className="font-medium">{selectedVariant.name}</p>
            </div>
            <div>
              <p className="text-text/60">Type</p>
              <p className="font-medium capitalize">{variantType}</p>
            </div>
          </div>
          {allVariants.find(v => v.value === selectedVariant.value)?.description && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-text/60 text-xs">Description</p>
              <p className="text-sm mt-1">
                {allVariants.find(v => v.value === selectedVariant.value)?.description}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}