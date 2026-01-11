// app/layout.tsx
import "./globals.css"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { ParticleBackground } from "@/components/particle-background"
import { Toaster } from "@/components/ui/sonner"
import { Inter, Playfair_Display } from "next/font/google"
import { ChatWidget } from '@/components/chat-widget'

const baseFont = Inter({ subsets: ["latin"], variable: "--font-base" })
const brandFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-brand",
})

export const metadata: Metadata = {
  title: "Tintco — Premium Interiors",
  description: "Painting, decorative panels, and epoxy flooring with instant quotes.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ✅ Apply only the base font globally */}
      <body className={baseFont.className}>
        <div className="page-container">
          <Header brandFont={brandFont} /> {/* Pass the Playfair font */}
          <ParticleBackground />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <Toaster richColors position="top-center" />
          <ChatWidget />
        </div>
      </body>
    </html>
  )
}
