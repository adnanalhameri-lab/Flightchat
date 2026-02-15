// Empty State Component - Show before first message

'use client'

import { Plane, MapPin, Calendar, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionVariants } from '@/lib/design-tokens'

interface EmptyStateProps {
  onExampleClick?: (example: string) => void
}

export function EmptyState({ onExampleClick }: EmptyStateProps) {
  const examples = [
    {
      icon: TrendingDown,
      title: 'Najtańsze loty z Warszawy',
      query: 'Znajdź najtańsze loty z Warszawy w maju',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      title: 'Barcelona za 500 PLN',
      query: 'Chcę polecieć do Barcelony za max 500 PLN',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: Calendar,
      title: 'Ciepłe miejsce w marcu',
      query: 'Pokaż loty na ciepłe miejsce w marcu, maks 7 dni',
      gradient: 'from-blue-400 to-orange-400'
    },
    {
      icon: Plane,
      title: 'Włochy w czerwcu',
      query: 'Szukam lotów z Polski do Włoch w czerwcu',
      gradient: 'from-blue-600 to-blue-700'
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-8 py-16 text-center relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 -z-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Animated Plane Icon */}
      <motion.div 
        className="mb-8 relative"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-0 bg-gradient-ocean rounded-full blur-2xl opacity-40" />
        <div className="relative bg-gradient-ocean p-8 rounded-full shadow-glow">
          <Plane className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1 
        className="text-5xl font-bold bg-gradient-ocean bg-clip-text text-transparent mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Zaplanujmy Twoją następną przygodę ✈️
      </motion.h1>

      {/* Description */}
      <motion.p 
        className="text-lg text-gray-600 mb-8 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Jestem Twoim AI asystentem podróży. Powiedz mi czego szukasz, a znajdę dla Ciebie najlepsze loty wraz z atrakcjami, pogodą i transportem.
      </motion.p>

      {/* Quick Stats */}
      <motion.div 
        className="flex items-center gap-6 mb-12 text-sm text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-ocean" />
          <span className="font-medium">500+ Airlines</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-text-secondary/30" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-sunset" />
          <span className="font-medium">10,000+ Destinations</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-text-secondary/30" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-hero" />
          <span className="font-medium">Powered by Claude AI</span>
        </div>
      </motion.div>

      {/* Example queries */}
      <div className="w-full max-w-3xl">
        <motion.p 
          className="text-sm text-gray-600 mb-6 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Spróbuj jednego z przykładów:
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((example, index) => {
            const Icon = example.icon
            return (
              <motion.button
                key={index}
                onClick={() => onExampleClick?.(example.query)}
                className="group relative p-6 text-left border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-blue-300 rounded-2xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-glow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${example.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${example.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {example.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {example.query}
                    </p>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Helpful tip */}
      <motion.div 
        className="mt-12 text-xs text-gray-600/80 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        💡 <strong>Wskazówka:</strong> Im bardziej szczegółowe zapytanie, tym lepsze wyniki. Podaj daty, budżet i preferencje!
      </motion.div>
    </div>
  )
}
