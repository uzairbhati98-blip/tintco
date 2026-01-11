'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Image from 'next/image'
import type { Variant } from '@/lib/types'

interface VariantPaletteProps {
  variants: Variant[]
  selectedVariant: string | null
  onVariantSelect: (variant: Variant) => void
  compact?: boolean
}

export function VariantPalette({ variants, selectedVariant, onVariantSelect, compact = false }: VariantPaletteProps) {
  // Check if thumbnail is an image (starts with /) or a color (starts with #)
  const isImage = (thumbnail?: string) => thumbnail && thumbnail.startsWith('/')
  const isColor = (thumbnail?: string) => thumbnail && thumbnail.startsWith('#')

  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
      {variants.map((variant) => {
        const isSelected = selectedVariant === variant.value

        return (
          <motion.button
            key={variant.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onVariantSelect(variant)}
            className="group relative"
            title={variant.name}
          >
            {/* Variant swatch */}
            <div
              className={`
                w-full aspect-square rounded-xl border-2 transition-all overflow-hidden
                ${isSelected 
                  ? 'border-brand shadow-lg ring-4 ring-brand/20' 
                  : 'border-gray-200 hover:border-brand/50 hover:shadow-md'
                }
              `}
              style={isColor(variant.thumbnail) ? { backgroundColor: variant.thumbnail } : undefined}
            >
              {/* Show image if thumbnail is an image path */}
              {isImage(variant.thumbnail) && (
                <Image
                  src={variant.thumbnail!}
                  alt={variant.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 16vw, 12vw"
                />
              )}

              {/* Fallback to gray if no thumbnail */}
              {!variant.thumbnail && (
                <div className="w-full h-full bg-gray-200" />
              )}

              {/* Check mark for selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                >
                  <div className="bg-white rounded-full p-1 shadow-lg">
                    <Check className="w-4 h-4 text-brand" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Tooltip - always shows on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                {variant.name}
                {variant.description && (
                  <div className="text-xs text-white/80 mt-1">{variant.description}</div>
                )}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}