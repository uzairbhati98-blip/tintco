/**
 * Pattern variants for Tiles
 * 
 * THUMBNAIL: Use actual tile pattern photos (200x200px)
 * Example: '/images/thumbnails/patterns/marble-white.jpg'
 */

import type { Variant } from '../types'

export const FLOOR_TILE_PATTERNS: Variant[] = [
  {
    id: 'marble-white',
    name: 'White Marble',
    value: 'marble-white',
    thumbnail: '/images/thumbnails/patterns/marble-white.jpg', // ← Real marble pattern photo
    description: 'Classic white marble veining',
    popular: true
  },
  {
    id: 'marble-black',
    name: 'Black Marble',
    value: 'marble-black',
    thumbnail: '/images/thumbnails/patterns/marble-black.jpg', // ← Real black marble photo
    description: 'Dramatic black marble',
    popular: true
  },
  {
    id: 'wood-look',
    name: 'Wood Look',
    value: 'wood-look',
    thumbnail: '/images/thumbnails/patterns/wood-look.jpg', // ← Wood-grain tile photo
    description: 'Natural wood-grain tiles',
    popular: true
  },
  {
    id: 'concrete-gray',
    name: 'Concrete Gray',
    value: 'concrete-gray',
    thumbnail: '/images/thumbnails/patterns/concrete-gray.jpg', // ← Concrete texture photo
    description: 'Modern concrete finish',
    popular: true
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    value: 'terracotta',
    thumbnail: '/images/thumbnails/patterns/terracotta.jpg',
    description: 'Warm terracotta clay',
    popular: false
  },
  {
    id: 'slate-dark',
    name: 'Dark Slate',
    value: 'slate-dark',
    thumbnail: '/images/thumbnails/patterns/slate-dark.jpg',
    description: 'Natural slate texture',
    popular: false
  },
  {
    id: 'hexagon-white',
    name: 'White Hexagon',
    value: 'hexagon-white',
    thumbnail: '/images/thumbnails/patterns/hexagon-white.jpg', // ← Hexagon tile pattern photo
    description: 'Geometric hexagon tiles',
    popular: true
  },
  {
    id: 'mosaic-blue',
    name: 'Blue Mosaic',
    value: 'mosaic-blue',
    thumbnail: '/images/thumbnails/patterns/mosaic-blue.jpg', // ← Mosaic pattern photo
    description: 'Decorative mosaic pattern',
    popular: false
  }
]

export const WALL_TILE_PATTERNS: Variant[] = [
  {
    id: 'subway-white',
    name: 'White Subway',
    value: 'subway-white',
    thumbnail: '/images/thumbnails/patterns/subway-white.jpg', // ← Classic subway tile photo
    description: 'Classic subway tile',
    popular: true
  },
  {
    id: 'subway-black',
    name: 'Black Subway',
    value: 'subway-black',
    thumbnail: '/images/thumbnails/patterns/subway-black.jpg',
    description: 'Bold black subway',
    popular: true
  },
  {
    id: 'moroccan',
    name: 'Moroccan',
    value: 'moroccan',
    thumbnail: '/images/thumbnails/patterns/moroccan.jpg', // ← Moroccan pattern photo
    description: 'Intricate Moroccan design',
    popular: true
  },
  {
    id: 'geometric-gray',
    name: 'Gray Geometric',
    value: 'geometric-gray',
    thumbnail: '/images/thumbnails/patterns/geometric-gray.jpg', // ← Geometric tile photo
    description: 'Modern geometric pattern',
    popular: true
  },
  {
    id: 'herringbone',
    name: 'Herringbone',
    value: 'herringbone',
    thumbnail: '/images/thumbnails/patterns/herringbone.jpg', // ← Herringbone layout photo
    description: 'Elegant herringbone layout',
    popular: false
  },
  {
    id: 'penny-round',
    name: 'Penny Round',
    value: 'penny-round',
    thumbnail: '/images/thumbnails/patterns/penny-round.jpg', // ← Round mosaic photo
    description: 'Round mosaic tiles',
    popular: false
  },
  {
    id: 'arabesque',
    name: 'Arabesque',
    value: 'arabesque',
    thumbnail: '/images/thumbnails/patterns/arabesque.jpg', // ← Arabesque tile photo
    description: 'Decorative arabesque shape',
    popular: true
  },
  {
    id: 'metro-beige',
    name: 'Beige Metro',
    value: 'metro-beige',
    thumbnail: '/images/thumbnails/patterns/metro-beige.jpg',
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