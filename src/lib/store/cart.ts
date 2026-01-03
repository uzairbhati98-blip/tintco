"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/types"

export type CartItem = {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  count: number
  add: (product: Product, quantity?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, quantity: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,

      add: (product, quantity = 1) => {
        const price =
          typeof product.price === "number"
            ? product.price
            : Number(product.price) || 0

        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          image: product.images?.[0] ?? "",
          price,
          quantity: Number(quantity) || 1,
        }

        set((state) => {
          const existing = state.items.find(i => i.productId === newItem.productId)
          const items = existing
            ? state.items.map(i =>
                i.productId === newItem.productId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              )
            : [...state.items, newItem]

          return {
            items,
            count: items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),
          }
        })
      },

      remove: (productId) =>
        set((state) => {
          const items = state.items.filter(i => i.productId !== productId)
          return {
            items,
            count: items.reduce((s, i) => s + (Number(i.quantity) || 0), 0),
          }
        }),

      setQty: (productId, quantity) =>
        set((state) => {
          const items = state.items.map(i =>
            i.productId === productId ? { ...i, quantity: Number(quantity) || 1 } : i
          )
          return {
            items,
            count: items.reduce((s, i) => s + (Number(i.quantity) || 0), 0),
          }
        }),

      clear: () => set({ items: [], count: 0 }),
    }),
    { name: "tintco-cart-storage" }
  )
)
