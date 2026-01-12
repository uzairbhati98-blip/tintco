'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="mx-auto max-w-2xl px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-lg text-text/70 mb-8">
            Thank you for your purchase. We've received your order and will process it shortly.
          </p>

          {orderId && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <p className="text-sm text-text/60 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-brand">{orderId}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Mail className="w-12 h-12 text-brand mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Confirmation Email</h3>
              <p className="text-sm text-text/70">
                A confirmation email has been sent to your email address with order details.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Package className="w-12 h-12 text-brand mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Order Processing</h3>
              <p className="text-sm text-text/70">
                Your order is being processed and will be shipped within 2-3 business days.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-black rounded-2xl font-medium hover:shadow-md transition-all"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div>
              <Link
                href="/contact"
                className="text-text/70 hover:text-brand transition-colors text-sm"
              >
                Need help? Contact our support team
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}