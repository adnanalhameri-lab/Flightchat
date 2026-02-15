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

  const quickSuggestions = [
    'Jakie hotele polecasz?',
    'Co spakować?',
    'Najlepszy czas na wyjazd?',
  ]

  return (
    <div className="border-t border-gray-100 bg-white p-6 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Quick suggestions pills */}
        {!message && !disabled && (
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(suggestion)}
                className="border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

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
                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 pr-14 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${isFocused ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200 hover:border-gray-300'}`}
                style={{ 
                  maxHeight: '200px',
                  minHeight: '48px'
                }}
              />
              
              {/* Send button */}
              <motion.button
                onClick={handleSubmit}
                disabled={disabled || !message.trim()}
                className="absolute right-2 bottom-2 p-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                whileHover={{ scale: disabled || !message.trim() ? 1 : 1.05 }}
                whileTap={{ scale: disabled || !message.trim() ? 1 : 0.95 }}
                title="Wyślij (Enter)"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Keyboard hints */}
        <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs">
              Enter
            </kbd>
            <span>wyślij</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs">
              Shift + Enter
            </kbd>
            <span>nowa linia</span>
          </div>
        </div>
      </div>
    </div>
  )
}
