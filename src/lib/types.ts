export type Category = {
  id: string;
  slug: 'Wall-painting' | 'Wall-Coverings' | 'Flooring' | 'Tiles';
  name: string;
  description: string;
  heroImage: string;
}

export type Product = {
  id: string;
  slug: string;
  categorySlug: Category['slug'];
  name: string;
  description: string;
  images: string[];
  price: number;
  unit: 'sqft' | 'unit';
  attributes?: Record<string, string | number>;
  arMeasureEnabled: boolean;
  colorPickerEnabled?: boolean;
  colorVariants?: Record<string, string[]>;
  // NEW: Generic variant system
  variantType?: 'color' | 'material' | 'pattern' | 'finish';
  variants?: Record<string, string[]>; // key: variant id, value: image paths
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type ARMeasurement = {
  wallId?: string;
  widthM: number;
  heightM: number;
  areaSqM: number;
  count?: number;
  notes?: string;
}

export type QuoteRequest = {
  productId: string;
  productName: string;
  surfaceType: 'plaster' | 'drywall' | 'concrete' | 'wood';
  prepRequired: boolean;
  areaSqM: number;
  rooms?: number;
  measurements?: ARMeasurement[];
  customerEmail?: string;
}

// PAINT COLOR SYSTEM
export interface PaintColor {
  id: string;
  name: string;
  hex: string;
  category: 'neutral' | 'warm' | 'cool' | 'bold' | 'brand';
  popular?: boolean;
}

export interface SelectedColor {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
}

export type FinishType = 'gloss' | 'semi-gloss' | 'matte' | 'marble' | 'epoxy' | 'microcement'

export interface PaintFinish {
  id: FinishType
  name: string
  icon: string
  description: string
  popular?: boolean
}

export interface PaintCustomization {
  color: SelectedColor | null
  finish: FinishType | null
}

// NEW: GENERIC VARIANT SYSTEM
export type VariantType = 'color' | 'material' | 'pattern' | 'finish'

export interface Variant {
  id: string
  name: string
  value: string // For colors: hex code, for others: identifier
  thumbnail?: string // Optional preview image/color
  description?: string
  popular?: boolean
}

export interface SelectedVariant {
  id: string
  name: string
  value: string
}