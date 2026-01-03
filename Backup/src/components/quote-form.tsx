"use client"
import React, { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuote } from '@/lib/store/quote'
import products from '@/data/products.json'
import type { Product } from '@/lib/types'

const schema = z.object({
	areaSqM: z.coerce.number().min(0).default(0),
	surfaceType: z.enum(['plaster', 'drywall', 'concrete', 'wood']),
	prepRequired: z.boolean(),
	rooms: z.coerce.number().min(1).max(50).default(1),
	customerEmail: z.string().email().optional(),
})

type Form = z.infer<typeof schema>

export function QuoteForm(){
	const q = useQuote(s=>s.current)
	const setArea = useQuote(s=>s.setArea)
	const setSurface = useQuote(s=>s.setSurface)
	const setPrep = useQuote(s=>s.setPrep)
	const setEmail = useQuote(s=>s.setEmail)
	const estimate = useQuote(s=>s.estimate)

	const product = useMemo(()=> q ? (products as any[]).find(p => p.id === q.productId) as Product | undefined : undefined, [q?.productId])

	const form = useForm<Form>({
		resolver: zodResolver(schema),
		defaultValues: {
			areaSqM: q?.areaSqM ?? 0,
			surfaceType: q?.surfaceType ?? 'drywall',
			prepRequired: q?.prepRequired ?? false,
			rooms: q?.rooms ?? 1,
			customerEmail: q?.customerEmail
		}
	})

	const onSubmit = async (values: Form) => {
		setArea(values.areaSqM); setSurface(values.surfaceType); setPrep(values.prepRequired); setEmail(values.customerEmail || '')
		// hit mock API
		const res = await fetch('/api/quote', { method:'POST', body: JSON.stringify({ ...q, ...values }), headers: { 'Content-Type':'application/json' } })
		const json = await res.json()
		alert(`Quote submitted. ID: ${json.quoteId}`)
	}

	const price = product ? estimate(product) : undefined

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
			<div className="grid md:grid-cols-2 gap-4">
				<label className="text-sm">Area (sq m)
					<input {...form.register('areaSqM', { valueAsNumber: true })} type="number" step="0.01" className="mt-1 w-full border rounded-xl px-3 py-2" />
				</label>
				<label className="text-sm">Rooms
					<input {...form.register('rooms', { valueAsNumber: true })} type="number" className="mt-1 w-full border rounded-xl px-3 py-2" />
				</label>
			</div>

			<div className="grid md:grid-cols-2 gap-4">
				<label className="text-sm">Surface Type
					<select {...form.register('surfaceType')} className="mt-1 w-full border rounded-xl px-3 py-2">
						<option value="plaster">Plaster</option>
						<option value="drywall">Drywall</option>
						<option value="concrete">Concrete</option>
						<option value="wood">Wood</option>
					</select>
				</label>
				<label className="text-sm">Prep Required?
					<select {...form.register('prepRequired', { setValueAs: (v)=> v === 'true' })} className="mt-1 w-full border rounded-xl px-3 py-2">
						<option value="false">No</option>
						<option value="true">Yes</option>
					</select>
				</label>
			</div>

			<label className="text-sm">Email (optional)
				<input {...form.register('customerEmail')} type="email" className="mt-1 w-full border rounded-xl px-3 py-2" />
			</label>

			{product && (
				<div className="rounded-2xl border p-4 bg-white">
					<div className="font-medium">Estimate</div>
					<div className="text-sm text-black/70 mt-1">Product: {product.name} — ${product.price}/{product.unit}</div>
					<div className="text-lg mt-2">Subtotal: <span className="font-semibold">${price?.subtotal.toFixed(2)}</span></div>
					<div className="text-xs text-black/60">Factors: surface ×{price?.factors.surface} · prep ×{price?.factors.prep}</div>
				</div>
			)}

			<button className="rounded-2xl bg-brand text-black px-6 py-3 font-medium">Submit Quote</button>
		</form>
	)
}