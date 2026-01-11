/**
 * Pattern variants for Tiles
 */

import type { Variant } from '../types'

export const FLOOR_TILE_PATTERNS: Variant[] = [
  {
    id: 'marble-white',
    name: 'White Marble',
    value: 'marble-white',
    thumbnail: '#F8F8F8',
    description: 'Classic white marble veining',
    popular: true
  },
  {
    id: 'marble-black',
    name: 'Black Marble',
    value: 'marble-black',
    thumbnail: '#1E1E1E',
    description: 'Dramatic black marble',
    popular: true
  },
  {
    id: 'wood-look',
    name: 'Wood Look',
    value: 'wood-look',
    thumbnail: '#8B4513',
    description: 'Natural wood-grain tiles',
    popular: true
  },
  {
    id: 'concrete-gray',
    name: 'Concrete Gray',
    value: 'concrete-gray',
    thumbnail: '#808080',
    description: 'Modern concrete finish',
    popular: true
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    value: 'terracotta',
    thumbnail: '#E07A5F',
    description: 'Warm terracotta clay',
    popular: false
  },
  {
    id: 'slate-dark',
    name: 'Dark Slate',
    value: 'slate-dark',
    thumbnail: '#36454F',
    description: 'Natural slate texture',
    popular: false
  },
  {
    id: 'hexagon-white',
    name: 'White Hexagon',
    value: 'hexagon-white',
    thumbnail: '#FFFFFF',
    description: 'Geometric hexagon tiles',
    popular: true
  },
  {
    id: 'mosaic-blue',
    name: 'Blue Mosaic',
    value: 'mosaic-blue',
    thumbnail: '#87CEEB',
    description: 'Decorative mosaic pattern',
    popular: false
  }
]

export const WALL_TILE_PATTERNS: Variant[] = [
  {
    id: 'subway-white',
    name: 'White Subway',
    value: 'subway-white',
    thumbnail: '#FFFFFF',
    description: 'Classic subway tile',
    popular: true
  },
  {
    id: 'subway-black',
    name: 'Black Subway',
    value: 'subway-black',
    thumbnail: '#1E1E1E',
    description: 'Bold black subway',
    popular: true
  },
  {
    id: 'moroccan',
    name: 'Moroccan',
    value: 'moroccan',
    thumbnail: '#4DB8A8',
    description: 'Intricate Moroccan design',
    popular: true
  },
  {
    id: 'geometric-gray',
    name: 'Gray Geometric',
    value: 'geometric-gray',
    thumbnail: '#A9A9A9',
    description: 'Modern geometric pattern',
    popular: true
  },
  {
    id: 'herringbone',
    name: 'Herringbone',
    value: 'herringbone',
    thumbnail: '#D9B99B',
    description: 'Elegant herringbone layout',
    popular: false
  },
  {
    id: 'penny-round',
    name: 'Penny Round',
    value: 'penny-round',
    thumbnail: '#F5F5DC',
    description: 'Round mosaic tiles',
    popular: false
  },
  {
    id: 'arabesque',
    name: 'Arabesque',
    value: 'arabesque',
    thumbnail: '#98D8C8',
    description: 'Decorative arabesque shape',
    popular: true
  },
  {
    id: 'metro-beige',
    name: 'Beige Metro',
    value: 'metro-beige',
    thumbnail: '#E8DCC4',
    description: 'Warm beige metro tiles',
    popular: false
  }
]

/**
 * Get patterns by product type
 */
export function getPatternsByProduct(productSlug: string): Variant[] {
  if (productSlug.includes('floor')) {
    return FLOOR_TILE_PATTERNS
  }
  if (productSlug.includes('wall')) {
    return WALL_TILE_PATTERNS
  }
  return FLOOR_TILE_PATTERNS // default
}

/**
 * Get popular patterns
 */
export function getPopularPatterns(patterns: Variant[]): Variant[] {
  return patterns.filter(p => p.popular)
}