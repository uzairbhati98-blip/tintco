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
        className="inline-flex rounded-2xl border-2 border-text/20 hover:border-brand px-8 py-3.5 font-semibold transition-all duration-300 hover:bg-brand/5 hover:-translate-y-0.5 active:scale-95"
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
        className="inline-flex rounded-2xl border-2 border-text/20 hover:border-brand px-8 py-3.5 font-semibold transition-all duration-300 hover:bg-brand/5 hover:-translate-y-0.5 active:scale-95"
      >
        Get Quick Quote
      </motion.button>
    </div>
  );
}
