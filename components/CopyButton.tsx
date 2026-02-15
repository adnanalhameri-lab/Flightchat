// Copy Button Component - Copy message content with animated feedback

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface CopyButtonProps {
  content: string
  className?: string
}

export function CopyButton({ content, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Skopiowano do schowka!', {
        duration: 2000,
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
        },
        iconTheme: {
          primary: 'var(--color-success)',
          secondary: 'white',
        },
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Nie udało się skopiować', {
        duration: 2000,
      })
    }
  }

  return (
    <motion.button
      onClick={handleCopy}
      className={`group relative p-2 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={copied ? 'Skopiowano!' : 'Kopiuj'}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="w-4 h-4 text-success" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
