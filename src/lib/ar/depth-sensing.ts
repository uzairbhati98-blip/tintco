/**
 * Depth sensing utilities for iPhone LiDAR and Android ARCore
 */

export interface DepthData {
  width: number
  height: number
  data: Float32Array
  available: boolean
}

/**
 * Check if depth sensing is available
 */
export async function checkDepthSupport(): Promise<boolean> {
  if (!('xr' in navigator)) return false
  
  const xr = (navigator as any).xr
  if (!xr) return false

  try {
    const supported = await xr.isSessionSupported('immersive-ar')
    if (!supported) return false

    // Try to create session with depth sensing
    const session = await xr.requestSession('immersive-ar', {
      requiredFeatures: [],
      optionalFeatures: ['depth-sensing']
    })

    const hasDepth = session.enabledFeatures?.includes('depth-sensing') || false
    await session.end()
    return hasDepth
  } catch {
    return false
  }
}

/**
 * Get depth data from XR frame
 */
export function getDepthData(frame: XRFrame, view: XRView): DepthData | null {
  try {
    // @ts-ignore - Experimental API
    const depthInfo = frame.getDepthInformation(view)
    
    if (!depthInfo) {
      return null
    }

    // Convert ArrayBuffer to Float32Array if needed
    let float32Data: Float32Array
    
    if (depthInfo.data instanceof Float32Array) {
      float32Data = depthInfo.data
    } else if (depthInfo.data instanceof ArrayBuffer) {
      float32Data = new Float32Array(depthInfo.data)
    } else {
      // Fallback: try to convert whatever we got
      float32Data = new Float32Array(depthInfo.data)
    }

    return {
      width: depthInfo.width,
      height: depthInfo.height,
      data: float32Data,
      available: true
    }
  } catch (error) {
    console.error('Error getting depth data:', error)
    return null
  }
}

/**
 * Detect wall plane from depth data
 */
export function detectWallPlane(depthData: DepthData): {
  distance: number
  boundingBox: { x: number; y: number; width: number; height: number }
} | null {
  if (!depthData.available || !depthData.data || depthData.data.length === 0) {
    return null
  }

  const { width, height, data } = depthData
  
  // Find dominant plane (most common depth value = likely a wall)
  const depthHistogram = new Map<number, number>()
  
  for (let i = 0; i < data.length; i++) {
    const depth = Math.round(data[i] * 10) / 10 // Round to 10cm buckets
    
    // Skip invalid values
    if (isNaN(depth) || depth <= 0 || depth > 10) continue
    
    depthHistogram.set(depth, (depthHistogram.get(depth) || 0) + 1)
  }

  if (depthHistogram.size === 0) return null

  // Find most common depth (likely the wall)
  let maxCount = 0
  let wallDepth = 0
  
  depthHistogram.forEach((count, depth) => {
    if (count > maxCount && depth > 0.5 && depth < 5) { // Reasonable wall distance
      maxCount = count
      wallDepth = depth
    }
  })

  if (wallDepth === 0 || maxCount < 100) return null // Not enough data points

  // Find bounding box of wall pixels
  let minX = width, maxX = 0, minY = height, maxY = 0
  let wallPixelCount = 0
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (idx >= data.length) continue
      
      const depth = Math.round(data[idx] * 10) / 10
      
      // If pixel is close to wall depth (within 20cm)
      if (Math.abs(depth - wallDepth) < 0.2) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
        wallPixelCount++
      }
    }
  }

  // Ensure we have a reasonable bounding box
  if (wallPixelCount < 100 || maxX <= minX || maxY <= minY) {
    return null
  }

  return {
    distance: wallDepth,
    boundingBox: {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }
}

/**
 * Calculate wall dimensions from depth and bounding box
 */
export function calculateWallDimensions(
  boundingBox: { x: number; y: number; width: number; height: number },
  distance: number,
  fov: number = 60 // Field of view in degrees
): { widthM: number; heightM: number; areaSqM: number } {
  // Ensure valid inputs
  if (distance <= 0 || boundingBox.width <= 0 || boundingBox.height <= 0) {
    // Return default room size
    return {
      widthM: 4.0,
      heightM: 2.7,
      areaSqM: 10.8
    }
  }

  // Convert FOV to radians
  const fovRad = (fov * Math.PI) / 180
  
  // Calculate real-world dimensions using trigonometry
  const heightM = 2 * distance * Math.tan(fovRad / 2)
  const aspectRatio = boundingBox.width / boundingBox.height
  const widthM = heightM * aspectRatio
  
  // Clamp to reasonable values
  const clampedWidthM = Math.max(2, Math.min(15, widthM))
  const clampedHeightM = Math.max(2, Math.min(4, heightM))
  
  const areaSqM = parseFloat((clampedWidthM * clampedHeightM).toFixed(2))

  return {
    widthM: parseFloat(clampedWidthM.toFixed(1)),
    heightM: parseFloat(clampedHeightM.toFixed(1)),
    areaSqM
  }
}