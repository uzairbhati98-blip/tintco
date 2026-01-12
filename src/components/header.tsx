"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search, User2 } from "lucide-react"
import { useCart } from "@/lib/store/cart"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function Header() {
  const count = useCart((s) => s.count)

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#fffdf5]/80 border-b border-brand/30 shadow-subtle">
      <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-0 group select-none">
          {/* Mascot animation wrapper */}
          <motion.div
            className="relative w-30 h-30"
            animate={{ scale: [1, 1.04, 1], y: [0, -1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.8 },
            }}
          >
            <div className="absolute inset-0 z-10 overflow-hidden rounded-full pointer-events-none">
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 bg-white/80"
                animate={{ y: ["-100%", "0%", "-100%"] }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 6,
                  ease: "easeInOut",
                }}
              />
            </div>

            <Image
              src="/mascot.png"
              alt="Tintco Mascot"
              fill
              className="object-contain select-none pointer-events-none"
              priority
              style={{ backgroundColor: "transparent", mixBlendMode: "normal" }}
            />
          </motion.div>

          {/* Brand Name - uses Playfair Display from CSS variable */}
          <motion.span
            className="text-4xl sm:text-5xl font-bold tracking-tight text-brand"
            style={{ fontFamily: 'var(--font-playfair)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Tint<span className="text-[#1E1E1E]">Co.</span>
          </motion.span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-lg">
          <Link href="/categories" className="hover:text-brand transition-colors">
            Shop
          </Link>
          <Link href="/about" className="hover:text-brand transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-brand transition-colors">
            Contact
          </Link>
          <Link href="/faq" className="hover:text-brand transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/signin" aria-label="Account" className="p-2 rounded-xl hover:bg-black/5">
            <User2 className="h-5 w-5" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative p-2 rounded-xl hover:bg-black/5">
            <motion.div
              key={count}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.div>

            {count > 0 && (
              <motion.span
                key={`count-${count}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="absolute -right-1 -top-1 bg-brand text-[10px] text-black font-semibold rounded-full h-5 min-w-5 grid place-items-center px-1"
              >
                {count}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}