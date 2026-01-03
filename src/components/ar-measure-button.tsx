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
  // deterministic mock for dev
  return new Promise((res) =>
    setTimeout(
      () => res({ widthM: 4, heightM: 2.8, areaSqM: 11.2, count: 2, notes: "Mock AR" }),
      1000
    )
  )
}

export function ARMeasureButton({ product }: Props) {
  const [loading, setLoading] = useState(false)
  const ingest = useQuote((s) => s.ingestARMeasurement)

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true)
          const m = await simulateAR()
          ingest(m)
          toast.success("AR measurement captured", {
            description: `~${m.areaSqM.toFixed(2)} m² added to quote`,
          })
          location.href = "/quote"
        } catch (e) {
          toast.error("AR failed", { description: "Please try again." })
        } finally {
          setLoading(false)
        }
      }}
      className="px-6 py-3 rounded-2xl bg-brand/90 hover:bg-brand text-black font-medium shadow-sm focus:ring-2 focus:ring-brand focus:ring-offset-2"
    >
      {loading ? "Measuring..." : "Measure with AR"}
    </motion.button>
  )
}
