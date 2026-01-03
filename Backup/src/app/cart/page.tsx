'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store/cart'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, remove, setQty, clear, count } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal - discount + shipping + tax

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1)
      toast.success('Promo code applied! 10% discount')
    } else if (promoCode.toUpperCase() === 'FIRST20') {
      setDiscount(subtotal * 0.2)
      toast.success('Promo code applied! 20% discount')
    } else {
      toast.error('Invalid promo code')
    }
  }

  const handleCheckout = () => {
    toast.success('Redirecting to checkout...')
    // In real app, redirect to checkout
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-text/60 mb-8">
            Looks like you haven't added any items to your cart yet. 
            Start shopping to build your dream space!
          </p>
          <Link 
            href="/categories"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-black font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-text/60">
            {count} {count === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Free Shipping Banner */}
            {subtotal < 100 && (
              <div className="bg-brand/10 border-2 border-brand/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-brand" />
                  <p className="text-sm">
                    Add <span className="font-semibold">${(100 - subtotal).toFixed(2)}</span> more 
                    for free shipping!
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image || 'https://via.placeholder.com/150'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-text/60">Premium Quality</p>
                          </div>
                          <button
                            onClick={() => {
                              remove(item.productId)
                              toast.success('Item removed from cart')
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setQty(item.productId, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-brand flex items-center justify-center transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => setQty(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-brand flex items-center justify-center transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-xl font-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-text/60">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Clear Cart Button */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clear()
                  toast.success('Cart cleared')
                }
              }}
              className="mt-6 text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-brand hover:bg-brand/90 text-black font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-text/50 mt-1">
                  Try: SAVE10 or FIRST20
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-brand hover:bg-brand/90 text-black font-semibold py-4 rounded-2xl transition-all hover:shadow-xl mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link 
                href="/categories"
                className="block text-center text-sm text-brand font-medium hover:underline mb-6"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Fast Delivery (2-3 days)</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-text/60 mb-2">Accepted Payment Methods</p>
                <div className="flex gap-2">
                  {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
                    <div key={method} className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-[8px] font-bold text-gray-500">
                        {method.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed (Optional) */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link 
                key={i}
                href="#"
                className="group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand/10" />
                </div>
                <h3 className="font-medium group-hover:text-brand transition-colors">
                  Suggested Product {i}
                </h3>
                <p className="text-sm text-text/60">$XX.XX</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}