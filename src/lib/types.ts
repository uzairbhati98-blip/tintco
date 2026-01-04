export type Category = {
  id: string;
  slug: 'Wall-painting' | 'Wall-panels' | 'Flooring';
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

// NEW: Finish types
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