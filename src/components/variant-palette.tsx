'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Variant } from '@/lib/types'
import { Check } from 'lucide-react'

interface VariantPaletteProps {
  variants: Variant[]
  selected: string | null
  onSelect: (id: string) => void
  compact?: boolean
  title?: string
}

export function VariantPalette({
  variants,
  selected,
  onSelect,
  compact = false,
  title
}: VariantPaletteProps) {
  const gridCols = compact ? 'grid-cols-6 sm:grid-cols-8' : 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8'

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-sm font-medium text-text/70">{title}</h4>
      )}
      
      {/* FIXED: Added overflow-visible and increased padding to prevent clipping */}
      <div className={`grid ${gridCols} gap-2 p-2 overflow-visible`}>
        {variants.map((variant) => {
          const isSelected = selected === variant.value
          const hasThumbnail = variant.thumbnail && variant.thumbnail.length > 0
          const isImage = hasThumbnail && variant.thumbnail.startsWith('/')
          const isColor = hasThumbnail && variant.thumbnail.startsWith('#')

          return (
            <motion.button
              key={variant.id}
              onClick={() => onSelect(variant.value)}
              whileHover={{ scale: 1.15, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              className={`
                group relative aspect-square rounded-xl overflow-visible
                transition-all duration-200
                ${isSelected 
                  ? 'ring-2 ring-brand ring-offset-2' 
                  : 'ring-1 ring-gray-200 hover:ring-brand/50'
                }
              `}
              title={variant.description || variant.name}
            >
              {/* Image thumbnail */}
              {isImage && (
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                  <Image
                    src={variant.thumbnail!}
                    alt={variant.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              )}

              {/* Color thumbnail */}
              {isColor && (
                <div
                  className="w-full h-full rounded-xl"
                  style={{ backgroundColor: variant.thumbnail }}
                />
              )}

              {/* Fallback gray box when no thumbnail */}
              {!hasThumbnail && (
                <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center px-1">
                    {variant.name.substring(0, 2)}
                  </span>
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-brand/20 rounded-xl flex items-center justify-center"
                >
                  <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-black" strokeWidth={3} />
                  </div>
                </motion.div>
              )}

              {/* Hover tooltip - FIXED: Positioned to not get cut off */}
              <div className="
                absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity duration-200
                z-20 whitespace-nowrap
              ">
                <div className="bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
                  {variant.name}
                  {variant.description && (
                    <div className="text-white/70 text-xs mt-0.5">
                      {variant.description}
                    </div>
                  )}
                  {/* Tooltip arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}