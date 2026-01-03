/**
 * WebXR Type Declarations
 */

interface Navigator {
  xr?: XRSystem
}

interface XRSystem {
  isSessionSupported(mode: XRSessionMode): Promise<boolean>
  requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>
}

type XRSessionMode = 'inline' | 'immersive-vr' | 'immersive-ar'

interface XRSessionInit {
  requiredFeatures?: string[]
  optionalFeatures?: string[]
  domOverlay?: { root: HTMLElement }
}

interface XRSession extends EventTarget {
  requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>
  requestAnimationFrame(callback: XRFrameRequestCallback): number
  requestHitTestSource?(options: XRHitTestOptionsInit): Promise<XRHitTestSource | undefined>  // Changed to undefined
  end(): Promise<void>
  detectedPlanes?: Set<XRPlane>
}

type XRReferenceSpaceType = 'viewer' | 'local' | 'local-floor' | 'bounded-floor' | 'unbounded'

type XRFrameRequestCallback = (time: DOMHighResTimeStamp, frame: XRFrame) => void

interface XRFrame {
  session: XRSession
  getHitTestResults(hitTestSource: XRHitTestSource): XRHitTestResult[]
  detectedPlanes?: Set<XRPlane>
}

interface XRReferenceSpace extends EventTarget {
  getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace
}

interface XRRigidTransform {
  position: DOMPointReadOnly
  orientation: DOMPointReadOnly
  matrix: Float32Array
  inverse: XRRigidTransform
}

interface XRHitTestSource {
  cancel(): void
}

interface XRHitTestResult {
  getPose(baseSpace: XRSpace): XRPose | undefined
  createAnchor?(pose: XRRigidTransform): Promise<XRAnchor>
}

interface XRPose {
  transform: XRRigidTransform
  emulatedPosition: boolean
}

interface XRSpace extends EventTarget {}

interface XRAnchor {
  anchorSpace: XRSpace
  delete(): void
}

interface XRHitTestOptionsInit {
  space: XRSpace
  offsetRay?: XRRay
}

interface XRRay {
  origin: DOMPointReadOnly
  direction: DOMPointReadOnly
  matrix: Float32Array
}

interface XRPlane {
  orientation: 'horizontal' | 'vertical'
  polygon: DOMPointReadOnly[]
  planeSpace: XRSpace
  lastChangedTime: DOMHighResTimeStamp
}

declare class DOMPointReadOnly {
  readonly x: number
  readonly y: number
  readonly z: number
  readonly w: number
  constructor(x?: number, y?: number, z?: number, w?: number)
}