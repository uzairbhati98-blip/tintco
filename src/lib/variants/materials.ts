/**
 * Material variants for Wall Coverings
 * 
 * THUMBNAIL OPTIONS:
 * 1. Image path: '/images/thumbnails/oak-thumb.jpg' - Shows actual product photo
 * 2. Color hex: '#D4A574' - Shows solid color (fallback)
 */

import type { Variant } from '../types'

export const WALL_MATERIALS: Variant[] = [
  {
    id: 'oak',
    name: 'Oak Wood',
    value: 'oak',
    thumbnail: '/images/thumbnails/materials/oak.jpg', // ← Use real wood grain photo!
    description: 'Natural oak with visible grain',
    popular: true
  },
  {
    id: 'walnut',
    name: 'Walnut',
    value: 'walnut',
    thumbnail: '/images/thumbnails/materials/walnut.jpg', // ← Use real walnut photo!
    description: 'Rich dark wood finish',
    popular: true
  },
  {
    id: 'maple',
    name: 'Maple Wood',
    value: 'maple',
    thumbnail: '/images/thumbnails/materials/maple.jpg',
    description: 'Light-colored, smooth grain',
    popular: false
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    value: 'bamboo',
    thumbnail: '/images/thumbnails/materials/bamboo.jpg',
    description: 'Sustainable bamboo panels',
    popular: true
  },
  {
    id: 'white-vinyl',
    name: 'White Vinyl',
    value: 'white-vinyl',
    thumbnail: '/images/thumbnails/materials/white-vinyl.jpg',
    description: 'Clean modern white finish',
    popular: true
  },
  {
    id: 'gray-vinyl',
    name: 'Gray Vinyl',
    value: 'gray-vinyl',
    thumbnail: '/images/thumbnails/materials/gray-vinyl.jpg',
    description: 'Contemporary gray tone',
    popular: false
  },
  {
    id: 'black-vinyl',
    name: 'Black Vinyl',
    value: 'black-vinyl',
    thumbnail: '/images/thumbnails/materials/black-vinyl.jpg',
    description: 'Bold black accent',
    popular: false
  },
  {
    id: 'rustic-wood',
    name: 'Rustic Wood',
    value: 'rustic-wood',
    thumbnail: '/images/thumbnails/materials/rustic.jpg',
    description: 'Weathered, reclaimed look',
    popular: true
  }
]

export const ACOUSTIC_MATERIALS: Variant[] = [
  {
    id: 'charcoal-foam',
    name: 'Charcoal Foam',
    value: 'charcoal-foam',
    thumbnail: '/images/thumbnails/materials/charcoal-foam.jpg', // ← Foam texture photo
    description: 'Sound-absorbing charcoal',
    popular: true
  },
  {
    id: 'white-foam',
    name: 'White Foam',
    value: 'white-foam',
    thumbnail: '/images/thumbnails/materials/white-foam.jpg',
    description: 'Clean white acoustic',
    popular: true
  },
  {
    id: 'gray-foam',
    name: 'Gray Foam',
    value: 'gray-foam',
    thumbnail: '/images/thumbnails/materials/gray-foam.jpg',
    description: 'Neutral gray tone',
    popular: false
  },
  {
    id: 'beige-foam',
    name: 'Beige Foam',
    value: 'beige-foam',
    thumbnail: '/images/thumbnails/materials/beige-foam.jpg',
    description: 'Warm beige finish',
    popular: false
  }
]

export const WALLPAPER_PATTERNS: Variant[] = [
  {
    id: 'floral',
    name: 'Floral',
    value: 'floral',
    thumbnail: '/images/thumbnails/wallpaper/floral.jpg', // ← Wallpaper pattern photo
    description: 'Classic floral design',
    popular: true
  },
  {
    id: 'geometric',
    name: 'Geometric',
    value: 'geometric',
    thumbnail: '/images/thumbnails/wallpaper/geometric.jpg',
    description: 'Modern geometric patterns',
    popular: true
  },
  {
    id: 'striped',
    name: 'Striped',
    value: 'striped',
    thumbnail: '/images/thumbnails/wallpaper/striped.jpg',
    description: 'Vertical or horizontal stripes',
    popular: true
  },
  {
    id: 'textured',
    name: 'Textured',
    value: 'textured',
    thumbnail: '/images/thumbnails/wallpaper/textured.jpg',
    description: '3D textured surface',
    popular: false
  },
  {
    id: 'damask',
    name: 'Damask',
    value: 'damask',
    thumbnail: '/images/thumbnails/wallpaper/damask.jpg',
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