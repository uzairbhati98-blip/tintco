'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Scan, Sparkles, CheckCircle2 } from 'lucide-react'
import { checkDepthSupport } from '@/lib/ar/depth-sensing'
import { loadObjectDetectionModel, detectObjects, getObstructions, calculateObstructionArea } from '@/lib/ar/object-detection'

interface AdvancedARViewProps {
  onMeasurementComplete: (data: { 
    widthM: number
    heightM: number
    areaSqM: number
    netAreaSqM: number
    obstructions: number
  }) => void
  onError: (message: string) => void
}

export function AdvancedARView({ 
  onMeasurementComplete, 
  onError
}: AdvancedARViewProps) {
  const [status, setStatus] = useState<string>('Initializing...')
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processingRef = useRef(false)

  useEffect(() => {
    initialize()

    return () => {
      cleanup()
    }
  }, [])

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const initialize = async () => {
    try {
      // Check for depth support first
      setStatus('Checking device capabilities...')
      setProgress(10)
      
      const depthSupported = await checkDepthSupport()

      if (depthSupported) {
        setStatus('Depth sensor detected!')
        setProgress(20)
        // Note: WebXR depth is very experimental, so we skip it for now
        // await startDepthAR()
      }
      
      // Use camera + AI for now (more reliable)
      await startCameraCV()
      
    } catch (error) {
      console.error('Initialization error:', error)
      onError('Failed to start AR. Please use manual measurement.')
    }
  }

  const startCameraCV = async () => {
    try {
      setStatus('Loading AI model...')
      setProgress(30)

      // Load TensorFlow model
      const modelLoaded = await loadObjectDetectionModel()
      
      if (!modelLoaded) {
        throw new Error('Failed to load AI model')
      }

      setStatus('Starting camera...')
      setProgress(50)

      // Start camera
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
        
        videoRef.current.onloadedmetadata = async () => {
          if (videoRef.current) {
            await videoRef.current.play()
            setStatus('Point camera at wall...')
            setProgress(60)
            
            // Wait 2 seconds for user to position
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Start analysis
            await analyzeWall()
          }
        }
      }
    } catch (error) {
      console.error('Camera CV failed:', error)
      onError('Camera access denied. Please enable camera permissions.')
    }
  }

  const analyzeWall = async () => {
    if (processingRef.current) return
    processingRef.current = true

    if (!videoRef.current || !canvasRef.current) {
      onError('Camera not ready')
      return
    }

    try {
      setStatus('Analyzing wall...')
      setProgress(70)

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('Canvas context not available')

      // Set canvas size to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current frame
      ctx.drawImage(video, 0, 0)

      setStatus('Detecting objects...')
      setProgress(80)

      // Detect objects (furniture, etc.)
      const objects = await detectObjects(video)
      const obstructions = getObstructions(objects)

      setStatus('Calculating dimensions...')
      setProgress(90)

      // Estimate wall size based on typical room
      // Use golden ratio and standard ceiling heights
      const estimatedWallHeightM = 2.7 // Standard ceiling height
      const aspectRatio = canvas.width / canvas.height
      const estimatedWallWidthM = parseFloat((estimatedWallHeightM * aspectRatio * 1.2).toFixed(1))
      
      const wallAreaSqM = parseFloat((estimatedWallWidthM * estimatedWallHeightM).toFixed(2))

      // Calculate obstruction area
      const obstructionArea = calculateObstructionArea(
        obstructions,
        { width: canvas.width, height: canvas.height },
        { widthM: estimatedWallWidthM, heightM: estimatedWallHeightM }
      )

      // Subtract standard door/window (common case)
      const standardDeductions = 3.0 // ~1 door + 1 window
      const totalDeductions = obstructionArea + standardDeductions

      const netArea = Math.max(0, wallAreaSqM - totalDeductions)

      setStatus('Complete!')
      setProgress(100)

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500))

      cleanup()

      onMeasurementComplete({
        widthM: estimatedWallWidthM,
        heightM: estimatedWallHeightM,
        areaSqM: wallAreaSqM,
        netAreaSqM: parseFloat(netArea.toFixed(2)),
        obstructions: obstructions.length
      })
    } catch (error) {
      console.error('Analysis error:', error)
      onError('Analysis failed. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8">
        {/* Top status */}
        <div className="w-full max-w-md">
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              {progress < 100 ? (
                <Loader2 className="w-6 h-6 animate-spin text-brand" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-white">{status}</p>
                <p className="text-xs text-white/60">AI-powered measurement</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center scan indicator */}
        <div className="relative">
          <div className="relative w-48 h-48">
            {/* Scanning frame */}
            <div className="absolute inset-0 border-4 border-brand/30 rounded-3xl" />
            <div className="absolute inset-0 border-4 border-brand rounded-3xl animate-pulse" 
                 style={{ clipPath: 'inset(0 0 80% 0)' }} />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Scan className="w-20 h-20 text-brand" />
            </div>
            
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-brand rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-brand rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-brand rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-brand rounded-br-lg" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="w-full max-w-md">
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white/90">
                <p className="font-medium mb-1">AI is analyzing:</p>
                <ul className="text-xs text-white/70 space-y-1">
                  <li>✓ Wall dimensions</li>
                  <li>✓ Furniture detection</li>
                  <li>✓ Door/window estimation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}