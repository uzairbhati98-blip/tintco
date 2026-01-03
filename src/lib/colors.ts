/**
 * Predefined Tintco color palette
 */

import type { PaintColor } from './types'

export const TINTCO_COLORS: PaintColor[] = [
  // Brand Color
  {
    id: 'mustard-gold',
    name: 'Mustard Gold',
    hex: '#FFCA2C',
    category: 'brand',
    popular: true
  },

  // Neutrals
  {
    id: 'pure-white',
    name: 'Pure White',
    hex: '#FFFFFF',
    category: 'neutral',
    popular: true
  },
  {
    id: 'cloud-white',
    name: 'Cloud White',
    hex: '#F8F8F8',
    category: 'neutral',
    popular: true
  },
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    hex: '#F5F5DC',
    category: 'neutral',
    popular: true
  },
  {
    id: 'soft-beige',
    name: 'Soft Beige',
    hex: '#E8DCC4',
    category: 'neutral',
    popular: true
  },
  {
    id: 'greige',
    name: 'Greige',
    hex: '#C9B8A3',
    category: 'neutral',
    popular: true
  },
  {
    id: 'warm-gray',
    name: 'Warm Gray',
    hex: '#D3D3D3',
    category: 'neutral',
    popular: false
  },
  {
    id: 'cool-gray',
    name: 'Cool Gray',
    hex: '#B0B0B0',
    category: 'neutral',
    popular: false
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    hex: '#36454F',
    category: 'neutral',
    popular: true
  },

  // Warm Colors
  {
    id: 'terracotta',
    name: 'Terracotta',
    hex: '#E07A5F',
    category: 'warm',
    popular: true
  },
  {
    id: 'coral-blush',
    name: 'Coral Blush',
    hex: '#F4A6A3',
    category: 'warm',
    popular: false
  },
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    hex: '#D9B99B',
    category: 'warm',
    popular: false
  },
  {
    id: 'burnt-orange',
    name: 'Burnt Orange',
    hex: '#CC5500',
    category: 'warm',
    popular: false
  },

  // Cool Colors
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    hex: '#87CEEB',
    category: 'cool',
    popular: true
  },
  {
    id: 'sage-green',
    name: 'Sage Green',
    hex: '#9DC183',
    category: 'cool',
    popular: true
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    hex: '#98D8C8',
    category: 'cool',
    popular: false
  },
  {
    id: 'ocean-teal',
    name: 'Ocean Teal',
    hex: '#4DB8A8',
    category: 'cool',
    popular: false
  },
  {
    id: 'navy-blue',
    name: 'Navy Blue',
    hex: '#1B365D',
    category: 'cool',
    popular: true
  },

  // Bold Colors
  {
    id: 'lavender',
    name: 'Lavender',
    hex: '#B19CD9',
    category: 'bold',
    popular: true
  },
  {
    id: 'blush-pink',
    name: 'Blush Pink',
    hex: '#FFB6C1',
    category: 'bold',
    popular: false
  },
  {
    id: 'deep-plum',
    name: 'Deep Plum',
    hex: '#8B4789',
    category: 'bold',
    popular: false
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    hex: '#2D5016',
    category: 'bold',
    popular: false
  }
]

/**
 * Get popular colors for quick selection
 */
export function getPopularColors(): PaintColor[] {
  return TINTCO_COLORS.filter(color => color.popular)
}

/**
 * Get colors by category
 */
export function getColorsByCategory(category: PaintColor['category']): PaintColor[] {
  return TINTCO_COLORS.filter(color => color.category === category)
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
}

/**
 * Get color name from hex (find closest match)
 */
export function getColorName(hex: string): string {
  const color = TINTCO_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase())
  return color?.name || 'Custom Color'
}