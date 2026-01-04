'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ColorPicker } from './color-picker'
import { FinishSelector } from './finish-selector'
import { PAINT_FINISHES } from '@/lib/finishes'
import type { SelectedColor, FinishType, PaintCustomization } from '@/lib/types'

interface PaintCustomizerProps {
  onColorChange?: (color: SelectedColor | null) => void  // ✅ NEW
}

export function PaintCustomizer({ onColorChange }: PaintCustomizerProps) {
  const [selectedColor, setSelectedColor] = useState<SelectedColor | null>(null)
  const [selectedFinish, setSelectedFinish] = useState<FinishType | null>(null)

  const handleColorChange = (color: SelectedColor) => {
    setSelectedColor(color)
    onColorChange?.(color)  // ✅ Notify parent
  }

  const handleFinishChange = (finish: FinishType) => {
    setSelectedFinish(finish)
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white rounded-2xl border-2 border-gray-100">
        <ColorPicker onColorChange={handleColorChange} />
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: 1, 
            height: 'auto',
            transition: { duration: 0.3 }
          }}
          className="p-6 bg-white rounded-2xl border-2 border-gray-100 overflow-hidden"
        >
          <FinishSelector
            finishes={PAINT_FINISHES}
            selectedFinish={selectedFinish}
            onFinishSelect={handleFinishChange}
            disabled={!selectedColor}
          />
        </motion.div>
      </AnimatePresence>

      {selectedColor && selectedFinish && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-brand/10 to-brand/5 rounded-2xl border-2 border-brand/20"
        >
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-lg">🎨</span>
            Your Paint Selection
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text/60 mb-1">Color</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <p className="font-medium">{selectedColor.name}</p>
              </div>
            </div>
            <div>
              <p className="text-text/60 mb-1">Finish</p>
              <p className="font-medium">
                {PAINT_FINISHES.find(f => f.id === selectedFinish)?.name}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}