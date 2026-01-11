'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductGalleryProps {
  images: string[]
  name: string
  product?: Product
  selectedKey?: string | null  // Can be color hex OR variant value
}

export function ProductGallery({ images, name, product, selectedKey }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Get images based on selected key (works for both colorVariants and variants)
  const displayImages = (() => {
    if (!selectedKey || !product) {
      return images
    }

    // Try colorVariants first (for paint products)
    if (product.colorVariants && product.colorVariants[selectedKey]) {
      const variantImages = product.colorVariants[selectedKey]
      if (variantImages && variantImages.length > 0) {
        return variantImages
      }
    }

    // Try generic variants (for other products)
    if (product.variants && product.variants[selectedKey]) {
      const variantImages = product.variants[selectedKey]
      if (variantImages && variantImages.length > 0) {
        return variantImages
      }
    }

    return images
  })()

  // Reset to first image when selection changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [selectedKey])

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setIsZoomed(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [displayImages.length])

  return (
    <>
      <div>
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedKey}-${selectedIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={displayImages[selectedIndex]}
                alt={`${name} - View ${selectedIndex + 1}`}
                fill
                className="object-cover cursor-zoom-in"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onClick={() => setIsZoomed(true)}
              />
            </motion.div>
          </AnimatePresence>

          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-5 h-5" />
          </div>

          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
              {selectedIndex + 1} / {displayImages.length}
            </div>
          )}

          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`transition-all ${
                    i === selectedIndex
                      ? 'w-8 h-2 bg-brand rounded-full'
                      : 'w-2 h-2 bg-white/70 hover:bg-white rounded-full'
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {displayImages.map((img, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIndex(i)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  i === selectedIndex
                    ? 'border-brand shadow-md ring-2 ring-brand/20'
                    : 'border-gray-200 hover:border-brand/50'
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
                {i === selectedIndex && (
                  <div className="absolute inset-0 bg-brand/20" />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[selectedIndex]}
                alt={`${name} - Zoomed view`}
                fill
                className="object-contain"
                sizes="100vw"
              />

              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Close zoom"
              >
                ✕
              </button>

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePrevious()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNext()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}