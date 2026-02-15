// Empty State Component - Fullscreen gradient with centered input

'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  onExampleClick?: (example: string) => void
}

export function EmptyState({ onExampleClick }: EmptyStateProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && onExampleClick) {
      onExampleClick(inputValue.trim())
      setInputValue('')
    }
  }

  const pillButtons = [
    'Najtańsze loty z Warszawy',
    'Weekendowy wypad',
    'Ciepłe kraje w maju',
    'Last minute',
  ]

  return (
    <div className="relative flex flex-col items-center justify-center h-full min-h-screen px-8 text-center">
      {/* Content Container */}
      <motion.div 
        className="max-w-3xl w-full space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Icon */}
        <motion.div 
          className="inline-flex p-4 bg-orange-100 rounded-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Send className="w-8 h-8 text-orange-500" />
        </motion.div>

        {/* Main Heading */}
        <div className="space-y-3">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Cześć, jestem FlightChat
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Twój AI asystent podróży. Powiedz mi dokąd chcesz polecieć, a znajdę dla Ciebie najlepsze opcje.
          </motion.p>
        </div>

        {/* Large Input Field */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Znajdź mi loty z Warszawy na długi weekend..."
              autoFocus
              className="w-full px-6 py-4 text-base bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.form>

        {/* Pill Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {pillButtons.map((text, idx) => (
            <button
              key={idx}
              onClick={() => onExampleClick?.(text)}
              className="border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
            >
              {text}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
