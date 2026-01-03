'use client'

import { useEffect } from 'react'
import { useQuote } from '@/lib/store/quote'
import { QuoteForm } from '@/components/quote-form'

export default function QuotePage() {
  const req = useQuote((s) => s.request)



  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Get a Quick Quote</h1>
      <QuoteForm />
      {!req && (
        <p className="text-sm text-text/60 mt-4">
          Tip: start from a product or AR measurement to prefill your area and pricing automatically.
        </p>
      )}
    </div>
  )
}
