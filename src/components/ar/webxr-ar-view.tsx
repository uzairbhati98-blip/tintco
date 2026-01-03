'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, CheckCircle2, Target } from 'lucide-react'
import { checkWebXRSupport, getBrowserSupportMessage } from '@/lib/ar/webxr-detector'
import { startWebXRMeasurement, measureWallFromPlane } from '@/lib/ar/webxr-measurement'

interface WebXRARViewProps {
  onMeasurementComplete: (data: { widthM: number; heightM: number; areaSqM: number }) => void
  onError: (message: string) => void
}

export function WebXRARView({ onMeasurementComplete, onError }: WebXRARViewProps) {
  const [status, setStatus] = useState<string>('Initializing AR...')
  const [planeDetected, setPlaneDetected] = useState(false)
  const sessionRef = useRef<XRSession | null>(null)
  const animationFrameRef = useRef<number>(0)
  const planeProcessedRef = useRef<boolean>(false)

  useEffect(() => {
    initializeAR()

    return () => {
      // Cleanup
      if (sessionRef.current) {
        sessionRef.current.end().catch(console.error)
      }
    }
  }, [])

  const initializeAR = async () => {
    try {
      // Check WebXR support
      const support = await checkWebXRSupport()

      if (!support.supported) {
        onError(getBrowserSupportMessage())
        return
      }

      setStatus('Starting AR camera...')

      // Start WebXR session
      const session = await startWebXRMeasurement((message) => setStatus(message))

      if (!session) {
        onError('Failed to create AR session')
        return
      }

      sessionRef.current = session

      // Setup render loop
      const referenceSpace = await session.requestReferenceSpace('local')
      
      const onXRFrame = (time: number, frame: XRFrame) => {
        const currentSession = frame.session
        
        // Request next frame
        animationFrameRef.current = currentSession.requestAnimationFrame(onXRFrame)

        // Prevent processing multiple times
        if (planeProcessedRef.current) {
          return
        }

        // Check for detected planes (using optional chaining)
        const detectedPlanes = (frame as any).detectedPlanes as Set<XRPlane> | undefined

        if (detectedPlanes && detectedPlanes.size > 0) {
          setStatus('Scanning detected planes...')

          // Get the first vertical plane (likely a wall)
          for (const plane of detectedPlanes.values()) {
            const orientation = (plane as any).orientation as 'horizontal' | 'vertical' | undefined

            if (orientation === 'vertical') {
              setPlaneDetected(true)
              setStatus('Wall detected! Measuring...')
              planeProcessedRef.current = true

              // Measure the plane
              setTimeout(() => {
                try {
                  const measurement = measureWallFromPlane(plane)
                  onMeasurementComplete(measurement)
                  
                  // End session
                  if (sessionRef.current) {
                    sessionRef.current.end().catch(console.error)
                  }
                } catch (err) {
                  console.error('Measurement error:', err)
                  onError('Failed to measure wall')
                }
              }, 1000)

              break
            }
          }
        } else {
          setStatus('Point your camera at a wall...')
        }
      }

      session.requestAnimationFrame(onXRFrame)

    } catch (error) {
      console.error('AR initialization failed:', error)
      onError('Failed to start AR. ' + getBrowserSupportMessage())
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white">
      {/* AR View (handled by WebXR) */}
      <div className="flex-1 w-full relative">
        {/* Reticle */}
        {!planeDetected && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Target className="w-16 h-16 text-brand animate-pulse" />
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-3 mb-4">
            {planeDetected ? (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            )}
            <p className="text-lg font-medium">{status}</p>
          </div>

          {!planeDetected && (
            <div className="space-y-2">
              <p className="text-sm text-white/70 text-center">
                Move your phone slowly to scan the wall
              </p>
              <p className="text-xs text-white/50 text-center">
                Make sure there's good lighting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}