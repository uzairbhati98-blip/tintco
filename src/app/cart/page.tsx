'use client'

import { useCart } from '@/lib/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CartPage() {
  const { items, updateQuantity, remove, total, clear } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-text/70 mb-8">
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
  const tax = subtotal * 0.08 // 8% tax
  const totalAmount = subtotal + tax

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <button
            onClick={clear}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.cartItemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    
                    {/* Variant Display */}
                    {item.variant && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-text/60 capitalize">
                          {item.variant.type}:
                        </span>
                        <div className="flex items-center gap-2">
                          {item.variant.type === 'color' && (
                            <div
                              className="w-5 h-5 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: item.variant.value }}
                            />
                          )}
                          <span className="text-sm font-medium">
                            {item.variant.name}
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-lg font-bold text-brand">
                      ${item.price} <span className="text-sm text-text/60">each</span>
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-3">
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
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-text/70">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text/70">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center px-6 py-3 bg-brand text-black rounded-2xl font-medium shadow-sm hover:shadow-md transition-all mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/categories"
                className="w-full block text-center px-6 py-3 border-2 border-gray-200 rounded-2xl font-medium hover:border-brand transition-colors"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-text/70">
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