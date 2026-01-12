'use client'

import { useState, useEffect } from 'react'
import { ColorPicker } from './color-picker'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import type { SelectedColor, FinishType } from '@/lib/types'

const FINISHES = [
  { id: 'gloss' as FinishType, name: 'Glossy', icon: '✨', description: 'High shine, easy to clean', popular: true },
  { id: 'semi-gloss' as FinishType, name: 'Semi-Glossy', icon: '🌟', description: 'Moderate shine, durable', popular: true },
  { id: 'matte' as FinishType, name: 'Matte', icon: '🎨', description: 'No shine, modern look', popular: true },
  { id: 'marble' as FinishType, name: 'Marble', icon: '💎', description: 'Luxury marble effect', popular: false },
]

interface PaintCustomizerProps {
  onColorChange?: (color: SelectedColor | null) => void
  onCustomizationChange?: (customization: { color: SelectedColor | null; finish: FinishType | null }) => void
}

export function PaintCustomizer({ onColorChange, onCustomizationChange }: PaintCustomizerProps) {
  const [selectedColor, setSelectedColor] = useState<SelectedColor | null>(null)
  const [selectedFinish, setSelectedFinish] = useState<FinishType | null>(null)

  // Emit combined customization whenever color or finish changes
  useEffect(() => {
    if (onCustomizationChange) {
      onCustomizationChange({
        color: selectedColor,
        finish: selectedFinish
      })
    }
  }, [selectedColor, selectedFinish, onCustomizationChange])

  const handleColorChange = (color: SelectedColor | null) => {
    setSelectedColor(color)
    if (onColorChange) {
      onColorChange(color)
    }
  }

  return (
    <div className="space-y-6">
      {/* Color Picker */}
      <ColorPicker onColorChange={handleColorChange} />

      {/* Finish Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-brand" />
          <h3 className="text-lg font-semibold">Select Finish</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FINISHES.map((finish) => (
            <motion.button
              key={finish.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFinish(finish.id)}
              disabled={!selectedColor}
              className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${!selectedColor 
                  ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                  : selectedFinish === finish.id 
                    ? 'border-brand bg-brand/5' 
                    : 'border-gray-200 hover:border-brand/50'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{finish.icon}</span>
                <span className="font-semibold">{finish.name}</span>
              </div>
              <p className="text-xs text-text/60">{finish.description}</p>
            </motion.button>
          ))}
        </div>

        {!selectedColor && (
          <p className="text-sm text-text/60 mt-3">
            Please select a color first
          </p>
        )}
      </div>

      {/* Selected Summary */}
      {selectedColor && selectedFinish && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-4"
        >
          <p className="text-sm font-medium mb-3">Your Selection</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-brand/30"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div>
                <p className="text-sm font-medium">{selectedColor.name}</p>
                <p className="text-xs text-text/60">{selectedColor.hex}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <p className="text-sm font-medium">
                {FINISHES.find(f => f.id === selectedFinish)?.name}
              </p>
              <p className="text-xs text-text/60">Finish</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}