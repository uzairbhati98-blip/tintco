/**
 * WebXR feature detection and capabilities check
 */

export interface WebXRSupport {
  supported: boolean
  immersiveAR: boolean
  hitTest: boolean
  planeDetection: boolean
  message: string
}

/**
 * Check if WebXR is supported on this device
 */
export async function checkWebXRSupport(): Promise<WebXRSupport> {
  const result: WebXRSupport = {
    supported: false,
    immersiveAR: false,
    hitTest: false,
    planeDetection: false,
    message: ''
  }

  // Check if XR is available
  if (!('xr' in navigator)) {
    result.message = 'WebXR not available on this browser'
    return result
  }

  const xr = (navigator as any).xr

  if (!xr) {
    result.message = 'WebXR not available'
    return result
  }

  try {
    // Check for immersive AR support
    const isARSupported = await xr.isSessionSupported('immersive-ar')
    
    if (!isARSupported) {
      result.message = 'Immersive AR not supported on this device'
      return result
    }

    result.supported = true
    result.immersiveAR = true
    result.message = 'WebXR AR supported'

    // Don't try to create a session just to check features
    // Assume basic support if we get here
    result.hitTest = true
    result.planeDetection = true

    return result
  } catch (error) {
    result.message = `WebXR check failed: ${error}`
    return result
  }
}

/**
 * Quick check for WebXR availability (doesn't request session)
 */
export function hasWebXR(): boolean {
  return 'xr' in navigator && !!(navigator as any).xr
}

/**
 * Get user-friendly browser support message
 */
export function getBrowserSupportMessage(): string {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  const isChrome = /Chrome/.test(navigator.userAgent)

  if (isIOS) {
    if (isSafari) {
      const versionMatch = navigator.userAgent.match(/Version\/(\d+)/)
      const version = versionMatch ? parseInt(versionMatch[1]) : 0
      if (version >= 13) {
        return 'WebXR supported on iOS Safari 13+'
      }
      return 'Please update to iOS Safari 13 or later for AR features'
    }
    return 'Please use Safari on iOS for AR features'
  }

  if (isAndroid) {
    if (isChrome) {
      return 'WebXR supported on Chrome for Android'
    }
    return 'Please use Chrome on Android for AR features'
  }

  return 'WebXR AR requires iOS Safari 13+ or Chrome for Android'
}