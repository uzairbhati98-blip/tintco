/**
 * Object detection to identify and remove furniture, doors, windows
 */

import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs-backend-webgl'

let model: cocoSsd.ObjectDetection | null = null
let modelLoading = false

export interface DetectedObject {
  class: string
  score: number
  bbox: [number, number, number, number] // [x, y, width, height]
  area: number
}

/**
 * Load COCO-SSD model for object detection
 */
export async function loadObjectDetectionModel(): Promise<boolean> {
  if (model) return true
  if (modelLoading) {
    // Wait for existing load to complete
    await new Promise(resolve => setTimeout(resolve, 100))
    return loadObjectDetectionModel()
  }
  
  modelLoading = true
  
  try {
    model = await cocoSsd.load({
      base: 'lite_mobilenet_v2' // Fastest for mobile
    })
    modelLoading = false
    return true
  } catch (error) {
    console.error('Failed to load object detection model:', error)
    modelLoading = false
    return false
  }
}

/**
 * Detect objects in video frame
 */
export async function detectObjects(
  videoElement: HTMLVideoElement
): Promise<DetectedObject[]> {
  if (!model) {
    const loaded = await loadObjectDetectionModel()
    if (!loaded || !model) return []
  }

  try {
    const predictions = await model.detect(videoElement, 5) // Max 5 objects for speed
    
    return predictions.map(pred => ({
      class: pred.class,
      score: pred.score,
      bbox: pred.bbox,
      area: pred.bbox[2] * pred.bbox[3] // width * height
    }))
  } catch (error) {
    console.error('Object detection failed:', error)
    return []
  }
}

/**
 * Filter objects that should be excluded from wall measurement
 */
export function getObstructions(objects: DetectedObject[]): DetectedObject[] {
  const obstructionClasses = [
    'person',
    'chair',
    'couch',
    'bed',
    'dining table',
    'tv',
    'laptop',
    'book',
    'clock',
    'vase',
    'potted plant',
    'refrigerator',
    'oven',
    'microwave'
  ]

  return objects.filter(obj => 
    obstructionClasses.includes(obj.class) && obj.score > 0.5
  )
}

/**
 * Calculate total obstruction area
 */
export function calculateObstructionArea(
  obstructions: DetectedObject[],
  wallBounds: { width: number; height: number },
  wallRealSize: { widthM: number; heightM: number }
): number {
  if (obstructions.length === 0) return 0

  const pixelsPerMeterX = wallBounds.width / wallRealSize.widthM
  const pixelsPerMeterY = wallBounds.height / wallRealSize.heightM

  let totalAreaM2 = 0

  obstructions.forEach(obj => {
    const [, , widthPx, heightPx] = obj.bbox
    const widthM = widthPx / pixelsPerMeterX
    const heightM = heightPx / pixelsPerMeterY
    totalAreaM2 += widthM * heightM
  })

  return parseFloat(totalAreaM2.toFixed(2))
}

/**
 * Estimate standard door/window deductions
 */
export function estimateStandardDeductions(
  doors: number = 1,
  windows: number = 2
): number {
  const DOOR_AREA = 2.1 * 0.9 // 2.1m height x 0.9m width
  const WINDOW_AREA = 1.2 * 1.0 // 1.2m height x 1.0m width
  
  return (doors * DOOR_AREA) + (windows * WINDOW_AREA)
}