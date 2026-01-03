import { ARMeasurement } from './types'


/** Integration point — call this from native/web AR and pipe into store */
export function ingestARMeasurement(measurements: ARMeasurement[]): ARMeasurement[] {
// In real life, validate/normalize here before updating quote store
return measurements
}


/** Deterministic mock for dev builds */
export async function simulateAR(): Promise<ARMeasurement[]> {
// 3 walls, 3m x 2.6m each
const widthM = 3
const heightM = 2.6
const count = 3
const areaSqM = +(widthM * heightM).toFixed(2)
return [
{ wallId: 'w1', widthM, heightM, areaSqM, count: 1, notes: 'Living Room' },
{ wallId: 'w2', widthM, heightM, areaSqM, count: 1, notes: 'Dining' },
{ wallId: 'w3', widthM, heightM, areaSqM, count: 1, notes: 'Hall' },
]
}