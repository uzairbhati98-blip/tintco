/**
 * WebXR-based automatic wall measurement
 */

export interface WallMeasurement {
  widthM: number
  heightM: number
  areaSqM: number
  confidence: number
  points: DOMPointReadOnly[]
}

/**
 * Start WebXR AR session and detect walls
 */
export async function startWebXRMeasurement(
  onProgress: (message: string) => void
): Promise<XRSession | null> {
  const xr = (navigator as any).xr

  if (!xr) {
    throw new Error('WebXR not available')
  }

  try {
    onProgress('Requesting AR session...')

    const session: XRSession = await xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['plane-detection', 'dom-overlay'],
      domOverlay: { root: document.body }
    })

    onProgress('AR session started')

    return session
  } catch (error) {
    console.error('Failed to start WebXR session:', error)
    throw new Error('Could not start AR session')
  }
}

/**
 * Measure wall dimensions from detected plane
 */
export function measureWallFromPlane(plane: XRPlane): WallMeasurement {
  // Get plane polygon points
  const polygon = plane.polygon

  if (polygon.length < 4) {
    throw new Error('Invalid plane - need at least 4 points')
  }

  // Calculate width and height from plane bounds
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  polygon.forEach(point => {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  })

  const widthM = parseFloat((maxX - minX).toFixed(2))
  const heightM = parseFloat((maxY - minY).toFixed(2))
  const areaSqM = parseFloat((widthM * heightM).toFixed(2))

  return {
    widthM,
    heightM,
    areaSqM,
    confidence: 0.85,
    points: polygon
  }
}

/**
 * Setup hit test source for point selection (with proper error handling)
 * Returns undefined instead of null to match WebXR types
 */
export async function setupHitTestSource(
  session: XRSession,
  referenceSpace: XRReferenceSpace
): Promise<XRHitTestSource | undefined> {  // Changed to undefined
  try {
    // Check if requestHitTestSource exists
    if (typeof session.requestHitTestSource !== 'function') {
      console.warn('Hit test not supported on this session')
      return undefined  // Changed to undefined
    }

    const hitTestSource = await session.requestHitTestSource({ 
      space: referenceSpace 
    })
    return hitTestSource
  } catch (error) {
    console.error('Hit test not supported:', error)
    return undefined  // Changed to undefined
  }
}

/**
 * Perform hit test at screen center (with undefined check)
 */
export function performHitTest(
  frame: XRFrame,
  hitTestSource: XRHitTestSource | undefined  // Changed to undefined
): XRHitTestResult[] {
  if (!hitTestSource) {
    return []
  }
  
  try {
    return frame.getHitTestResults(hitTestSource)
  } catch (error) {
    console.error('Hit test failed:', error)
    return []
  }
}

/**
 * Calculate distance between two 3D points
 */
export function calculateDistance3D(p1: DOMPointReadOnly, p2: DOMPointReadOnly): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const dz = p2.z - p1.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}