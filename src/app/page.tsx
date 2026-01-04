import Link from 'next/link'
import Image from 'next/image'
import testimonials from '@/data/testimonials.json'
import { Smartphone, DollarSign, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section - Enhanced with animations and proper layout */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Animated */}
            <div className="animate-fadeInUp">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Elevate your space with{' '}
                <span className="text-brand inline-block animate-pulseSubtle">
                  Tintco
                </span>
              </h1>
              <p className="mt-6 text-lg text-text/70 max-w-lg animate-fadeInUp animation-delay-100">
                Painting, decorative panels, and epoxy flooring — with instant 
                quotes and an AR measurement flow.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 animate-fadeInUp animation-delay-200">
                <Link 
                  className="inline-flex rounded-2xl bg-brand hover:bg-brand/90 text-black px-8 py-3.5 font-semibold shadow-soft transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95" 
                  href="/categories"
                >
                  Shop Now
                </Link>
                <Link 
                  className="inline-flex rounded-2xl border-2 border-text/20 hover:border-brand px-8 py-3.5 font-semibold transition-all duration-300 hover:bg-brand/5 hover:-translate-y-0.5 active:scale-95" 
                  href="/quote"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
            
            {/* Right Image - Properly aligned */}
            <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 animate-fadeIn">
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full rounded-2xl lg:rounded-l-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1505691723518-36a5ac3b2d42?q=80&w=1600&auto=format&fit=crop" 
                  alt="Elegant interior showcasing our premium finishes" 
                  fill 
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient blob */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-float" />
      </section>

      {/* Category Highlights - Enhanced hover effects */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-text/60 max-w-2xl mx-auto">
            Transform any space with our premium interior solutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Wall Painting',
              href: '/categories/Wall painting',
              img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
              description: 'Premium paints with perfect finish'
            },
            {
              title: 'Wall Coverings',
              href: '/categories/Wall-coverings',
              img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1600&auto=format&fit=crop',
              description: '3D textures and modern designs'
            },
            {
              title: 'Flooring',
              href: '/categories/flooring',
              img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop',
              description: 'Durable and stylish floor coatings'
            }
          ].map((c, i) => (
            <Link 
              key={c.title} 
              href={c.href} 
              className="group block rounded-2xl overflow-hidden bg-white shadow-soft transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src={c.img} 
                  alt={c.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-brand transition-colors duration-300">
                  {c.title}
                </h3>
                <p className="text-sm text-text/60">
                  {c.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works - Animated */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-text/60 max-w-2xl mx-auto">
              Get your dream space in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand/20 via-brand to-brand/20" />
            
            {[
              {
                icon: <Smartphone className="w-10 h-10" />,
                title: 'Measure with AR',
                description: 'Use your phone camera to instantly measure walls and spaces'
              },
              {
                icon: <DollarSign className="w-10 h-10" />,
                title: 'Get instant estimate',
                description: 'Our calculator gives you an estimated price in seconds'
              },
              {
                icon: <Sparkles className="w-10 h-10" />,
                title: 'Book & relax',
                description: 'Schedule your service and we handle the rest'
              }
            ].map((step, i) => (
              <div 
                key={i} 
                className="relative animate-fadeInUp"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="rounded-2xl border-2 border-gray-100 p-6 bg-white hover:border-brand/30 hover:shadow-lg transition-all duration-300 group">
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-brand text-black font-bold rounded-full flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-brand transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text/70">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced with carousel feel */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-text/60 max-w-2xl mx-auto">
            Join thousands of satisfied customers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((t, i) => (
            <div 
              key={i} 
              className="rounded-2xl border-2 border-gray-100 p-6 bg-white hover:border-brand/30 hover:shadow-lg transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Quote marks */}
              <div className="text-5xl text-brand/20 font-serif leading-none mb-4">"</div>
              
              <p className="text-gray-700 mb-4 italic">
                {t.quote}
              </p>
              
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                  <span className="text-brand font-semibold">
                    {t.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.author}</div>
                  <div className="text-xs text-text/50">Verified Customer</div>
                </div>
              </div>
              
              {/* Rating stars */}
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-brand">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand/10 to-brand/5 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeInUp">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-text/70 mb-8 animate-fadeInUp animation-delay-100">
            Get started with a free quote or browse our catalog
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fadeInUp animation-delay-200">
            <Link 
              href="/quote"
              className="inline-flex rounded-2xl bg-brand hover:bg-brand/90 text-black px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Your Free Quote
            </Link>
            <Link 
              href="/categories"
              className="inline-flex rounded-2xl bg-white hover:bg-gray-50 text-text px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              View Our Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}