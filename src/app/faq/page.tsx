'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Phone, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const faqCategories = [
  {
    name: 'General',
    icon: '💬',
    faqs: [
      {
        question: 'What services does Tintco offer?',
        answer: 'Tintco specializes in premium interior painting, decorative wall panels, and epoxy flooring. We offer complete transformation services including consultation, measurement, installation, and finishing touches.',
      },
      {
        question: 'Do you offer free consultations?',
        answer: 'Yes! We offer free initial consultations either virtually or in-person. Our experts will discuss your vision, provide recommendations, and help you plan your project.',
      },
      {
        question: 'What areas do you serve?',
        answer: 'We currently serve the greater New York metropolitan area, including all five boroughs and surrounding counties within a 50-mile radius. Contact us to check if we serve your specific location.',
      },
    ],
  },
  {
    name: 'Pricing & Quotes',
    icon: '💰',
    faqs: [
      {
        question: 'How do I get a quote?',
        answer: 'You can get an instant quote using our AR measurement tool on any product page, fill out our online quote form, or contact us directly. Our AR tool provides the most accurate instant estimates.',
      },
      {
        question: 'What factors affect pricing?',
        answer: 'Pricing depends on several factors: room size, surface condition, product selection, number of coats needed, and any special preparations required. Our quotes are transparent and include all costs.',
      },
      {
        question: 'Do you offer financing options?',
        answer: 'Yes, we partner with leading financing providers to offer flexible payment plans. Options include 0% interest for 12 months on projects over $2,500.',
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No hidden fees! Our quotes include all labor, materials, and standard preparation work. Any additional work needed will be discussed and approved before proceeding.',
      },
    ],
  },
  {
    name: 'AR Measurement',
    icon: '📱',
    faqs: [
      {
        question: 'How does the AR measurement tool work?',
        answer: 'Our AR tool uses your phone camera to scan and measure your space in real-time. Simply point your camera at the walls, and the tool automatically calculates dimensions and area.',
      },
      {
        question: 'Is the AR measurement accurate?',
        answer: 'Our AR tool is typically accurate within 2-3% of manual measurements. For large projects, we recommend confirming with professional measurements before final ordering.',
      },
      {
        question: 'What devices support AR measurement?',
        answer: 'The AR tool works on most modern smartphones including iPhone 8 and later, and Android devices with ARCore support. A desktop alternative is available for manual input.',
      },
    ],
  },
  {
    name: 'Products',
    icon: '🎨',
    faqs: [
      {
        question: 'What paint brands do you use?',
        answer: 'We use premium brands including Benjamin Moore, Sherwin-Williams, and Farrow & Ball. All paints are low-VOC and safe for indoor use.',
      },
      {
        question: 'Can I provide my own materials?',
        answer: 'While we recommend our curated products for best results, we can work with customer-supplied materials. Note that this may affect warranty coverage.',
      },
      {
        question: 'Do you offer eco-friendly options?',
        answer: 'Absolutely! We have a full range of eco-friendly, zero-VOC paints and sustainable decorative panels made from recycled materials.',
      },
    ],
  },
  {
    name: 'Process & Timeline',
    icon: '⏱️',
    faqs: [
      {
        question: 'How long does a typical project take?',
        answer: 'Most single-room projects take 2-3 days. Larger projects or those requiring special preparation may take 5-7 days. We provide detailed timelines with every quote.',
      },
      {
        question: 'Do I need to move my furniture?',
        answer: 'Our team handles furniture moving and protection as part of our service. We carefully cover and protect all items, though we recommend removing valuable or fragile items.',
      },
      {
        question: 'What preparation is needed?',
        answer: 'Minimal preparation is needed from your side. Our team handles wall preparation, patching, sanding, and priming. We just ask that personal items be secured.',
      },
    ],
  },
  {
    name: 'Warranty & Support',
    icon: '🛡️',
    faqs: [
      {
        question: 'What warranty do you offer?',
        answer: 'We provide a 2-year comprehensive warranty on all work, covering both materials and labor. Premium products may include extended manufacturer warranties.',
      },
      {
        question: 'What if I\'m not satisfied with the results?',
        answer: 'Your satisfaction is guaranteed. If you\'re not completely happy, we\'ll work with you to make it right at no additional cost.',
      },
      {
        question: 'Do you offer maintenance services?',
        answer: 'Yes, we offer annual maintenance packages to keep your surfaces looking fresh. This includes touch-ups, cleaning, and minor repairs.',
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = faqCategories
    .filter(category => selectedCategory === 'all' || category.name === selectedCategory)
    .map(category => ({
      ...category,
      faqs: category.faqs.filter(
        faq =>
          searchQuery === '' ||
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(category => category.faqs.length > 0)

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
              Frequently Asked{' '}
              <span className="text-brand">Questions</span>
            </h1>
            <p className="text-lg text-text/70 mb-8">
              Find answers to common questions about our services, products, and processes.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-brand focus:outline-none transition-colors text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-16 z-30 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand text-black'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all inline-flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? 'bg-brand text-black'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-text/60">No questions found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="mt-4 text-brand font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFAQs.map((category) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {selectedCategory === 'all' && (
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </h2>
                  )}
                  
                  <div className="space-y-3">
                    {category.faqs.map((faq, i) => {
                      const id = `${category.name}-${i}`
                      const isExpanded = expandedItems.includes(id)
                      
                      return (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-2xl overflow-hidden border card-hover"
                        >
                          <button
                            onClick={() => toggleExpand(id)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="font-semibold pr-4">{faq.question}</h3>
                            <ChevronDown 
                              className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-4 text-text/70">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 bg-gradient-to-br from-brand/10 to-brand/5">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-text/70 mb-8">
            Our team is here to help you with any questions or concerns
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="tel:+15551234567"
              className="rounded-2xl overflow-hidden border card-hover p-6 group"
            >
              <Phone className="w-8 h-8 text-brand mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-text/60">+1 (555) 123-4567</p>
            </a>
            
            <a
              href="mailto:hello@tintco.com"
              className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all group"
            >
              <Mail className="w-8 h-8 text-brand mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-text/60">hello@tintco.com</p>
            </a>
            
            <button
              onClick={() => alert('Live chat coming soon!')}
              className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all group"
            >
              <MessageCircle className="w-8 h-8 text-brand mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-text/60">Available 9am-6pm EST</p>
            </button>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-black font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}