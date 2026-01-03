'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle2, Loader2, AlertCircle, X, Ruler } from 'lucide-react'

type ARState = 'idle' | 'camera' | 'measuring' | 'success' | 'error' | 'manual'

interface Point {
  x: number
  y: number
}

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
  const [errorMessage, setErrorMessage] = useState('')
  
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  // Measurement points
  const [points, setPoints] = useState<Point[]>([])
  const [step, setStep] = useState<'width' | 'height'>('width')
  
  // Manual input
  const [manualWidth, setManualWidth] = useState('')
  const [manualHeight, setManualHeight] = useState('')

  useEffect(() => {
    if (isOpen) {
      setState('idle')
      setPoints([])
      setStep('width')
      setManualWidth('')
      setManualHeight('')
    } else {
      stopCamera()
    }
  }, [isOpen])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const startCamera = async () => {
    setState('camera')
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setState('measuring')
      }
    } catch (error) {
      console.error('Camera error:', error)
      setState('error')
      setErrorMessage('Camera access denied. Would you like to enter dimensions manually?')
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state !== 'measuring') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPoint = { x, y }
    const newPoints = [...points, newPoint]
    setPoints(newPoints)

    // Draw point
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = step === 'width' ? '#10b981' : '#3b82f6'
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = step === 'width' ? '#10b981' : '#3b82f6'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Check progress
    if (step === 'width' && newPoints.length === 2) {
      setStep('height')
    } else if (step === 'height' && newPoints.length === 4) {
      calculateMeasurement(newPoints)
    }
  }

  const calculateMeasurement = (points: Point[]) => {
    stopCamera()
    
    // Calculate distances in pixels
    const widthPx = Math.sqrt(
      Math.pow(points[1].x - points[0].x, 2) + 
      Math.pow(points[1].y - points[0].y, 2)
    )
    
    const heightPx = Math.sqrt(
      Math.pow(points[3].x - points[2].x, 2) + 
      Math.pow(points[3].y - points[2].y, 2)
    )
    
    // Estimate: assume user is ~2m from wall
    // Average room: 4m wide, 2.8m tall
    // This is rough but gives reasonable estimates
    const pixelToMeter = 0.01 // Calibration factor
    
    const widthM = parseFloat((widthPx * pixelToMeter).toFixed(1))
    const heightM = parseFloat((heightPx * pixelToMeter).toFixed(1))
    const areaSqM = parseFloat((widthM * heightM).toFixed(2))
    
    setMeasurements({
      areaSqM,
      dimensions: `${widthM}m × ${heightM}m`,
      roomType: 'living_room'
    })
    
    setState('success')
    
    setTimeout(() => {
      onSuccess({
        areaSqM,
        dimensions: `${widthM}m × ${heightM}m`,
        roomType: 'living_room'
      })
      onClose()
    }, 2500)
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
      dimensions: `${width}m × ${height}m`,
      roomType: 'living_room'
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

  const switchToManual = () => {
    stopCamera()
    setState('manual')
    setErrorMessage('')
  }

  if (!isOpen) return null

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
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
      >
        {(state === 'idle' || state === 'error' || state === 'manual') && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-50"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-8">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div key="idle" className="text-center">
                <div className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-brand/20 to-brand/10 rounded-3xl flex items-center justify-center">
                  <Camera className="w-12 h-12 text-brand" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Measure Your Space</h3>
                <p className="text-text/70 mb-6">
                  For <span className="font-semibold">{productName}</span>
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-4 rounded-2xl transition-all"
                  >
                    📱 Use Camera
                  </button>
                  
                  <button
                    onClick={switchToManual}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-text font-semibold py-4 rounded-2xl transition-all"
                  >
                    📏 Enter Manually
                  </button>
                </div>
              </motion.div>
            )}

            {(state === 'camera' || state === 'measuring') && (
              <motion.div key="camera" className="text-center">
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
                </div>

                {state === 'measuring' && (
                  <div className={`rounded-2xl p-4 ${step === 'width' ? 'bg-green-50' : 'bg-blue-50'}`}>
                    <h3 className="text-lg font-semibold mb-2">
                      {step === 'width' ? '📐 Measure Width' : '📏 Measure Height'}
                    </h3>
                    <p className="text-sm text-text/70">
                      {step === 'width' 
                        ? points.length === 0 
                          ? 'Tap LEFT edge of wall'
                          : 'Tap RIGHT edge of wall'
                        : points.length === 2
                          ? 'Tap BOTTOM of wall'
                          : 'Tap TOP of wall'
                      }
                    </p>
                    <p className="text-xs text-text/50 mt-2">
                      Points: {points.length}/4
                    </p>
                  </div>
                )}

                <button
                  onClick={switchToManual}
                  className="mt-4 text-sm text-text/60 hover:text-text"
                >
                  Switch to manual entry
                </button>
              </motion.div>
            )}

            {state === 'manual' && (
              <motion.div key="manual" className="text-center">
                <div className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center">
                  <Ruler className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Enter Dimensions</h3>
                <p className="text-text/70 mb-6">
                  Measure your wall and enter the dimensions
                </p>

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
                      placeholder="e.g. 2.8"
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg focus:border-brand focus:outline-none"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  )}

                  <button
                    onClick={handleManualSubmit}
                    className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-4 rounded-2xl transition-all"
                  >
                    Calculate Area
                  </button>
                </div>
              </motion.div>
            )}

            {state === 'success' && (
              <motion.div key="success" className="text-center">
                <motion.div className="mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-3xl flex items-center justify-center shadow-lg">
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
                <p className="text-sm text-text/70">Redirecting to quote...</p>
              </motion.div>
            )}

            {state === 'error' && (
              <motion.div key="error" className="text-center">
                <div className="mb-6 mx-auto w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Camera Access Needed</h3>
                <p className="text-text/70 mb-6">{errorMessage}</p>
                <div className="space-y-3">
                  <button 
                    onClick={switchToManual}
                    className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-3 rounded-2xl transition-all"
                  >
                    Enter Manually Instead
                  </button>
                  <button 
                    onClick={startCamera}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-text font-semibold py-3 rounded-2xl transition-all"
                  >
                    Try Camera Again
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