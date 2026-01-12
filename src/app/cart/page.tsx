'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const { items, updateQuantity, remove, total, clear } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ShoppingBag className="w-20 h-20 md:w-24 md:h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-text/70 mb-8 text-sm md:text-base">
            Add some products to get started!
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-black rounded-2xl font-medium hover:shadow-md transition-all"
          >
            Browse Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = total()
  const tax = subtotal * 0.08
  const totalAmount = subtotal + tax

  // Helper function to get proper label for variant type
  const getVariantLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'material': 'Material',
      'pattern': 'Pattern',
      'finish': 'Finish'
    }
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-6 md:py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Shopping Cart</h1>
          <button
            onClick={clear}
            className="text-xs md:text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex gap-3 md:gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80px, 96px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        {/* FIXED: Paint Customization Display (Color + Finish) */}
                        {item.paintCustomization && (
                          <div className="space-y-1 mb-2">
                            {/* Color */}
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: item.paintCustomization.color.hex }}
                              />
                              <span className="text-xs md:text-sm font-medium">
                                {item.paintCustomization.color.name}
                              </span>
                            </div>
                            {/* Finish - Only shown for paint */}
                            <div className="flex items-center gap-2 text-xs md:text-sm">
                              <span className="text-text/60">Finish:</span>
                              <span className="font-medium">
                                {item.paintCustomization.finish.name}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* FIXED: Generic Variant Display (Material/Pattern/Finish for non-paint) */}
                        {item.variant && !item.paintCustomization && (
                          <div className="flex items-center gap-2 mb-2 text-xs md:text-sm">
                            <span className="text-text/60 capitalize">
                              {getVariantLabel(item.variant.type)}:
                            </span>
                            <span className="font-medium truncate">
                              {item.variant.name}
                            </span>
                          </div>
                        )}

                        <p className="text-base md:text-lg font-bold text-brand">
                          ${item.price} <span className="text-xs md:text-sm text-text/60 font-normal">each</span>
                        </p>
                      </div>

                      {/* Mobile: Controls in row */}
                      <div className="flex items-center justify-between mt-3 md:hidden">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-base font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        <button
                          onClick={() => remove(item.cartItemId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Desktop: Controls on Right */}
                    <div className="hidden md:flex flex-col items-end gap-3 flex-shrink-0">
                      <button
                        onClick={() => remove(item.cartItemId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-lg font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24">
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Order Summary</h2>

              <div className="space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm md:text-base text-text/70">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base text-text/70">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base md:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center px-6 py-3 bg-brand text-black rounded-2xl font-medium shadow-sm hover:shadow-md transition-all mb-3 text-sm md:text-base"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/categories"
                className="w-full block text-center px-6 py-3 border-2 border-gray-200 rounded-2xl font-medium hover:border-brand transition-colors text-sm md:text-base"
              >
                Continue Shopping
              </Link>

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t space-y-2 md:space-y-3 text-xs md:text-sm text-text/70">
                <p className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  Free shipping on orders over $100
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  30-day money-back guarantee
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}