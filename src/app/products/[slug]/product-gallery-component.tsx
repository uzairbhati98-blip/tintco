"use client";
import { useState } from 'react';
import Image from 'next/image';

export function ProductGalleryComponent({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <Image
          src={images[selectedIndex]}
          alt={`${name} - View ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button" // ✅ fix
                onClick={() => setSelectedIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === selectedIndex ? 'bg-brand w-8' : 'bg-white/70 hover:bg-white'
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button" // ✅ fix
              onClick={() => setSelectedIndex(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                i === selectedIndex
                  ? 'border-brand shadow-md'
                  : 'border-transparent hover:border-brand/50'
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
