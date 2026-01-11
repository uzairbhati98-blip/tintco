/**
 * Finish variants for Flooring products
 */

import type { Variant } from '../types'

export const EPOXY_FINISHES: Variant[] = [
  {
    id: 'glossy-clear',
    name: 'Glossy Clear',
    value: 'glossy-clear',
    thumbnail: '#F0F0F0',
    description: 'High-gloss transparent finish',
    popular: true
  },
  {
    id: 'matte-gray',
    name: 'Matte Gray',
    value: 'matte-gray',
    thumbnail: '#808080',
    description: 'Non-reflective gray',
    popular: true
  },
  {
    id: 'metallic-silver',
    name: 'Metallic Silver',
    value: 'metallic-silver',
    thumbnail: '#C0C0C0',
    description: 'Shimmering metallic finish',
    popular: true
  },
  {
    id: 'glossy-white',
    name: 'Glossy White',
    value: 'glossy-white',
    thumbnail: '#FFFFFF',
    description: 'Bright white high-gloss',
    popular: true
  },
  {
    id: 'charcoal-matte',
    name: 'Charcoal Matte',
    value: 'charcoal-matte',
    thumbnail: '#36454F',
    description: 'Deep charcoal matte',
    popular: false
  },
  {
    id: 'metallic-copper',
    name: 'Metallic Copper',
    value: 'metallic-copper',
    thumbnail: '#B87333',
    description: 'Warm copper metallic',
    popular: false
  },
  {
    id: 'semi-gloss-beige',
    name: 'Semi-Gloss Beige',
    value: 'semi-gloss-beige',
    thumbnail: '#F5F5DC',
    description: 'Subtle beige semi-gloss',
    popular: false
  }
]

export const MICROCEMENT_FINISHES: Variant[] = [
  {
    id: 'smooth-gray',
    name: 'Smooth Gray',
    value: 'smooth-gray',
    thumbnail: '#A9A9A9',
    description: 'Polished gray finish',
    popular: true
  },
  {
    id: 'textured-white',
    name: 'Textured White',
    value: 'textured-white',
    thumbnail: '#F8F8F8',
    description: 'Subtle textured white',
    popular: true
  },
  {
    id: 'smooth-beige',
    name: 'Smooth Beige',
    value: 'smooth-beige',
    thumbnail: '#E8DCC4',
    description: 'Warm beige smooth',
    popular: true
  },
  {
    id: 'textured-charcoal',
    name: 'Textured Charcoal',
    value: 'textured-charcoal',
    thumbnail: '#36454F',
    description: 'Dark textured finish',
    popular: false
  },
  {
    id: 'smooth-cream',
    name: 'Smooth Cream',
    value: 'smooth-cream',
    thumbnail: '#F5F5DC',
    description: 'Light cream polish',
    popular: false
  },
  {
    id: 'industrial-gray',
    name: 'Industrial Gray',
    value: 'industrial-gray',
    thumbnail: '#6B6B6B',
    description: 'Raw industrial look',
    popular: true
  }
]

/**
 * Get finishes by product type
 */
export function getFinishesByProduct(productSlug: string): Variant[] {
  if (productSlug.includes('epoxy')) {
    return EPOXY_FINISHES
  }
  if (productSlug.includes('micro-cement') || productSlug.includes('microcement')) {
    return MICROCEMENT_FINISHES
  }
  return EPOXY_FINISHES // default
}

/**
 * Get popular finishes
 */
export function getPopularFinishes(finishes: Variant[]): Variant[] {
  return finishes.filter(f => f.popular)
}