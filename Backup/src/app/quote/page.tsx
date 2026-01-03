'use client';
import { useEffect } from 'react';
import { useQuote } from '@/lib/store/quote';
import { QuoteForm } from '@/components/quote-form';

export default function QuotePage() {
  const q = useQuote((s) => s.current);
  useEffect(() => {
    // Prefetch or analytics if needed
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Get a Quick Quote</h1>
      <QuoteForm />
      {!q && (
        <p className="text-sm text-black/60 mt-4">
          Tip: Start from a product to prefill pricing and units.
        </p>
      )}
    </div>
  );
}
