'use client'

import { motion } from 'framer-motion'
import type { PaintColor } from '@/lib/types'
import { Check } from 'lucide-react'

interface ColorPaletteProps {
  colors: PaintColor[]
  selectedColor: string | null
  onColorSelect: (color: PaintColor) => void
}

export function ColorPalette({ colors, selectedColor, onColorSelect }: ColorPaletteProps) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
      {colors.map((color) => {
        const isSelected = selectedColor === color.hex

        return (
          <motion.button
            key={color.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onColorSelect(color)}
            className="group relative"
            title={color.name}
          >
            {/* Color swatch */}
            <div
              className={`
                w-full aspect-square rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-brand shadow-lg ring-4 ring-brand/20' 
                  : 'border-gray-200 hover:border-brand/50 hover:shadow-md'
                }
              `}
              style={{ backgroundColor: color.hex }}
            >
              {/* Check mark for selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white rounded-full p-1 shadow-lg">
                    <Check className="w-4 h-4 text-brand" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Color name tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {color.name}
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}