import type { PaintFinish } from './types'

export const PAINT_FINISHES: PaintFinish[] = [
  {
    id: 'gloss',
    name: 'Gloss',
    icon: '✨',
    description: 'High shine, easy to clean',
    popular: true
  },
  {
    id: 'semi-gloss',
    name: 'Semi-Gloss',
    icon: '💫',
    description: 'Subtle shine, durable',
    popular: true
  },
  {
    id: 'matte',
    name: 'Matte',
    icon: '🎨',
    description: 'No shine, modern look',
    popular: true
  },
  {
    id: 'marble',
    name: 'Marble',
    icon: '🪨',
    description: 'Luxurious marble effect',
    popular: false
  },
  {
    id: 'epoxy',
    name: 'Epoxy',
    icon: '💎',
    description: 'Ultra-durable coating',
    popular: false
  },
  {
    id: 'microcement',
    name: 'Microcement',
    icon: '🏗️',
    description: 'Industrial concrete look',
    popular: false
  }
]

export function getPopularFinishes(): PaintFinish[] {
  return PAINT_FINISHES.filter(finish => finish.popular)
}

export function getFinishById(id: string): PaintFinish | undefined {
  return PAINT_FINISHES.find(finish => finish.id === id)
}