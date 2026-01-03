'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle2, Loader2, AlertCircle, X } from 'lucide-react'

type ARState = 'idle' | 'permissions' | 'launching' | 'measuring' | 'processing' | 'success' | 'error'

interface ARMeasureModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: { areaSqM: number; dimensions: string; roomType: string }) => void // FIX: name matches downstream
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
    areaSqM: 0,            // FIX: metric naming
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

  const checkCameraPermissions = async () => {
    setState('permissions')
    await new Promise(r => setTimeout(r, 1000))
    if (Math.random() > 0.1) return true
    setState('error')
    setErrorMessage('Camera permission denied. Please enable camera access in your browser settings.')
    return false
  }

  const startMeasurement = async () => {
    const hasPermission = await checkCameraPermissions()
    if (!hasPermission) return

    setState('launching'); setProgress(20)
    await new Promise(r => setTimeout(r, 1500))

    setState('measuring'); setProgress(40)
    for (let i = 50; i <= 80; i += 10) {
      await new Promise(r => setTimeout(r, 500))
      setProgress(i)
    }

    setState('processing'); setProgress(90)
    await new Promise(r => setTimeout(r, 1000))

    // Generate mock metric measurements
    const mockAreaSqM = Math.floor(Math.random() * 20) + 10 // 10–29 m²
    const width = Math.floor(Math.random() * 2) + 3         // 3–4 m
    const height = Math.floor(Math.random() * 2) + 3        // 3–4 m
    const mockDimensions = `${width}m × ${height}m`
    const roomTypes = ['living_room', 'bedroom', 'kitchen', 'bathroom', 'office']
    const mockRoomType = roomTypes[Math.floor(Math.random() * roomTypes.length)]

    setMeasurements({
      areaSqM: mockAreaSqM,
      dimensions: mockDimensions,
      roomType: mockRoomType
    })
    setProgress(100)
    setState('success')

    setTimeout(() => {
      onSuccess({
        areaSqM: mockAreaSqM,            // FIX: pass metric to downstream
        dimensions: mockDimensions,
        roomType: mockRoomType
      })
      onClose()
    }, 2500)
  }

  const retry = () => {
    setState('idle'); setProgress(0); setErrorMessage('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        role="dialog" aria-modal="true" aria-label="AR Measurement"
      >
        {/* Progress bar */}
        {progress > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
            <motion.div
              className="h-full bg-brand"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Close button */}
        {(state === 'idle' || state === 'error') && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                <h3 className="text-2xl font-bold mb-2">AR Measurement</h3>
                <p className="text-text/70 mb-6">
                  Instantly measure your space for <span className="font-semibold">{productName}</span>
                </p>
                <button
                  onClick={startMeasurement}
                  className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-4 rounded-2xl transition-all hover:shadow-lg active:scale-95"
                >
                  Start AR Camera
                </button>
                <p className="mt-4 text-xs text-text/50">Make sure you're in a well-lit room with 3+ meters of space</p>
              </motion.div>
            )}

            {state === 'permissions' && (
              <motion.div key="permissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="mb-6 mx-auto w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center">
                  <Camera className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Requesting Camera Access</h3>
                <p className="text-text/70">Please allow camera access when prompted</p>
                <div className="mt-6">
                  <Loader2 className="w-6 h-6 text-brand animate-spin mx-auto" />
                </div>
              </motion.div>
            )}

            {state === 'launching' && (
              <motion.div key="launching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-brand to-brand/70 rounded-3xl flex items-center justify-center"
                >
                  <Camera className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Launching AR Camera...</h3>
                <p className="text-text/70">Preparing measurement tools</p>
              </motion.div>
            )}

            {state === 'measuring' && (
              <motion.div key="measuring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                {/* AR Viewfinder Simulation */}
                <div className="mb-6 relative mx-auto w-72 h-72">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent rounded-3xl overflow-hidden">
                    {/* Grid */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(rgba(255,202,44,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,202,44,0.1) 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                    }} />
                    {/* Scan line */}
                    <motion.div className="absolute left-0 right-0 h-0.5 bg-brand shadow-lg shadow-brand/50"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Corners (FIX: 3px borders via arbitrary values) */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-l-[3px] border-t-[3px] border-brand rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-[3px] border-t-[3px] border-brand rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-l-[3px] border-b-[3px] border-brand rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-r-[3px] border-b-[3px] border-brand rounded-br-lg" />
                    {/* Reticle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 h-8 border-2 border-brand rounded-full"
                      />
                    </div>
                    {/* Points */}
                    <motion.div className="absolute top-1/4 left-1/4 w-3 h-3 bg-brand rounded-full" animate={{ scale: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <motion.div className="absolute top-3/4 right-1/4 w-3 h-3 bg-brand rounded-full" animate={{ scale: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Scanning Your Space...</h3>
                <p className="text-text/70">Move your device slowly to capture all corners</p>
                <div className="mt-4 flex justify-center items-center gap-2">
                  <Loader2 className="w-4 h-4 text-brand animate-spin" />
                  <span className="text-sm text-brand font-medium">Detecting walls...</span>
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
                <h3 className="text-2xl font-bold mb-4">Measurement Complete!</h3>
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-text/60 mb-1">Total Area</p>
                      <p className="text-2xl font-bold text-brand">
                        {measurements.areaSqM} m² {/* FIX: unit to sq m */}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text/60 mb-1">Dimensions</p>
                      <p className="text-2xl font-bold text-brand">
                        {measurements.dimensions}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-text/60">Room Type</p>
                    <p className="text-lg font-medium capitalize">
                      {measurements.roomType.replace('_', ' ')}
                    </p>
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
                <h3 className="text-xl font-semibold mb-2">Measurement Failed</h3>
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
    </div>
  )
}
