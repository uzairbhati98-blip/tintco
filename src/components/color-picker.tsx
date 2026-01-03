'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Sparkles, ChevronDown } from 'lucide-react'
import { ColorPalette } from './color-palette'
import { getPopularColors, getColorsByCategory, hexToRgb, getColorName } from '@/lib/colors'
import type { PaintColor, SelectedColor } from '@/lib/types'

interface ColorPickerProps {
  onColorChange?: (color: SelectedColor) => void
}

export function ColorPicker({ onColorChange }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<SelectedColor | null>(null)
  const [customColor, setCustomColor] = useState('#FFCA2C')
  const [showAllColors, setShowAllColors] = useState(false)

  const popularColors = getPopularColors()
  const allColors = {
    neutral: getColorsByCategory('neutral'),
    warm: getColorsByCategory('warm'),
    cool: getColorsByCategory('cool'),
    bold: getColorsByCategory('bold'),
    brand: getColorsByCategory('brand')
  }

  const handleColorSelect = (color: PaintColor) => {
    const rgb = hexToRgb(color.hex)
    if (!rgb) return

    const selected: SelectedColor = {
      name: color.name,
      hex: color.hex,
      rgb
    }

    setSelectedColor(selected)
    onColorChange?.(selected)
  }

  const handleCustomColorChange = (hex: string) => {
    setCustomColor(hex)
    const rgb = hexToRgb(hex)
    if (!rgb) return

    const selected: SelectedColor = {
      name: getColorName(hex),
      hex,
      rgb
    }

    setSelectedColor(selected)
    onColorChange?.(selected)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-brand" />
          <h3 className="text-xl font-semibold">Choose Your Color</h3>
        </div>
        
        {selectedColor && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand/10 rounded-full">
            <div 
              className="w-4 h-4 rounded-full border border-brand/30"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <span className="text-sm font-medium">{selectedColor.name}</span>
          </div>
        )}
      </div>

      {/* Popular Colors */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand" />
          <p className="text-sm font-medium text-text/70">Popular Colors</p>
        </div>
        <ColorPalette 
          colors={popularColors}
          selectedColor={selectedColor?.hex || null}
          onColorSelect={handleColorSelect}
        />
      </div>

      {/* Show All Colors Toggle */}
      <button
        onClick={() => setShowAllColors(!showAllColors)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-brand/50 transition-colors"
      >
        <span className="font-medium">
          {showAllColors ? 'Show Less' : 'Show All Colors'}
        </span>
        <ChevronDown 
          className={`w-5 h-5 transition-transform ${showAllColors ? 'rotate-180' : ''}`}
        />
      </button>

      {/* All Colors (Expandable) */}
      <AnimatePresence>
        {showAllColors && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Neutrals */}
            <div>
              <p className="text-sm font-medium text-text/70 mb-3">Neutrals</p>
              <ColorPalette 
                colors={allColors.neutral}
                selectedColor={selectedColor?.hex || null}
                onColorSelect={handleColorSelect}
              />
            </div>

            {/* Warm */}
            <div>
              <p className="text-sm font-medium text-text/70 mb-3">Warm Tones</p>
              <ColorPalette 
                colors={allColors.warm}
                selectedColor={selectedColor?.hex || null}
                onColorSelect={handleColorSelect}
              />
            </div>

            {/* Cool */}
            <div>
              <p className="text-sm font-medium text-text/70 mb-3">Cool Tones</p>
              <ColorPalette 
                colors={allColors.cool}
                selectedColor={selectedColor?.hex || null}
                onColorSelect={handleColorSelect}
              />
            </div>

            {/* Bold */}
            <div>
              <p className="text-sm font-medium text-text/70 mb-3">Bold Colors</p>
              <ColorPalette 
                colors={allColors.bold}
                selectedColor={selectedColor?.hex || null}
                onColorSelect={handleColorSelect}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Color Picker */}
      <div className="border-t pt-6">
        <p className="text-sm font-medium text-text/70 mb-3">Custom Color</p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-200"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              placeholder="#FFCA2C"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand focus:outline-none font-mono uppercase"
            />
            <p className="text-xs text-text/50 mt-1">Enter any hex color code</p>
          </div>
        </div>
      </div>

      {/* Color Details */}
      {selectedColor && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-4"
        >
          <p className="text-sm font-medium mb-2">Selected Color Details</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text/60">Name</p>
              <p className="font-medium">{selectedColor.name}</p>
            </div>
            <div>
              <p className="text-text/60">Hex</p>
              <p className="font-mono font-medium">{selectedColor.hex}</p>
            </div>
            <div className="col-span-2">
              <p className="text-text/60">RGB</p>
              <p className="font-mono font-medium">
                {selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}