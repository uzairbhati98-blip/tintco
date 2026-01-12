'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Calendar, Mail, ArrowRight, Phone } from 'lucide-react'
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
            Site Visit Scheduled!
          </h1>

          <p className="text-lg text-text/70 mb-8">
            Thank you for scheduling with Tintco. Our team will contact you shortly to confirm your visit timing.
          </p>

          {orderId && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <p className="text-sm text-text/60 mb-2">Site Visit Reference</p>
              <p className="text-3xl font-bold text-brand mb-4">{orderId}</p>
              <p className="text-sm text-text/60">
                Please keep this reference number for your records
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Mail className="w-12 h-12 text-brand mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Confirmation Email</h3>
              <p className="text-sm text-text/70">
                A confirmation email with all details has been sent to your email address.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Calendar className="w-12 h-12 text-brand mx-auto mb-4" />
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <p className="text-sm text-text/70">
                Our team will reach out within 24 hours to schedule your site visit at a convenient time.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Need to Make Changes?</h3>
                <p className="text-sm text-blue-800 mb-3">
                  If you need to reschedule or have questions about your site visit, please contact our team:
                </p>
                <p className="text-sm font-medium text-blue-900">
                  📞 Phone: [Your Phone Number]<br />
                  📧 Email: support@tintco.com
                </p>
                {orderId && (
                  <p className="text-xs text-blue-700 mt-3">
                    Please reference order: <span className="font-semibold">{orderId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-black rounded-2xl font-medium hover:shadow-md transition-all"
            >
              Browse More Services
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div>
              <Link
                href="/contact"
                className="text-text/70 hover:text-brand transition-colors text-sm"
              >
                Have questions? Contact our support team
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <h3 className="font-semibold mb-4">What to Expect During Your Site Visit</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-text/70">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-2xl mb-2 block">📏</span>
                <p className="font-medium text-text mb-1">Measurements</p>
                <p>Precise measurements of your project area</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-2xl mb-2 block">💬</span>
                <p className="font-medium text-text mb-1">Consultation</p>
                <p>Discussion of your preferences and requirements</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-2xl mb-2 block">📋</span>
                <p className="font-medium text-text mb-1">Quote</p>
                <p>Detailed quote based on your specific needs</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}