'use client'

import { useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, ShoppingBag, ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import { getNextOrderNumber } from '@/lib/order-number-generator'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clear } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  // TASK 3: Removed state and zipCode for Kuwait-only checkout
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    visitDate: '',
    notes: ''
  })

  const subtotal = total()
  const tax = subtotal * 0.08
  const totalAmount = subtotal + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-text/70 mb-8">
            Add some products before checking out!
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-black rounded-2xl font-medium hover:shadow-md transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Generate sequential order number
      const orderId = getNextOrderNumber()
      
      // Create timestamp
      const now = new Date()
      const orderTimestamp = now.toISOString()

      // Prepare order data
      const orderData = {
        orderId,
        orderDate: orderTimestamp,
        customer: {
          ...formData,
          visitDate: formData.visitDate || null
        },
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variant: item.variant ? {
            type: item.variant.type,
            name: item.variant.name,
            value: item.variant.value
          } : null,
          paintCustomization: item.paintCustomization ? {
            color: {
              name: item.paintCustomization.color.name,
              hex: item.paintCustomization.color.hex
            },
            finish: {
              type: item.paintCustomization.finish.type,
              name: item.paintCustomization.finish.name
            }
          } : null,
          subtotal: item.price * item.quantity
        })),
        subtotal: subtotal,
        tax: tax,
        total: totalAmount,
        status: 'pending'
      }

      console.log('📦 Order Data Being Sent:', JSON.stringify(orderData, null, 2))

      // Send to API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      
      console.log('📥 API Response:', result)

      if (!response.ok) {
        console.error('❌ Checkout failed:', {
          status: response.status,
          result: result
        })
        
        throw new Error(
          result.message || 
          result.error || 
          `Checkout failed (${response.status})`
        )
      }

      // Success!
      clear()

      toast.success('Site visit scheduled successfully!', {
        description: `Order ID: ${orderId}`,
        duration: 5000
      })

      setTimeout(() => {
        router.push(`/order-success?orderId=${orderId}`)
      }, 500)

    } catch (error) {
      console.error('❌ Checkout error:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      toast.error('Failed to schedule site visit', {
        description: errorMessage,
        duration: 8000
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Get minimum date (today) in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-text/70 hover:text-brand mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Schedule Site Visit</h1>
          <p className="text-text/70 mt-2">
            Complete your details below to schedule your site visit
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6">Customer Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      placeholder="Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      placeholder="+965 1234 5678"
                    />
                  </div>
                </div>
              </div>

              {/* Site Visit Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6">Site Visit Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      placeholder="123 Main Street"
                    />
                  </div>

                  {/* TASK 3: Removed state and zipCode fields - Kuwait only */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      placeholder="Kuwait City"
                    />
                  </div>

                  {/* Preferred Visit Date */}
                  <div className="bg-brand/5 p-4 rounded-xl border-2 border-brand/20">
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand" />
                      Preferred Visit Date
                    </label>
                    <input
                      type="date"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleChange}
                      min={today}
                      className="w-full px-4 py-3 rounded-xl border-2 border-brand/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 bg-white text-lg font-medium"
                    />
                    <p className="text-xs text-text/60 mt-2">
                      💡 Select your preferred date - We'll contact you to confirm availability
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      placeholder="Any special requirements or preferences..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Visit Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        {item.paintCustomization && (
                          <p className="text-xs text-text/60">
                            {item.paintCustomization.color.name}, {item.paintCustomization.finish.name}
                          </p>
                        )}
                        {item.variant && (
                          <p className="text-xs text-text/60">{item.variant.name}</p>
                        )}
                        <p className="text-sm text-text/70">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-6 border-t">
                  <div className="flex justify-between text-text/70">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text/70">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-brand">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 px-6 py-3 bg-brand text-black rounded-2xl font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Schedule Site Visit'
                  )}
                </button>

                <p className="text-xs text-center text-text/60 mt-4">
                  🔒 Our team will contact you to confirm the visit timing
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}