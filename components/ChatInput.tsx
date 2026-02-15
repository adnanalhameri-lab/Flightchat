// Chat Input Component - Enhanced with gradient, shadows, and animations

'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Gdzie chcesz polecieć? Opisz swoje wymarzone wakacje...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [message])

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const trimmed = message.trim()
    if (!trimmed || disabled) return

    onSend(trimmed)
    setMessage('')
    
    // Refocus after send
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const charCount = message.length
  const showCharCount = charCount > 200

  return (
    <div className="border-t border-gray-200 bg-white p-6 sticky bottom-0 z-10 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* Input container */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            {/* Input wrapper */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className={`w-full resize-none rounded-2xl border-2 bg-white px-5 py-3.5 pr-14 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl ${isFocused ? 'border-orange-400 shadow-xl' : 'border-gray-300 hover:border-orange-300'}`}
                style={{ 
                  maxHeight: '200px',
                  minHeight: '52px'
                }}
              />
              
              {/* Send button */}
              <motion.button
                onClick={handleSubmit}
                disabled={disabled || !message.trim()}
                className="absolute right-2 bottom-2 p-2.5 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: disabled || !message.trim() ? 1 : 1.05 }}
                whileTap={{ scale: disabled || !message.trim() ? 1 : 0.95 }}
                title="Wyślij (Enter)"
              >
                <Send className="w-4 h-4" />
              </motion.button>

              {/* Character count */}
              {showCharCount && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute -bottom-6 right-0 text-xs ${
                    charCount > 500 ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {charCount} znaków
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        {/* Keyboard hints */}
        <motion.div 
          className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
              Enter
            </kbd>
            <span>wyślij</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
              Shift + Enter
            </kbd>
            <span>nowa linia</span>
          </div>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>Powered by Claude AI</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
