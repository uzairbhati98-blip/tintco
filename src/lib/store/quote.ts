"use client"

import { create } from "zustand"
import type { Product, ARMeasurement, QuoteRequest } from "@/lib/types"

type QuoteState = {
  request: QuoteRequest | null
  setFromProduct: (product: Product) => void
  ingestARMeasurement: (m: ARMeasurement) => void
  clearQuote: () => void
}

export const useQuote = create<QuoteState>((set, get) => ({
  request: null,

  setFromProduct: (product) =>
    set({
      request: {
        productId: product.id,
        productName: product.name,
        surfaceType: "plaster",
        prepRequired: false,
        areaSqM: 0,
        rooms: 1,
        measurements: [],
        customerEmail: undefined,
      },
    }),

  ingestARMeasurement: (m) =>
    set((state) => {
      const req = state.request ?? {
        productId: "",
        productName: "",
        surfaceType: "plaster",
        prepRequired: false,
        areaSqM: 0,
        rooms: 1,
        measurements: [],
      }
      const measurements = [...(req.measurements ?? []), m]
      const areaSqM =
        measurements.reduce((sum, x) => sum + (Number(x.areaSqM) || (Number(x.widthM) || 0) * (Number(x.heightM) || 0)) * (x.count || 1), 0)

      return { request: { ...req, measurements, areaSqM } }
    }),

  clearQuote: () => set({ request: null }),
}))
