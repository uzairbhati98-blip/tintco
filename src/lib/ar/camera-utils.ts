/**
 * Camera utilities for AR measurement
 */

export interface Point {
  x: number
  y: number
}

export interface MeasurementPoints {
  widthStart: Point | null
  widthEnd: Point | null
  heightStart: Point | null
  heightEnd: Point | null
}

/**
 * Request camera access
 */
export async function requestCameraAccess(): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Use back camera on mobile
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })
    return stream
  } catch (error) {
    console.error('Camera access denied:', error)
    return null
  }
}

/**
 * Calculate distance between two points in pixels
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Convert pixel distance to meters using reference object
 * Credit card width = 85.6mm = 0.0856m
 */
export function pixelsToMeters(
  pixelDistance: number,
  referencePixels: number,
  referenceMeters: number = 0.0856 // Credit card width
): number {
  return (pixelDistance / referencePixels) * referenceMeters
}

/**
 * Calculate dimensions from measurement points
 */
export function calculateDimensions(
  points: MeasurementPoints,
  referencePixels: number
): { widthM: number; heightM: number; areaSqM: number; dimensions: string } {
  if (!points.widthStart || !points.widthEnd || !points.heightStart || !points.heightEnd) {
    throw new Error('All measurement points required')
  }

  const widthPixels = calculateDistance(points.widthStart, points.widthEnd)
  const heightPixels = calculateDistance(points.heightStart, points.heightEnd)

  const widthM = pixelsToMeters(widthPixels, referencePixels)
  const heightM = pixelsToMeters(heightPixels, referencePixels)
  const areaSqM = parseFloat((widthM * heightM).toFixed(2))

  return {
    widthM: parseFloat(widthM.toFixed(2)),
    heightM: parseFloat(heightM.toFixed(2)),
    areaSqM,
    dimensions: `${widthM.toFixed(1)}m × ${heightM.toFixed(1)}m`
  }
}

/**
 * Stop camera stream
 */
export function stopCameraStream(stream: MediaStream | null) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}