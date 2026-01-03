'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';

export function ARMeasureButton({ product, onUseMeasurement }: { product: Product; onUseMeasurement?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMeasure = async () => {
    try {
      setLoading(true);

      // ✅ Placeholder: launch AR measurement flow here
      // In the future this might use WebXR, model-viewer, or an AR SDK
      console.log('Starting AR measurement for:', product.name);

      // Simulate an async AR measurement
      await new Promise((res) => setTimeout(res, 2000));

      // Example: send measurement data to your backend or Zustand store
      // e.g., useQuote.getState().setMeasurement(product.id, area);

      console.log('Measurement complete!');
      // If a parent passed an onUseMeasurement callback, call it (e.g., to navigate)
      if (onUseMeasurement) {
        try { onUseMeasurement() } catch (_) { /* ignore */ }
      } else {
        router.push('/quote');
      }
    } catch (err) {
      console.error('AR measurement failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMeasure}
      disabled={loading}
      className="px-6 py-3 rounded-2xl border border-brand text-brand font-medium hover:bg-brand bg-[#FFCA2C] hover:bg-[#e6b622] transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
    >
      {loading ? 'Measuring...' : 'Measure'}
    </Button>
  );
}
