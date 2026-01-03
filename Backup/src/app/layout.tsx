import { Dancing_Script } from "next/font/google";

const brandFont = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
});
import './globals.css'
import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageTransition } from '@/components/page-transition'
import { ParticleBackground } from '@/components/particle-background'
import { Toaster } from '@/components/ui/sonner' // from shadcn add

<Toaster richColors position="top-center" />

export const metadata: Metadata = {
title: 'Tintco — Premium Interiors',
description: 'Painting, decorative panels, and epoxy flooring with instant quotes.',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<div className="page-container">
<Header />
<ParticleBackground />
<main className="flex-1">
<PageTransition>{children}</PageTransition>
</main>
<Footer />
<Toaster richColors position="top-center" />
</div>
</body>
</html>
)
}