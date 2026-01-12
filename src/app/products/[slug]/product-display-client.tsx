'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ProductGallery } from '@/components/product-gallery'
import { ProductCustomizer } from '@/components/product-customizer'
import { ARMeasureButton } from '@/components/ar-measure-button'
import { Star, Check, Truck, Shield, Palette } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useQuote } from '@/lib/store/quote'
import type { Product, SelectedColor, SelectedVariant } from '@/lib/types'

interface ProductDisplayClientProps {
  product: Product
  isPaintProduct: boolean
  reviews?: { average: number; count: number }
}

export function ProductDisplayClient({ 
  product, 
  isPaintProduct, 
  reviews = { average: 4.8, count: 127 } 
}: ProductDisplayClientProps) {
  const [selectedColor, setSelectedColor] = useState<SelectedColor | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(null)
  
  const add = useCart((s) => s.add)
  const setFromProduct = useQuote((s) => s.setFromProduct)
  
  // Get the key for image switching (either color hex or variant value)
  const imageKey = selectedColor?.hex || selectedVariant?.value || null

  const handleAddToCart = () => {
    // Pass variant information to cart
    add(product, 1, {
      color: selectedColor || undefined,
      variant: selectedVariant || undefined
    })

    // Create descriptive toast message
    let message = `${product.name}`
    if (selectedColor) {
      message += ` (${selectedColor.name})`
    } else if (selectedVariant) {
      message += ` (${selectedVariant.name})`
    }
    message += ' added to cart!'

    toast.success(message, {
      description: 'You can view it in your cart anytime.',
      duration: 2500
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* LEFT COLUMN */}
      <div>
        <ProductGallery
          images={product.images}
          name={product.name}
          product={product}
          selectedKey={imageKey}
        />

        <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-text/70">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand" />
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand" />
            <span>2 Year Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand" />
            <span>Color Match</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div>
        <div className="flex items-center gap-2 text-sm text-text/60 mb-4">
          <a href="/categories" className="hover:text-brand">
            Categories
          </a>
          <span>/</span>
          <a href={`/categories/${product.categorySlug}`} className="hover:text-brand">
            {product.categorySlug}
          </a>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(reviews.average)
                    ? 'text-brand fill-brand'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{reviews.average}</span>
          <a
            href="#reviews"
            className="text-sm text-text/60 hover:text-brand transition-colors"
          >
            {reviews.count} reviews
          </a>
        </div>

        <p className="text-text/70 mb-6 leading-relaxed">
          {product.description}
        </p>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${product.price}</span>
            <span className="text-lg text-text/60">/ {product.unit}</span>
          </div>
        </div>

        {/* Smart Product Customizer - shows color picker OR variant selector OR nothing */}
        <div className="mb-8">
          <ProductCustomizer 
            product={product}
            onColorChange={setSelectedColor}
            onVariantChange={setSelectedVariant}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-2xl bg-brand text-black font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-all"
            >
              Add to Cart
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => {
                setFromProduct(product)
                location.href = '/quote'
              }}
              className="px-6 py-3 rounded-2xl border border-brand text-brand font-medium hover:bg-brand hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Get Quick Quote
            </motion.button>
          </div>

          {product.arMeasureEnabled && <ARMeasureButton product={product} />}
        </div>

        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold mb-4">Key Features</h3>
          <ul className="space-y-2 text-sm text-text/70">
            {[
              'Professional-grade quality for lasting results',
              'Low VOC formula - safe for indoor use',
              'Coverage: 350-400 sq ft per gallon',
              'Dries to touch in 2 hours, recoat in 4 hours',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-brand mt-0.5" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}