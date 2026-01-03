"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useQuote } from "@/lib/store/quote"
import type { Product, ARMeasurement } from "@/lib/types"

type Props = {
  product: Product
}

function simulateAR(): Promise<ARMeasurement> {
  return new Promise((resolve) => {
    // Simulate delay + deterministic mock data
    setTimeout(
      () =>
        resolve({
          widthM: 4,
          heightM: 2.8,
          areaSqM: 11.2,
          count: 2,
          notes: "Simulated measurement",
        }),
      1500
    )
  })
}

export function ARMeasureButton({ product }: Props) {
  const [loading, setLoading] = useState(false)
  const ingest = useQuote((s) => s.ingestARMeasurement)
  const setFromProduct = useQuote((s) => s.setFromProduct)

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true)
          setFromProduct(product)
          const m = await simulateAR()
          ingest(m)
          toast.success("AR measurement captured", {
            description: `~${m.areaSqM.toFixed(2)} m² added to quote`,
          })
          // redirect to quote
          window.location.href = "/quote"
        } catch (err) {
          toast.error("AR measurement failed", {
            description: "Please try again.",
          })
        } finally {
          setLoading(false)
        }
      }}
      className={`px-6 py-3 rounded-2xl font-medium text-black shadow-sm focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-colors ${
        loading ? "bg-brand/50" : "bg-brand hover:bg-brand/90"
      }`}
    >
      {loading ? "Measuring..." : "Measure with AR"}
    </motion.button>
  )
}
