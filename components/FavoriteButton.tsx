// Favorite Button Component - Heart animation for saving flights

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

interface FavoriteButtonProps {
  destinationId?: string
  destinationName: string
  initialFavorited?: boolean
  onToggle?: (favorited: boolean) => void
}

export function FavoriteButton({
  destinationId,
  destinationName,
  initialFavorited = false,
  onToggle,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)

  const handleToggle = () => {
    const newState = !isFavorited
    setIsFavorited(newState)
    
    if (newState) {
      // Celebration confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#F97316', '#10B981']
      })
      
      toast.success(`${destinationName} dodane do ulubionych!`, {
        duration: 2000,
        icon: '❤️',
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
        },
      })
      
      // Save to localStorage
      const favorites = JSON.parse(localStorage.getItem('flightchat_favorites') || '[]')
      favorites.push({
        id: destinationId || Date.now().toString(),
        name: destinationName,
        savedAt: new Date().toISOString()
      })
      localStorage.setItem('flightchat_favorites', JSON.stringify(favorites))
    } else {
      toast('Usunięto z ulubionych', {
        duration: 2000,
        icon: '💔',
      })
      
      // Remove from localStorage
      const favorites = JSON.parse(localStorage.getItem('flightchat_favorites') || '[]')
      const updated = favorites.filter((f: any) => f.id !== destinationId)
      localStorage.setItem('flightchat_favorites', JSON.stringify(updated))
    }
    
    onToggle?.(newState)
  }

  return (
    <motion.button
      onClick={handleToggle}
      className={`group relative p-3 rounded-xl transition-all ${isFavorited ? 'bg-error/10 hover:bg-error/20' : 'bg-white/50 hover:bg-white/80'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      title={isFavorited ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
    >
      <motion.div
        animate={{
          scale: isFavorited ? [1, 1.3, 1] : 1,
          rotate: isFavorited ? [0, -10, 10, -10, 0] : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isFavorited 
              ? 'fill-error stroke-error' 
              : 'stroke-text-secondary group-hover:stroke-error'
          }`}
        />
      </motion.div>
      
      {/* Pulse effect on favorite */}
      {isFavorited && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-error/20"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  )
}
