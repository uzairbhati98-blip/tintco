/**
 * Material variants for Wall Coverings
 */

import type { Variant } from '../types'

export const WALL_MATERIALS: Variant[] = [
  {
    id: 'oak',
    name: 'Oak Wood',
    value: 'oak',
    thumbnail: '#D4A574', // Light brown color representing oak
    description: 'Natural oak with visible grain',
    popular: true
  },
  {
    id: 'walnut',
    name: 'Walnut',
    value: 'walnut',
    thumbnail: '#5C4033', // Dark brown representing walnut
    description: 'Rich dark wood finish',
    popular: true
  },
  {
    id: 'maple',
    name: 'Maple Wood',
    value: 'maple',
    thumbnail: '#E8C5A5', // Light cream representing maple
    description: 'Light-colored, smooth grain',
    popular: false
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    value: 'bamboo',
    thumbnail: '#D2B48C', // Tan representing bamboo
    description: 'Sustainable bamboo panels',
    popular: true
  },
  {
    id: 'white-vinyl',
    name: 'White Vinyl',
    value: 'white-vinyl',
    thumbnail: '#FFFFFF',
    description: 'Clean modern white finish',
    popular: true
  },
  {
    id: 'gray-vinyl',
    name: 'Gray Vinyl',
    value: 'gray-vinyl',
    thumbnail: '#808080',
    description: 'Contemporary gray tone',
    popular: false
  },
  {
    id: 'black-vinyl',
    name: 'Black Vinyl',
    value: 'black-vinyl',
    thumbnail: '#1E1E1E',
    description: 'Bold black accent',
    popular: false
  },
  {
    id: 'rustic-wood',
    name: 'Rustic Wood',
    value: 'rustic-wood',
    thumbnail: '#8B4513', // Saddle brown
    description: 'Weathered, reclaimed look',
    popular: true
  }
]

export const ACOUSTIC_MATERIALS: Variant[] = [
  {
    id: 'charcoal-foam',
    name: 'Charcoal Foam',
    value: 'charcoal-foam',
    thumbnail: '#36454F',
    description: 'Sound-absorbing charcoal',
    popular: true
  },
  {
    id: 'white-foam',
    name: 'White Foam',
    value: 'white-foam',
    thumbnail: '#FFFFFF',
    description: 'Clean white acoustic',
    popular: true
  },
  {
    id: 'gray-foam',
    name: 'Gray Foam',
    value: 'gray-foam',
    thumbnail: '#A9A9A9',
    description: 'Neutral gray tone',
    popular: false
  },
  {
    id: 'beige-foam',
    name: 'Beige Foam',
    value: 'beige-foam',
    thumbnail: '#F5F5DC',
    description: 'Warm beige finish',
    popular: false
  }
]

export const WALLPAPER_PATTERNS: Variant[] = [
  {
    id: 'floral',
    name: 'Floral',
    value: 'floral',
    thumbnail: '#FFB6C1', // Light pink
    description: 'Classic floral design',
    popular: true
  },
  {
    id: 'geometric',
    name: 'Geometric',
    value: 'geometric',
    thumbnail: '#87CEEB', // Sky blue
    description: 'Modern geometric patterns',
    popular: true
  },
  {
    id: 'striped',
    name: 'Striped',
    value: 'striped',
    thumbnail: '#D3D3D3', // Light gray
    description: 'Vertical or horizontal stripes',
    popular: true
  },
  {
    id: 'textured',
    name: 'Textured',
    value: 'textured',
    thumbnail: '#F5F5DC', // Beige
    description: '3D textured surface',
    popular: false
  },
  {
    id: 'damask',
    name: 'Damask',
    value: 'damask',
    thumbnail: '#C9B8A3', // Greige
    description: 'Elegant damask pattern',
    popular: false
  }
]

/**
 * Get materials by product type
 */
export function getMaterialsByProduct(productSlug: string): Variant[] {
  if (productSlug.includes('wood')) {
    return WALL_MATERIALS
  }
  if (productSlug.includes('acoustic')) {
    return ACOUSTIC_MATERIALS
  }
  if (productSlug.includes('wallpaper')) {
    return WALLPAPER_PATTERNS
  }
  return WALL_MATERIALS // default
}

/**
 * Get popular materials
 */
export function getPopularMaterials(materials: Variant[]): Variant[] {
  return materials.filter(m => m.popular)
}