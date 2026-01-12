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
  variantType?: 'color' | 'material' | 'pattern' | 'finish';
  variants?: Record<string, string[]>;
}

// UPDATED: CartItem now includes variant information
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  // NEW: Variant tracking
  variant?: {
    type: 'color' | 'material' | 'pattern' | 'finish';
    name: string;
    value: string; // e.g., "#FFFFFF" or "oak" or "marble-white"
  };
  // NEW: Unique key for cart item (productId + variant)
  cartItemId: string;
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

// GENERIC VARIANT SYSTEM
export type VariantType = 'color' | 'material' | 'pattern' | 'finish'

export interface Variant {
  id: string
  name: string
  value: string
  thumbnail?: string
  description?: string
  popular?: boolean
}

export interface SelectedVariant {
  id: string
  name: string
  value: string
}

// CHECKOUT & ORDER TYPES
export interface CheckoutFormData {
  // Customer Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Optional
  notes?: string;
}

export interface OrderData {
  orderId: string;
  orderDate: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}