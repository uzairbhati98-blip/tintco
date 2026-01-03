'use client'

import { useEffect, useState } from 'react'
import { checkWebXRSupport } from '@/lib/ar/webxr-detector'

export function ARDebugInfo() {
  const [info, setInfo] = useState<string>('Checking...')

  useEffect(() => {
    const check = async () => {
      const support = await checkWebXRSupport()
      
      const debugInfo = `
Device: ${navigator.userAgent}
WebXR Available: ${'xr' in navigator}
WebXR Supported: ${support.supported}
Immersive AR: ${support.immersiveAR}
Hit Test: ${support.hitTest}
Plane Detection: ${support.planeDetection}
Message: ${support.message}

Camera Available: ${navigator.mediaDevices ? 'Yes' : 'No'}
      `.trim()
      
      setInfo(debugInfo)
    }
    check()
  }, [])

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-h-64 overflow-auto">
      <pre className="whitespace-pre-wrap">{info}</pre>
    </div>
  )
}