'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones } from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.', {
      duration: 5000,
    })
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      message: '',
    })
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // TASK 2: Function to open chat widget
  const handleLiveChatClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('openChatWidget'))
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      subtext: 'Mon-Fri 9am-6pm EST',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@tintco.com',
      subtext: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Office',
      content: '123 Design Ave, Suite 200',
      subtext: 'New York, NY 10001',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Friday',
      subtext: '9:00 AM - 6:00 PM EST',
    },
  ]

  const faqs = [
    {
      question: 'How quickly can you start my project?',
      answer: 'Most projects can begin within 3-5 business days after quote approval.',
    },
    {
      question: 'Do you offer warranties?',
      answer: 'Yes! All our work comes with a 2-year warranty on materials and labor.',
    },
    {
      question: 'Can I get a quote without an on-site visit?',
      answer: 'Absolutely! Use our AR measurement tool for instant quotes, or send us photos.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand/5 to-transparent py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Let's Start Your{' '}
              <span className="text-brand">Transformation</span>
            </h1>
            <p className="text-lg text-text/70">
              Have questions? Need a custom quote? Our team is here to help bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden border card-hover p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand focus:outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand focus:outline-none transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand focus:outline-none transition-colors bg-white"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="quote">Request Quote</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand/90 disabled:bg-brand/50 text-black font-semibold py-4 rounded-2xl transition-all hover:shadow-xl disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⟳
                        </motion.span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {contactInfo.map((info, i) => {
                const Icon = info.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="rounded-2xl overflow-hidden border card-hover p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-brand" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-text font-medium">{info.content}</p>
                        <p className="text-sm text-text/60">{info.subtext}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a 
                    href="tel:+15551234567"
                    className="flex items-center gap-3 text-sm font-medium hover:text-brand transition-colors"
                  >
                    <Headphones className="w-4 h-4" />
                    Call Support
                  </a>
                  {/* TASK 2: Fixed - Now triggers chat widget */}
                  <button 
                    onClick={handleLiveChatClick}
                    className="flex items-center gap-3 text-sm font-medium hover:text-brand transition-colors w-full text-left"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Our Showroom</h2>
            <p className="text-text/60">
              See our products and finishes in person at our Kuwait showroom
            </p>
          </div>
          
          {/* Map Placeholder */}
          <div className="relative h-96 border-2 rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-brand mx-auto mb-4" />
                <p className="font-semibold">B1 Suad Complex Fahad Al-Salam street</p>
                <p className="text-text/60">Kuwait City, Kuwait</p>
                {/* TASK 4: Fixed - Proper Google Maps search link */}
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=B1+Suad+Complex+Fahad+Al-Salam+street+Kuwait+City+Kuwait"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-brand font-medium hover:underline"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden border card-hover p-6"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-text/70">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-text/60 mb-4">Can't find what you're looking for?</p>
            <a 
              href="/faq"
              className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
            >
              View All FAQs →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}