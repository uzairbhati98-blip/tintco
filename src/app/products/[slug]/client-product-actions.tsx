"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/lib/store/cart";
import { useQuote } from "@/lib/store/quote";
import type { Product } from "@/lib/types";

export function ClientProductActions({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const setFromProduct = useQuote((s) => s.setFromProduct);

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => {
          add(product, 1);
          toast.success(`${product.name} added to cart!`, {
            description: "You can view it in your cart anytime.",
            duration: 2500,
          });
        }}
        className="px-6 py-3 rounded-2xl bg-brand text-black font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-all"
      >
        Add to Cart
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => {
          setFromProduct(product);
          location.href = "/quote";
        }}
        className="px-6 py-3 rounded-2xl border border-brand text-brand font-medium hover:bg-brand hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
      >
        Get Quick Quote
      </motion.button>
    </div>
  );
}
