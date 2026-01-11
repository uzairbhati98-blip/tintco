"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  text: string
  sender: 'user' | 'bot'
  id: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I can help you check your order status or escalate issues to our support team. How can I assist you today?",
      sender: 'bot'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Get or create session ID
  const getSessionId = () => {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('chatSessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('chatSessionId', sessionId)
    }
    return sessionId
  }

  // Send message to API route
  const sendMessage = async () => {
    const message = inputValue.trim()
    if (!message || isLoading) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user'
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      console.log('📤 Sending message:', message)

      // Call internal API route (no CORS issues!)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
          sessionId: getSessionId()
        })
      })

      console.log('📥 Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Response data:', data)

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message || "I received your message!",
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('❌ Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error 
          ? error.message 
          : "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact support@tintco.com",
        sender: 'bot'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Bubble Button - Tintco Brand Colors */}
      <motion.button
        className="fixed bottom-5 right-5 z-[9999] w-[60px] h-[60px] rounded-full shadow-lg flex items-center justify-center cursor-pointer"
        style={{ background: '#FFCA2C' }} // Mustard Gold
        whileHover={{ scale: 1.1, boxShadow: '0 8px 24px rgba(255, 202, 44, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        <svg 
          className="w-7 h-7"
          style={{ fill: '#1E1E1E' }} // Almost Black
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </motion.button>

      {/* Chat Window - Tintco Surface System */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[90px] right-5 z-[9998] w-[380px] h-[calc(100vh-120px)] max-h-[600px] bg-white rounded-2xl flex flex-col overflow-hidden"
            style={{
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }}
          >
            {/* Header - Tintco Brand */}
            <div 
              className="p-6 flex justify-between items-center"
              style={{ 
                background: '#FFCA2C', // Mustard Gold
                color: '#1E1E1E' // Almost Black
              }}
            >
              <div>
                <h3 className="font-semibold text-base">Tintco Support</h3>
                <p className="text-xs opacity-80 mt-0.5">We&apos;re here to help!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all text-2xl leading-none"
                style={{ 
                  color: '#1E1E1E',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 30, 30, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col gap-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'self-end rounded-br-sm'
                      : 'self-start rounded-bl-sm surface'
                  }`}
                  style={msg.sender === 'user' ? {
                    background: '#FFCA2C', // Mustard Gold
                    color: '#1E1E1E' // Almost Black
                  } : {
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    color: '#1E1E1E'
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="self-start px-4 py-4 rounded-2xl rounded-bl-sm surface flex gap-1.5"
                  style={{ border: '1px solid rgba(0, 0, 0, 0.08)' }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#FFCA2C' }}
                      animate={{ scale: [0, 1, 0] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.16,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Tintco Surface */}
            <div 
              className="p-4 bg-white flex gap-3"
              style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-full text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  color: '#1E1E1E'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFCA2C'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 0, 0, 0.08)'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 rounded-full text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: '#FFCA2C', // Mustard Gold
                  color: '#1E1E1E' // Almost Black
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && inputValue.trim()) {
                    e.currentTarget.style.opacity = '0.9'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Responsive - Full Screen on Small Devices */}
      <style jsx global>{`
        @media (max-width: 480px) {
          .fixed.bottom-\\[90px\\].right-5.z-\\[9998\\] {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  )
}