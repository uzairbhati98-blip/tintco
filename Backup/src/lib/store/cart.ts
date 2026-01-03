import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../types'


interface CartState {
items: CartItem[]
count: number
add: (product: Product, qty?: number) => void
remove: (productId: string) => void
setQty: (productId: string, qty: number) => void
clear: () => void
}


export const useCart = create<CartState>()(
persist(
(set, get) => ({
items: [],
count: 0,
add: (p, qty = 1) => {
const items = [...get().items]
const idx = items.findIndex(i => i.productId === p.id)
if (idx >= 0) items[idx].quantity += qty
else items.push({ productId: p.id, name: p.name, price: p.price, quantity: qty, image: p.images[0] })
set({ items, count: items.reduce((a,b)=>a+b.quantity,0) })
},
remove: (id) => {
const items = get().items.filter(i => i.productId !== id)
set({ items, count: items.reduce((a,b)=>a+b.quantity,0) })
},
setQty: (id, qty) => {
const items = get().items.map(i => i.productId === id ? { ...i, quantity: Math.max(1, qty) } : i)
set({ items, count: items.reduce((a,b)=>a+b.quantity,0) })
},
clear: () => set({ items: [], count: 0 })
}),
{ name: 'tintco-cart' }
)
)