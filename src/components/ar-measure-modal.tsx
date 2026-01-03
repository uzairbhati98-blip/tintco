'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle2, Loader2, AlertCircle, X } from 'lucide-react'
import { checkWebXRSupport } from '@/lib/ar/webxr-detector'
import { WebXRARView } from '@/components/ar/webxr-ar-view'

type ARState = 'idle' | 'checking' | 'webxr' | 'processing' | 'success' | 'error'

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
    dimensions: '',
    roomType: 'living_room'
  })
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setState('idle')
      setProgress(0)
      setErrorMessage('')
    }
  }, [isOpen])

  const startMeasurement = async () => {
    setState('checking')
    setProgress(10)

    // Check WebXR support
    const support = await checkWebXRSupport()

    if (support.supported) {
      // Use WebXR
      setState('webxr')
      setProgress(30)
    } else {
      // Fallback - show error for now
      setState('error')
      setErrorMessage(
        'WebXR AR not supported on this device. ' +
        (support.message || 'Please use iOS Safari 13+ or Chrome for Android.')
      )
    }
  }

  const handleWebXRMeasurement = (data: { widthM: number; heightM: number; areaSqM: number }) => {
    setState('processing')
    setProgress(90)

    const dimensions = `${data.widthM.toFixed(1)}m × ${data.heightM.toFixed(1)}m`

    setMeasurements({
      areaSqM: data.areaSqM,
      dimensions,
      roomType: 'living_room'
    })

    setProgress(100)
    setState('success')

    setTimeout(() => {
      onSuccess({
        areaSqM: data.areaSqM,
        dimensions,
        roomType: 'living_room'
      })
      onClose()
    }, 2500)
  }

  const handleWebXRError = (message: string) => {
    setState('error')
    setErrorMessage(message)
  }

  const retry = () => {
    setState('idle')
    setProgress(0)
    setErrorMessage('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Show WebXR fullscreen view */}
      {state === 'webxr' && (
        <WebXRARView
          onMeasurementComplete={handleWebXRMeasurement}
          onError={handleWebXRError}
        />
      )}

      {/* Regular modal for other states */}
      {state !== 'webxr' && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            role="dialog" aria-modal="true" aria-label="AR Measurement"
          >
            {progress > 0 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 z-50">
                <motion.div
                  className="h-full bg-brand"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {(state === 'idle' || state === 'error') && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="p-8">
              <AnimatePresence mode="wait">
                {state === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-brand/20 to-brand/10 rounded-3xl flex items-center justify-center cursor-pointer"
                      onClick={startMeasurement}
                    >
                      <Camera className="w-12 h-12 text-brand" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">AR Wall Detection</h3>
                    <p className="text-text/70 mb-6">
                      Automatically measure your space for <span className="font-semibold">{productName}</span>
                    </p>
                    <button
                      onClick={startMeasurement}
                      className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-4 rounded-2xl transition-all hover:shadow-lg active:scale-95"
                    >
                      Start AR Detection
                    </button>
                    <p className="mt-4 text-xs text-text/50">Point your camera at a wall to automatically detect and measure</p>
                  </motion.div>
                )}

                {state === 'checking' && (
                  <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="mb-6 mx-auto w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center">
                      <Camera className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Checking AR Support</h3>
                    <p className="text-text/70">Verifying device capabilities...</p>
                    <div className="mt-6">
                      <Loader2 className="w-6 h-6 text-brand animate-spin mx-auto" />
                    </div>
                  </motion.div>
                )}

                {state === 'processing' && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="mb-6 mx-auto w-24 h-24 bg-brand/10 rounded-3xl flex items-center justify-center">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Loader2 className="w-12 h-12 text-brand" />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Processing Measurements...</h3>
                    <p className="text-text/70">Calculating area and dimensions</p>
                  </motion.div>
                )}

                {state === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", duration: 0.6 }} className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-3xl flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">Wall Detected!</h3>
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div>
                          <p className="text-sm text-text/60 mb-1">Total Area</p>
                          <p className="text-2xl font-bold text-brand">
                            {measurements.areaSqM} m²
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-text/60 mb-1">Dimensions</p>
                          <p className="text-2xl font-bold text-brand">
                            {measurements.dimensions}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-text/70">Redirecting to quote calculator...</p>
                  </motion.div>
                )}

                {state === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="mb-6 mx-auto w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">AR Not Available</h3>
                    <p className="text-text/70 mb-6">{errorMessage}</p>
                    <div className="flex gap-3">
                      <button onClick={retry} className="flex-1 bg-brand hover:bg-brand/90 text-black font-semibold py-3 rounded-2xl transition-all">
                        Try Again
                      </button>
                      <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-semibold py-3 rounded-2xl transition-all">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}