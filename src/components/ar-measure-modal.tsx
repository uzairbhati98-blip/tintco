'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle2, Loader2, AlertCircle, X, Crosshair } from 'lucide-react'
import {
  requestCameraAccess,
  stopCameraStream,
  calculateDimensions,
  calculateDistance,
  type Point,
  type MeasurementPoints
} from '@/lib/ar/camera-utils'

type ARState = 'idle' | 'permissions' | 'calibration' | 'measuring' | 'processing' | 'success' | 'error'

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
  
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  // Measurement state
  const [measurementPoints, setMeasurementPoints] = useState<MeasurementPoints>({
    widthStart: null,
    widthEnd: null,
    heightStart: null,
    heightEnd: null
  })
  const [referencePixels, setReferencePixels] = useState<number>(0)
  const [currentStep, setCurrentStep] = useState<'reference' | 'width' | 'height'>('reference')

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      stopCameraStream(streamRef.current)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setState('idle')
      setProgress(0)
      setErrorMessage('')
      setMeasurementPoints({
        widthStart: null,
        widthEnd: null,
        heightStart: null,
        heightEnd: null
      })
      setReferencePixels(0)
      setCurrentStep('reference')
    } else {
      // Stop camera when modal closes
      stopCameraStream(streamRef.current)
      streamRef.current = null
    }
  }, [isOpen])

  const startMeasurement = async () => {
    setState('permissions')
    setProgress(10)

    // Request camera access
    const stream = await requestCameraAccess()
    
    if (!stream) {
      setState('error')
      setErrorMessage('Camera permission denied. Please enable camera access in your browser settings.')
      return
    }

    streamRef.current = stream
    
    // Wait for video element
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      await videoRef.current.play()
    }

    setProgress(30)
    setState('calibration')
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state !== 'calibration' && state !== 'measuring') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height

    const point: Point = { x, y }

    if (state === 'calibration') {
      // Calibration: tap two corners of credit card
      if (!measurementPoints.widthStart) {
        setMeasurementPoints(prev => ({ ...prev, widthStart: point }))
        drawPoint(point, '#FFCA2C')
      } else if (!measurementPoints.widthEnd) {
        setMeasurementPoints(prev => ({ ...prev, widthEnd: point }))
        drawPoint(point, '#FFCA2C')
        
        // Calculate reference distance
        const refDistance = calculateDistance(measurementPoints.widthStart, point)
        setReferencePixels(refDistance)
        
        // Move to measuring
        setTimeout(() => {
          setState('measuring')
          setProgress(50)
          setCurrentStep('width')
          // Reset for actual measurements
          setMeasurementPoints({
            widthStart: null,
            widthEnd: null,
            heightStart: null,
            heightEnd: null
          })
          clearCanvas()
        }, 500)
      }
    } else if (state === 'measuring') {
      // Measure wall dimensions
      if (currentStep === 'width') {
        if (!measurementPoints.widthStart) {
          setMeasurementPoints(prev => ({ ...prev, widthStart: point }))
          drawPoint(point, '#10b981')
        } else if (!measurementPoints.widthEnd) {
          setMeasurementPoints(prev => ({ ...prev, widthEnd: point }))
          drawPoint(point, '#10b981')
          setCurrentStep('height')
          setProgress(70)
        }
      } else if (currentStep === 'height') {
        if (!measurementPoints.heightStart) {
          setMeasurementPoints(prev => ({ ...prev, heightStart: point }))
          drawPoint(point, '#3b82f6')
        } else if (!measurementPoints.heightEnd) {
          setMeasurementPoints(prev => ({ ...prev, heightEnd: point }))
          drawPoint(point, '#3b82f6')
          
          // All points captured - calculate
          processMeasurements({ ...measurementPoints, heightEnd: point })
        }
      }
    }
  }

  const drawPoint = (point: Point, color: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw ring
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(point.x, point.y, 15, 0, 2 * Math.PI)
    ctx.stroke()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const processMeasurements = async (points: MeasurementPoints) => {
    setState('processing')
    setProgress(90)

    try {
      const result = calculateDimensions(points, referencePixels)
      
      setMeasurements({
        areaSqM: result.areaSqM,
        dimensions: result.dimensions,
        roomType: 'living_room'
      })
      
      setProgress(100)
      setState('success')

      // Stop camera
      stopCameraStream(streamRef.current)
      streamRef.current = null

      // Call success after showing results
      setTimeout(() => {
        onSuccess({
          areaSqM: result.areaSqM,
          dimensions: result.dimensions,
          roomType: 'living_room'
        })
        onClose()
      }, 2500)
    } catch (error) {
      setState('error')
      setErrorMessage('Failed to calculate measurements. Please try again.')
    }
  }

  const retry = () => {
    setState('idle')
    setProgress(0)
    setErrorMessage('')
    setMeasurementPoints({
      widthStart: null,
      widthEnd: null,
      heightStart: null,
      heightEnd: null
    })
    setReferencePixels(0)
    setCurrentStep('reference')
    stopCameraStream(streamRef.current)
    streamRef.current = null
  }

  const handleClose = () => {
    stopCameraStream(streamRef.current)
    streamRef.current = null
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
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
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 z-50">
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
            onClick={handleClose}
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
                <h3 className="text-2xl font-bold mb-2">AR Measurement</h3>
                <p className="text-text/70 mb-6">
                  Measure your space for <span className="font-semibold">{productName}</span>
                </p>
                <button
                  onClick={startMeasurement}
                  className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-4 rounded-2xl transition-all hover:shadow-lg active:scale-95"
                >
                  Start Camera
                </button>
                <p className="mt-4 text-xs text-text/50">You'll need a credit card for scale reference</p>
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

            {(state === 'calibration' || state === 'measuring') && (
              <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                {/* Camera Feed */}
                <div className="relative mb-4 rounded-2xl overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    onClick={handleCanvasClick}
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                  />
                  
                  {/* Crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <Crosshair className="w-8 h-8 text-brand animate-pulse" />
                  </div>
                </div>

                {/* Instructions */}
                {state === 'calibration' && (
                  <div className="bg-brand/10 rounded-2xl p-4">
                    <h3 className="text-lg font-semibold mb-2">📏 Calibration</h3>
                    <p className="text-sm text-text/70">
                      {!measurementPoints.widthStart 
                        ? "Place a credit card on the wall and tap its LEFT corner"
                        : "Now tap the RIGHT corner of the credit card"}
                    </p>
                  </div>
                )}

                {state === 'measuring' && currentStep === 'width' && (
                  <div className="bg-green-50 rounded-2xl p-4">
                    <h3 className="text-lg font-semibold mb-2 text-green-700">📐 Measure Width</h3>
                    <p className="text-sm text-text/70">
                      {!measurementPoints.widthStart 
                        ? "Tap the LEFT edge of the wall"
                        : "Now tap the RIGHT edge of the wall"}
                    </p>
                  </div>
                )}

                {state === 'measuring' && currentStep === 'height' && (
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">📏 Measure Height</h3>
                    <p className="text-sm text-text/70">
                      {!measurementPoints.heightStart 
                        ? "Tap the BOTTOM of the wall"
                        : "Now tap the TOP of the wall"}
                    </p>
                  </div>
                )}
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
                <h3 className="text-xl font-semibold mb-2">Measurement Failed</h3>
                <p className="text-text/70 mb-6">{errorMessage}</p>
                <div className="flex gap-3">
                  <button onClick={retry} className="flex-1 bg-brand hover:bg-brand/90 text-black font-semibold py-3 rounded-2xl transition-all">
                    Try Again
                  </button>
                  <button onClick={handleClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-semibold py-3 rounded-2xl transition-all">
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