/**
 * Cart Store with Full Paint Customization Support
 * 
 * Handles:
 * - Generic variants (materials, patterns, finishes)
 * - Paint products with BOTH color AND finish
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem, SelectedColor, SelectedVariant, FinishType, PaintFinish } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  count: number
  
  // Add item with paint customization or generic variant
  add: (
    product: Product, 
    quantity: number, 
    customization?: { 
      // For paint products (color + finish)
      color?: SelectedColor
      finish?: { type: FinishType; name: string }
      // For other products (single variant)
      variant?: SelectedVariant 
    }
  ) => void
  
  remove: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clear: () => void
  total: () => number
}

/**
 * Generate unique cart item ID
 * For paint: productId + color + finish
 * For others: productId + variant
 */
function generateCartItemId(
  productId: string, 
  customization?: { 
    color?: SelectedColor
    finish?: { type: FinishType; name: string }
    variant?: SelectedVariant 
  }
): string {
  if (!customization) {
    return productId
  }
  
  // Paint product: Include both color and finish
  if (customization.color && customization.finish) {
    return `${productId}_${customization.color.hex}_${customization.finish.type}`
  }
  
  // Paint product: Color only (no finish selected)
  if (customization.color) {
    return `${productId}_${customization.color.hex}`
  }
  
  // Generic variant
  if (customization.variant) {
    return `${productId}_${customization.variant.value}`
  }
  
  return productId
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,

      add: (product, quantity, customization) => {
        const cartItemId = generateCartItemId(product.id, customization)
        const items = get().items
        const existingIndex = items.findIndex(item => item.cartItemId === cartItemId)

        if (existingIndex >= 0) {
          // Item exists - increase quantity
          const updated = [...items]
          updated[existingIndex].quantity += quantity
          
          set({ 
            items: updated,
            count: updated.reduce((sum, item) => sum + item.quantity, 0)
          })
        } else {
          // New item - add to cart
          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images[0],
            cartItemId
          }

          // Add paint customization (color + finish)
          if (customization?.color && customization?.finish) {
            newItem.paintCustomization = {
              color: {
                name: customization.color.name,
                hex: customization.color.hex
              },
              finish: {
                type: customization.finish.type,
                name: customization.finish.name
              }
            }
          }
          // Add color only (no finish)
          else if (customization?.color) {
            newItem.paintCustomization = {
              color: {
                name: customization.color.name,
                hex: customization.color.hex
              },
              finish: {
                type: 'matte', // default
                name: 'Matte'
              }
            }
          }
          // Add generic variant
          else if (customization?.variant) {
            newItem.variant = {
              type: customization.variant.id.includes('material') ? 'material' :
                   customization.variant.id.includes('pattern') ? 'pattern' :
                   'finish',
              name: customization.variant.name,
              value: customization.variant.value
            }
          }

          const updated = [...items, newItem]
          
          set({ 
            items: updated,
            count: updated.reduce((sum, item) => sum + item.quantity, 0)
          })
        }
      },

      remove: (cartItemId) => {
        const updated = get().items.filter(item => item.cartItemId !== cartItemId)
        set({ 
          items: updated,
          count: updated.reduce((sum, item) => sum + item.quantity, 0)
        })
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().remove(cartItemId)
          return
        }

        const items = get().items
        const index = items.findIndex(item => item.cartItemId === cartItemId)
        
        if (index >= 0) {
          const updated = [...items]
          updated[index].quantity = quantity
          
          set({ 
            items: updated,
            count: updated.reduce((sum, item) => sum + item.quantity, 0)
          })
        }
      },

      clear: () => {
        set({ items: [], count: 0 })
      },

      total: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'tintco-cart'
    }
  )
)