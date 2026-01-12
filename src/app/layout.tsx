import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'
import { ChatWidget } from '@/components/chat-widget'

// Decorative serif font (matches uploaded style)
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tintco - Premium Interior Design & Construction',
  description: 'Transform your space with premium wall painting, decorative panels, and epoxy flooring. Get instant quotes with AR measurement technology.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={playfairDisplay.variable}>
      <body className="antialiased">
        {/* Header doesn't need brandFont prop - font is in CSS variables */}
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              fontFamily: 'var(--font-playfair)',
            },
          }}
        />
      </body>
    </html>
  )
}