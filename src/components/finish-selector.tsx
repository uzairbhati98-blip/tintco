'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import type { PaintFinish, FinishType } from '@/lib/types'

interface FinishSelectorProps {
  finishes: PaintFinish[]
  selectedFinish: FinishType | null
  onFinishSelect: (finish: FinishType) => void
  disabled?: boolean
}

export function FinishSelector({ 
  finishes, 
  selectedFinish, 
  onFinishSelect,
  disabled = false 
}: FinishSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand" />
        <h3 className="text-lg font-semibold">Select Finish Type</h3>
      </div>

      {disabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
          ⚠️ Please select a color first before choosing a finish
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {finishes.map((finish) => {
          const isSelected = selectedFinish === finish.id
          const isDisabled = disabled

          return (
            <motion.button
              key={finish.id}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={() => !isDisabled && onFinishSelect(finish.id)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-2xl border-2 transition-all text-left
                ${isDisabled 
                  ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200' 
                  : isSelected
                    ? 'border-brand bg-brand/5 shadow-md'
                    : 'border-gray-200 hover:border-brand/50 hover:shadow-sm bg-white'
                }
              `}
            >
              {/* Check mark for selected */}
              {isSelected && !isDisabled && (
                <div className="absolute top-2 right-2">
                  <div className="bg-brand rounded-full p-1">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                </div>
              )}

              {/* Finish icon */}
              <div className="text-2xl mb-2">{finish.icon}</div>

              {/* Finish name */}
              <p className="font-semibold text-sm mb-1">{finish.name}</p>

              {/* Finish description */}
              <p className="text-xs text-text/60">{finish.description}</p>
            </motion.button>
          )
        })}
      </div>

      {selectedFinish && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800"
        >
          ✓ Selected finish: <strong>{finishes.find(f => f.id === selectedFinish)?.name}</strong>
        </motion.div>
      )}
    </div>
  )
}