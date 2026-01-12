/**
 * Cart Store with Variant Tracking
 * 
 * IMPORTANT: Items with different variants are treated as separate cart items
 * Example: Oak wood panel ≠ Walnut wood panel
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem, SelectedColor, SelectedVariant } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  count: number
  
  // Add item with optional variant info
  add: (
    product: Product, 
    quantity: number, 
    variant?: { color?: SelectedColor; variant?: SelectedVariant }
  ) => void
  
  // Remove item by cartItemId
  remove: (cartItemId: string) => void
  
  // Update quantity
  updateQuantity: (cartItemId: string, quantity: number) => void
  
  // Clear cart
  clear: () => void
  
  // Get total price
  total: () => number
}

/**
 * Generate unique cart item ID
 * Combines productId with variant information
 */
function generateCartItemId(productId: string, variant?: { color?: SelectedColor; variant?: SelectedVariant }): string {
  if (!variant) {
    return productId
  }
  
  if (variant.color) {
    return `${productId}_color_${variant.color.hex}`
  }
  
  if (variant.variant) {
    return `${productId}_${variant.variant.value}`
  }
  
  return productId
}

/**
 * Format variant display name
 */
function getVariantDisplayName(variant?: { color?: SelectedColor; variant?: SelectedVariant }): string | undefined {
  if (!variant) return undefined
  
  if (variant.color) {
    return variant.color.name
  }
  
  if (variant.variant) {
    return variant.variant.name
  }
  
  return undefined
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,

      add: (product, quantity, variant) => {
        const cartItemId = generateCartItemId(product.id, variant)
        const items = get().items
        const existingIndex = items.findIndex(item => item.cartItemId === cartItemId)

        if (existingIndex >= 0) {
          // Item with this exact variant already exists - increase quantity
          const updated = [...items]
          updated[existingIndex].quantity += quantity
          
          set({ 
            items: updated,
            count: updated.reduce((sum, item) => sum + item.quantity, 0)
          })
        } else {
          // New item with this variant - add to cart
          const variantInfo = variant?.color ? {
            type: 'color' as const,
            name: variant.color.name,
            value: variant.color.hex
          } : variant?.variant ? {
            type: variant.variant.id.includes('material') ? 'material' as const :
                 variant.variant.id.includes('pattern') ? 'pattern' as const :
                 variant.variant.id.includes('finish') ? 'finish' as const :
                 'material' as const, // default
            name: variant.variant.name,
            value: variant.variant.value
          } : undefined

          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images[0],
            variant: variantInfo,
            cartItemId
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