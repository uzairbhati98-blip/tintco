"use client"

import React, { useMemo } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuote } from "@/lib/store/quote"
import products from "@/data/products.json"
import type { Product } from "@/lib/types"
import { toast } from "sonner"

const schema = z.object({
  areaSqM: z.coerce.number().min(0).default(0),
  surfaceType: z.enum(["plaster", "drywall", "concrete", "wood"]),
  prepRequired: z.boolean(),
  rooms: z.coerce.number().min(1).max(50).default(1),
  customerEmail: z.string().email().optional(),
})
type Form = z.infer<typeof schema>

export function QuoteForm() {
  const req = useQuote((s) => s.request)
  const ingest = useQuote((s) => s.ingestARMeasurement)
  const clearQuote = useQuote((s) => s.clearQuote)

  const product = useMemo(
    () =>
      req
        ? (products as unknown as Product[]).find((p) => p.id === req.productId)
        : undefined,
    [req?.productId]
  )

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      areaSqM: req?.areaSqM ?? 0,
      surfaceType: (req?.surfaceType as Form["surfaceType"]) ?? "drywall",
      prepRequired: req?.prepRequired ?? false,
      rooms: req?.rooms ?? 1,
      customerEmail: req?.customerEmail,
    },
  })

  const onSubmit = async (values: Form) => {
    const payload = { ...req, ...values }
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      const json = await res.json()
      toast.success("Quote submitted", {
        description: `ID: ${json.quoteId}`,
      })
      clearQuote()
    } catch {
      toast.error("Unable to submit quote right now")
    }
  }

  // basic price estimate if available
  const price = product
    ? (req?.areaSqM ?? 0) * (Number(product.price) || 0)
    : 0

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 surface p-6 rounded-2xl"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm">
          Area (sq m)
          <input
            {...form.register("areaSqM", { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="mt-1 w-full border-brand rounded-2xl px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Rooms
          <input
            {...form.register("rooms", { valueAsNumber: true })}
            type="number"
            className="mt-1 w-full border-brand rounded-2xl px-3 py-2"
          />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm">
          Surface Type
          <select
            {...form.register("surfaceType")}
            className="mt-1 w-full border-brand rounded-2xl px-3 py-2"
          >
            <option value="plaster">Plaster</option>
            <option value="drywall">Drywall</option>
            <option value="concrete">Concrete</option>
            <option value="wood">Wood</option>
          </select>
        </label>

        <label className="text-sm">
          Prep Required?
          <select
            {...form.register("prepRequired", {
              setValueAs: (v) => v === "true",
            })}
            className="mt-1 w-full border-brand rounded-2xl px-3 py-2"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>
      </div>

      <label className="text-sm">
        Email (optional)
        <input
          {...form.register("customerEmail")}
          type="email"
          className="mt-1 w-full border-brand rounded-2xl px-3 py-2"
        />
      </label>

      {product && (
        <div className="rounded-2xl border border-brand p-4 bg-white">
          <div className="font-medium">Estimate</div>
          <div className="text-sm text-black/70 mt-1">
            Product: {product.name} — ${product.price}/{product.unit}
          </div>
          <div className="text-lg mt-2">
            Subtotal:{" "}
            <span className="font-semibold">${price.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="rounded-2xl bg-brand text-black px-6 py-3 font-medium hover:bg-brand/90 transition-colors"
      >
        Submit Quote
      </button>
    </form>
  )
}
