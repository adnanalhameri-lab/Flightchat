// Typing Indicator Component - Animated dots showing AI is thinking

'use client'

import { motion } from 'framer-motion'

export function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -6 }
  }

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const
  }

  return (
    <div className="flex items-center gap-1">
      <motion.div
        className="w-2 h-2 rounded-full bg-blue-400"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-blue-400"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.15 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-blue-400"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.3 }}
      />
    </div>
  )
}
