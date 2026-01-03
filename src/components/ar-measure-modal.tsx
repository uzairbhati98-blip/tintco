'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle2, Ruler, X, Sparkles, Zap } from 'lucide-react'
import { AdvancedARView } from '@/components/ar/advanced-ar-view'

type ARState = 'idle' | 'ar' | 'success' | 'manual'

interface ARMeasureModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: { areaSqM: number; dimensions: string; roomType: string }) => void
  productName: string
}

export function ARMeasureModal({
  isOpen,
  onClose,
  onSuccess,
  productName
}: ARMeasureModalProps) {
  const [state, setState] = useState<ARState>('idle')
  const [measurements, setMeasurements] = useState({
    areaSqM: 0,
    netAreaSqM: 0,
    dimensions: '',
    obstructions: 0
  })
  const [errorMessage, setErrorMessage] = useState('')
  
  // Manual input
  const [manualWidth, setManualWidth] = useState('')
  const [manualHeight, setManualHeight] = useState('')

  useEffect(() => {
    if (isOpen) {
      setState('idle')
      setManualWidth('')
      setManualHeight('')
      setErrorMessage('')
    }
  }, [isOpen])

  const startAR = () => {
    setState('ar')
  }

  const switchToManual = () => {
    setState('manual')
    setErrorMessage('')
  }

  const handleARMeasurement = (data: { 
    widthM: number
    heightM: number
    areaSqM: number
    netAreaSqM: number
    obstructions: number
  }) => {
    const dimensions = `${data.widthM}m × ${data.heightM}m`

    setMeasurements({
      areaSqM: data.areaSqM,
      netAreaSqM: data.netAreaSqM,
      dimensions,
      obstructions: data.obstructions
    })

    setState('success')

    setTimeout(() => {
      onSuccess({
        areaSqM: data.netAreaSqM, // Use net area (after deductions)
        dimensions,
        roomType: 'living_room'
      })
      onClose()
    }, 3000)
  }

  const handleARError = (message: string) => {
    setErrorMessage(message)
    setState('manual') // Fallback to manual
  }

  const handleManualSubmit = () => {
    const width = parseFloat(manualWidth)
    const height = parseFloat(manualHeight)

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      setErrorMessage('Please enter valid dimensions')
      return
    }

    const areaSqM = parseFloat((width * height).toFixed(2))

    setMeasurements({
      areaSqM,
      netAreaSqM: areaSqM,
      dimensions: `${width}m × ${height}m`,
      obstructions: 0
    })

    setState('success')

    setTimeout(() => {
      onSuccess({
        areaSqM,
        dimensions: `${width}m × ${height}m`,
        roomType: 'living_room'
      })
      onClose()
    }, 2500)
  }

  if (!isOpen) return null

  // Show AR fullscreen view
  if (state === 'ar') {
    return (
      <AdvancedARView
        onMeasurementComplete={handleARMeasurement}
        onError={handleARError}
      />
    )
  }

  // Regular modal for other states
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div key="idle" className="text-center">
                <div className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-brand/20 to-brand/10 rounded-3xl flex items-center justify-center">
                  <Camera className="w-12 h-12 text-brand" />
                </div>
                <h3 className="text-2xl font-bold mb-2">AI Wall Measurement</h3>
                <p className="text-text/70 mb-6">
                  Automatically measure your space for <span className="font-semibold">{productName}</span>
                </p>

                <div className="space-y-3">
                  <button
                    onClick={startAR}
                    className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-4 rounded-2xl transition-all hover:shadow-lg group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      AI Smart Measurement
                    </span>
                  </button>

                  <button
                    onClick={switchToManual}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-text font-semibold py-4 rounded-2xl transition-all"
                  >
                    📏 Enter Manually
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                  <div className="flex items-start gap-2 text-sm text-blue-900">
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-left">
                      <strong>AI automatically detects:</strong> Wall size, furniture, doors & windows
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {state === 'manual' && (
              <motion.div key="manual" className="text-center">
                <div className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center">
                  <Ruler className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Enter Dimensions</h3>
                <p className="text-text/70 mb-6">
                  Measure your wall with a tape measure
                </p>

                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">
                      Width (meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={manualWidth}
                      onChange={(e) => setManualWidth(e.target.value)}
                      placeholder="e.g. 4.5"
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">
                      Height (meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={manualHeight}
                      onChange={(e) => setManualHeight(e.target.value)}
                      placeholder="e.g. 2.7"
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg focus:border-brand focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleManualSubmit}
                    className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-4 rounded-2xl transition-all"
                  >
                    Calculate Area
                  </button>

                  <button
                    onClick={startAR}
                    className="w-full text-text/60 hover:text-text text-sm"
                  >
                    ← Try AI Measurement
                  </button>
                </div>
              </motion.div>
            )}

            {state === 'success' && (
              <motion.div key="success" className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-3xl flex items-center justify-center shadow-lg"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">Measurement Complete!</h3>
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-left">
                      <p className="text-sm text-text/60 mb-1">Gross Area</p>
                      <p className="text-2xl font-bold text-text">
                        {measurements.areaSqM} m²
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-text/60 mb-1">Dimensions</p>
                      <p className="text-lg font-bold text-text">
                        {measurements.dimensions}
                      </p>
                    </div>
                  </div>

                  {measurements.obstructions > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-text/60 mb-2">AI Detected:</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text/70">{measurements.obstructions} furniture item(s)</span>
                        <span className="text-text/70">Doors & windows</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t-2 border-brand/20">
                    <p className="text-sm text-text/60 mb-1">Paintable Area</p>
                    <p className="text-3xl font-bold text-brand">
                      {measurements.netAreaSqM} m²
                    </p>
                  </div>
                </div>

                <p className="text-sm text-text/70">Redirecting to quote calculator...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}