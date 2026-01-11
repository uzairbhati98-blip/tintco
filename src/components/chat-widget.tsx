"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  text: string
  sender: 'user' | 'bot'
  id: string
}

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/ai-support'

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

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('chatSessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('chatSessionId', sessionId)
    }
    return sessionId
  }

  const sendMessage = async () => {
    const message = inputValue.trim()
    if (!message || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user'
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message || "I received your message!",
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact support@yourcompany.com",
        sender: 'bot'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Bubble */}
      <motion.button
        className="fixed bottom-5 right-5 z-[9999] w-[60px] h-[60px] rounded-full bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        <svg 
          className="w-7 h-7 fill-white" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[90px] right-5 z-[9998] w-[380px] max-w-[calc(100vw-40px)] h-[550px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-base">AI Support Assistant</h3>
                <p className="text-xs opacity-90 mt-0.5">We&apos;re here to help!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-2xl leading-none"
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white self-end rounded-br-sm'
                      : 'bg-white text-gray-800 self-start border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white self-start px-3.5 py-4 rounded-xl border border-gray-200 rounded-bl-sm flex gap-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
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

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 flex gap-2.5">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-full text-sm outline-none focus:border-purple-600 transition-colors disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-br from-purple-600 to-purple-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Full-Screen Overlay */}
      <style jsx global>{`
        @media (max-width: 480px) {
          .chat-window-mobile {
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