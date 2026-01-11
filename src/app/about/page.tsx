import Image from 'next/image'
import Link from 'next/link'
import { Award, Users, Clock, Sparkles, ChevronRight, Target, Heart, Zap } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: Users },
    { label: 'Years of Excellence', value: '15', icon: Clock },
    { label: 'Projects Completed', value: '25,000+', icon: Sparkles },
    { label: 'Industry Awards', value: '12', icon: Award },
  ]

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'We use only premium materials and proven techniques to deliver exceptional results that stand the test of time.',
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We listen, advise, and work tirelessly to exceed your expectations.',
    },
    {
      icon: Zap,
      title: 'Innovation Driven',
      description: 'From AR measurements to instant quotes, we leverage technology to make your experience seamless.',
    },
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Emma Williams',
      role: 'Design Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
    {
      name: 'David Kim',
      role: 'Technical Lead',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand/5 to-transparent py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Transforming Spaces,{' '}
                <span className="text-brand">Inspiring Lives</span>
              </h1>
              <p className="text-lg text-text/70 mb-8 leading-relaxed">
                For over 15 years, Tintco has been the trusted partner for homeowners and businesses 
                looking to elevate their spaces. We combine traditional craftsmanship with cutting-edge 
                technology to deliver exceptional results.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/quote"
                  className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-black font-semibold px-6 py-3 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/categories"
                  className="inline-flex items-center gap-2 border-2 border-text/20 hover:border-brand px-6 py-3 rounded-2xl font-semibold transition-all hover:bg-brand/5"
                >
                  View Our Work
                </Link>
              </div>
            </div>
            <div className="relative animate-fadeIn">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop"
                  alt="Tintco team at work"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative blob */}
              <div className="absolute -z-10 -right-20 -bottom-20 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div 
                  key={i} 
                  className="text-center animate-fadeInUp"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-2xl mb-4">
                    <Icon className="w-8 h-8 text-brand" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-text/60">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-text/70 leading-relaxed">
              Founded in 2009, Tintco began as a small family business with a simple mission: 
              to make professional interior design accessible to everyone. What started as a 
              two-person operation has grown into a team of over 50 passionate professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">2009</h3>
              <p className="text-text/60">
                Started with residential painting services in New York
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">2015</h3>
              <p className="text-text/60">
                Expanded to decorative panels and epoxy flooring
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">2024</h3>
              <p className="text-text/60">
                Launched AR measurement technology for instant quotes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-text/60 max-w-2xl mx-auto">
              These principles guide everything we do, from product selection to customer service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <div 
                  key={i}
                  className="rounded-2xl overflow-hidden border card-hover p-8"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-brand/10 rounded-xl mb-4">
                    <Icon className="w-7 h-7 text-brand" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-text/70">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-text/60 max-w-2xl mx-auto">
              Talented professionals dedicated to bringing your vision to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div 
                key={i}
                className="group text-center animate-fadeInUp"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-brand transition-colors">
                  {member.name}
                </h3>
                <p className="text-text/60">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand/10 to-brand/5">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-text/70 mb-8">
            Join thousands of satisfied customers who trust Tintco with their interiors
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/quote"
              className="inline-flex items-center gap-2 bg-brand border-2 hover:bg-brand/90 text-black font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Free Quote
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-white border-2 hover:bg-gray-50 text-text font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}