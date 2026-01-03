import { notFound } from 'next/navigation';
import products from '@/data/products.json';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { ProductGallery } from '@/components/product-gallery';
import { ClientProductActions } from './client-product-actions';
import { ARMeasureButton } from '@/components/ar-measure-button';
import { Star, Check, Truck, Shield, Palette } from 'lucide-react';
import { ProductGalleryComponent } from './product-gallery-component';


export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (products as any[]).find(
    (p) => p.slug === slug
  ) as Product | undefined;

  if (!product) return notFound();

  // Mock reviews data
  const reviews = {
    average: 4.8,
    count: 127,
    distribution: [2, 3, 8, 24, 90],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div>
          <ProductGallery
            images={product.images || [product.images[0]]}
            name={product.name}
          />

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-text/70">
              <Truck className="w-4 h-4 text-brand" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text/70">
              <Shield className="w-4 h-4 text-brand" />
              <span>2 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text/70">
              <Palette className="w-4 h-4 text-brand" />
              <span>Color Match</span>
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          <div className="flex items-center gap-2 text-sm text-text/60 mb-4">
            <a href="/categories" className="hover:text-brand transition-colors">
              Categories
            </a>
            <span>/</span>
            <a
              href={`/categories/${product.categorySlug}`}
              className="hover:text-brand transition-colors"
            >
              {product.categorySlug}
            </a>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(reviews.average)
                      ? 'text-brand fill-brand'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{reviews.average}</span>
            <a
              href="#reviews"
              className="text-sm text-text/60 hover:text-brand transition-colors"
            >
              ({reviews.count} reviews)
            </a>
          </div>

          <p className="text-text/70 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${product.price}</span>
              <span className="text-lg text-text/60">/ {product.unit}</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <ClientProductActions product={JSON.parse(JSON.stringify(product))} />
            {product.arMeasureEnabled && <ARMeasureButton product={product} />}
          </div>

          <div className="border-t pt-6 mb-6">
            <h3 className="font-semibold mb-4">Key Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-brand mt-0.5" />
                <span className="text-sm text-text/70">
                  Professional-grade quality for lasting results
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-brand mt-0.5" />
                <span className="text-sm text-text/70">
                  Low VOC formula - safe for indoor use
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-brand mt-0.5" />
                <span className="text-sm text-text/70">
                  Coverage: 350-400 sq ft per gallon
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-brand mt-0.5" />
                <span className="text-sm text-text/70">
                  Dries to touch in 2 hours, recoat in 4 hours
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
