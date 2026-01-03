'use client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cart'


export default function Checkout(){
const r = useRouter()
const { clear } = useCart()
return (
<div className="mx-auto max-w-3xl px-4 py-10">
<h1 className="text-3xl font-semibold mb-6">Checkout</h1>
<form onSubmit={(e)=>{ e.preventDefault(); clear(); r.push('/success') }} className="grid gap-4">
<input required placeholder="Full name" className="border rounded-xl px-3 py-2" />
<input required placeholder="Email" type="email" className="border rounded-xl px-3 py-2" />
<input required placeholder="Address" className="border rounded-xl px-3 py-2" />
<div className="grid grid-cols-2 gap-3">
<input required placeholder="City" className="border rounded-xl px-3 py-2" />
<input required placeholder="ZIP" className="border rounded-xl px-3 py-2" />
</div>
<button className="rounded-2xl bg-brand text-black px-6 py-3 font-medium">Pay (mock)</button>
</form>
</div>
)
}