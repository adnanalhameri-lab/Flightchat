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
    <div className="relative flex flex-col items-center justify-center h-full min-h-screen px-8 text-center overflow-hidden">
      {/* Fullscreen Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400" />
      
      {/* Subtle animated orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* Content Container */}
      <motion.div 
        className="relative z-10 max-w-3xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Main Heading */}
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Cześć, jestem FlightChat, twoim AI asystentem podróży
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Powiedz mi dokąd chcesz polecieć, a znajdę dla Ciebie najlepsze opcje
        </motion.p>

        {/* Large Input Field */}
        <motion.form
          onSubmit={handleSubmit}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Znajdź mi loty z Warszawy na długi weekend..."
              className="w-full px-8 py-6 text-lg bg-white rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 text-gray-900 placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </motion.form>

        {/* Pill Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {pillButtons.map((text, idx) => (
            <motion.button
              key={idx}
              onClick={() => onExampleClick?.(text)}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all duration-200 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {text}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
