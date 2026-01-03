import { create } from 'zustand'
import type { ARMeasurement, QuoteRequest, Product } from '../types'
import { sqmToSqft } from '../utils'


interface QuoteState {
current?: QuoteRequest
setFromProduct: (product: Product) => void
setArea: (sqm: number) => void
setSurface: (s: QuoteRequest['surfaceType']) => void
setPrep: (p: boolean) => void
setEmail: (e: string) => void
injectAR: (m: ARMeasurement[]) => void
estimate: (product: Product) => { subtotal: number; factors: { surface: number; prep: number } }
reset: () => void
}


export const useQuote = create<QuoteState>((set, get) => ({
current: undefined,
setFromProduct: (product) => set({ current: { productId: product.id, productName: product.name, surfaceType: 'drywall', prepRequired: false, areaSqM: 0, rooms: 1 } }),
setArea: (sqm) => set(state => state.current ? { current: { ...state.current, areaSqM: Math.max(0, sqm) } } : state),
setSurface: (s) => set(state => state.current ? { current: { ...state.current, surfaceType: s } } : state),
setPrep: (p) => set(state => state.current ? { current: { ...state.current, prepRequired: p } } : state),
setEmail: (e) => set(state => state.current ? { current: { ...state.current, customerEmail: e } } : state),
injectAR: (m) => set(state => state.current ? {
current: { ...state.current, measurements: m, areaSqM: m.reduce((a, b) => a + b.areaSqM * (b.count ?? 1), 0) }
} : state),
estimate: (product) => {
const q = get().current
const areaSqM = q?.areaSqM ?? 0
const areaSqft = product.unit === 'sqft' ? sqmToSqft(areaSqM) : areaSqM
// Mock multipliers
const surfaceFactor = q?.surfaceType === 'plaster' ? 1.1 : q?.surfaceType === 'concrete' ? 1.15 : q?.surfaceType === 'wood' ? 1.12 : 1.0
const prepFactor = q?.prepRequired ? 1.2 : 1.0
const subtotal = +(areaSqft * product.price * surfaceFactor * prepFactor).toFixed(2)
return { subtotal, factors: { surface: surfaceFactor, prep: prepFactor } }
},
reset: () => set({ current: undefined })
}))