"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuote } from "@/lib/store/quote"
import type { Product } from "@/lib/types"
import { ARMeasureModal } from "@/components/ar-measure-modal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Props = {
  product: Product
}

export function ARMeasureButton({ product }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ingestARMeasurement = useQuote((s) => s.ingestARMeasurement)
  const setFromProduct = useQuote((s) => s.setFromProduct)
  const router = useRouter()

  const handleSuccess = (data: { areaSqM: number; dimensions: string; roomType: string }) => {
    // Set the product in the quote store
    setFromProduct(product)
    
    // Ingest the AR measurement
    ingestARMeasurement({
      widthM: parseFloat(data.dimensions.split('×')[0]), // Extract width from "4m × 3m"
      heightM: parseFloat(data.dimensions.split('×')[1]), // Extract height
      areaSqM: data.areaSqM,
      count: 1,
      notes: `AR measurement - ${data.roomType.replace('_', ' ')}`
    })
    
    // Show success toast
    toast.success("AR measurement captured", {
      description: `${data.areaSqM} m² measured successfully`
    })
    
    // Close modal
    setIsModalOpen(false)
    
    // Redirect to quote page
    router.push("/quote")
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setIsModalOpen(true)}
        className="inline-flex rounded-2xl border-2 border-text/20 hover:border-brand px-8 py-3.5 font-semibold transition-all duration-300 hover:bg-brand/5 hover:-translate-y-0.5 active:scale-95"
      >
        Measure with AR
      </motion.button>

      <ARMeasureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        productName={product.name}
      />
    </>
  )
}