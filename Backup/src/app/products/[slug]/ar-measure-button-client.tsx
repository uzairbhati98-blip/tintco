'use client';

import { ARMeasureButton } from '@/components/ar-measure-button';
import type { Product } from '@/lib/types';

export function ARMeasureButtonClient({ product }: { product: Product }) {
  const handleMeasurement = () => {
    location.href = '/quote';
  };

  return (
    <div className="mt-6">
      <ARMeasureButton
        product={product}
        onUseMeasurement={handleMeasurement}
      />
    </div>
  );
}
