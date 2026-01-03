'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle2, Loader2, AlertCircle, X, Ruler, CreditCard } from 'lucide-react'

type ARState = 'idle' | 'camera' | 'calibration' | 'measuring' | 'success' | 'error' | 'manual'

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
  
  // Measurement state
  const [calibrationPoints, setCalibrationPoints] = useState<Point[]>([])
  const [measurementPoints, setMeasurementPoints] = useState<Point[]>([])
  const [referencePixels, setReferencePixels] = useState(0)
  const [step, setStep] = useState<'width' | 'height'>('width')
  
  // Manual input
  const [manualWidth, setManualWidth] = useState('')
  const [manualHeight, setManualHeight] = useState('')

  useEffect(() => {
    if (isOpen) {
      setState('idle')
      resetMeasurement()
    } else {
      stopCamera()
    }
  }, [isOpen])

  const resetMeasurement = () => {
    setCalibrationPoints([])
    setMeasurementPoints([])
    setReferencePixels(0)
    setStep('width')
    setManualWidth('')
    setManualHeight('')
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

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
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current && canvasRef.current) {
            // Set canvas size to match video
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
            
            videoRef.current.play()
            setState('calibration')
          }
        }
      }
    } catch (error) {
      console.error('Camera error:', error)
      setState('error')
      setErrorMessage('Camera access denied. Would you like to enter dimensions manually?')
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get click coordinates relative to canvas
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const newPoint = { x, y }

    if (state === 'calibration') {
      handleCalibrationClick(newPoint)
    } else if (state === 'measuring') {
      handleMeasurementClick(newPoint)
    }
  }

  const handleCalibrationClick = (point: Point) => {
    const newPoints = [...calibrationPoints, point]
    setCalibrationPoints(newPoints)

    // Draw point
    drawPoint(point, '#FFCA2C', 12)

    if (newPoints.length === 2) {
      // Calculate reference distance (credit card width = 85.6mm = 0.0856m)
      const distance = calculateDistance(newPoints[0], newPoints[1])
      setReferencePixels(distance)
      
      // Move to measuring
      setTimeout(() => {
        setState('measuring')
        setCalibrationPoints([])
        clearCanvas()
      }, 500)
    }
  }

  const handleMeasurementClick = (point: Point) => {
    const newPoints = [...measurementPoints, point]
    setMeasurementPoints(newPoints)

    // Draw point with color based on step
    const color = step === 'width' ? '#10b981' : '#3b82f6'
    drawPoint(point, color, 10)

    // Draw line if we have 2 points for current measurement
    if (newPoints.length === 2 || newPoints.length === 4) {
      const startIdx = newPoints.length === 2 ? 0 : 2
      drawLine(newPoints[startIdx], newPoints[startIdx + 1], color)
    }

    // Progress logic
    if (step === 'width' && newPoints.length === 2) {
      setStep('height')
    } else if (step === 'height' && newPoints.length === 4) {
      calculateMeasurement(newPoints)
    }
  }

  const drawPoint = (point: Point, color: string, size: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Inner circle
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(point.x, point.y, size, 0, 2 * Math.PI)
    ctx.fill()

    // Outer ring
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(point.x, point.y, size + 8, 0, 2 * Math.PI)
    ctx.stroke()
  }

  const drawLine = (p1: Point, p2: Point, color: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
    ctx.setLineDash([])
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const calculateDistance = (p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const calculateMeasurement = (points: Point[]) => {
    if (referencePixels === 0) {
      setState('error')
      setErrorMessage('Calibration error. Please try again.')
      return
    }

    stopCamera()

    // Calculate pixel distances
    const widthPx = calculateDistance(points[0], points[1])
    const heightPx = calculateDistance(points[2], points[3])

    // Convert to meters using credit card reference (85.6mm = 0.0856m)
    const CREDIT_CARD_WIDTH_M = 0.0856
    const widthM = (widthPx / referencePixels) * CREDIT_CARD_WIDTH_M
    const heightM = (heightPx / referencePixels) * CREDIT_CARD_WIDTH_M

    const areaSqM = parseFloat((widthM * heightM).toFixed(2))

    setMeasurements({
      areaSqM,
      dimensions: `${widthM.toFixed(1)}m × ${heightM.toFixed(1)}m`,
      roomType: 'living_room'
    })

    setState('success')

    setTimeout(() => {
      onSuccess({
        areaSqM,
        dimensions: `${widthM.toFixed(1)}m × ${heightM.toFixed(1)}m`,
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
    resetMeasurement()
  }

  const retry = () => {
    resetMeasurement()
    startCamera()
  }

  if (!isOpen) return null

  // Fullscreen camera view
  if (state === 'camera' || state === 'calibration' || state === 'measuring') {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Canvas overlay */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 w-full h-full cursor-crosshair"
        />

        {/* Instructions overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6">
            <button
              onClick={() => {
                stopCamera()
                setState('idle')
                resetMeasurement()
              }}
              className="pointer-events-auto p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Bottom instructions */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
            {state === 'calibration' && (
              <div className="text-white space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-8 h-8 text-brand" />
                  <div>
                    <h3 className="text-xl font-bold">Step 1: Calibration</h3>
                    <p className="text-sm text-white/70">Place a credit card on the wall</p>
                  </div>
                </div>
                <div className="bg-brand/20 backdrop-blur rounded-2xl p-4">
                  <p className="font-medium">
                    {calibrationPoints.length === 0 
                      ? '📍 Tap the LEFT edge of credit card'
                      : '📍 Tap the RIGHT edge of credit card'}
                  </p>
                  <p className="text-xs text-white/60 mt-2">
                    Points: {calibrationPoints.length}/2
                  </p>
                </div>
              </div>
            )}

            {state === 'measuring' && (
              <div className="text-white space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <Ruler className="w-8 h-8 text-brand" />
                  <div>
                    <h3 className="text-xl font-bold">
                      Step {step === 'width' ? '2' : '3'}: Measure {step === 'width' ? 'Width' : 'Height'}
                    </h3>
                    <p className="text-sm text-white/70">Tap the corners</p>
                  </div>
                </div>
                <div className={`backdrop-blur rounded-2xl p-4 ${
                  step === 'width' ? 'bg-green-500/20' : 'bg-blue-500/20'
                }`}>
                  <p className="font-medium">
                    {step === 'width' 
                      ? measurementPoints.length === 0
                        ? '📍 Tap LEFT edge of wall'
                        : '📍 Tap RIGHT edge of wall'
                      : measurementPoints.length === 2
                        ? '📍 Tap BOTTOM of wall'
                        : '📍 Tap TOP of wall'
                    }
                  </p>
                  <p className="text-xs text-white/60 mt-2">
                    Points: {measurementPoints.length}/4
                  </p>
                </div>
              </div>
            )}

            {/* Switch to manual button */}
            <button
              onClick={switchToManual}
              className="pointer-events-auto mt-4 w-full bg-white/10 backdrop-blur hover:bg-white/20 text-white font-medium py-3 rounded-2xl transition-all"
            >
              Switch to Manual Entry
            </button>
          </div>
        </div>
      </div>
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
                    📱 Use Camera (Accurate)
                  </button>

                  <button
                    onClick={switchToManual}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-text font-semibold py-4 rounded-2xl transition-all"
                  >
                    📏 Enter Manually
                  </button>
                </div>

                <p className="mt-4 text-xs text-text/50">
                  Camera method uses a credit card for accurate calibration
                </p>
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

                  <button
                    onClick={startCamera}
                    className="w-full text-text/60 hover:text-text text-sm"
                  >
                    ← Back to Camera
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
                    onClick={retry}
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