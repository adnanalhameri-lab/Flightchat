// Comparison View Component - Layout destination cards responsively

'use client'

import { DestinationOption } from '@/lib/types'
import { DestinationCard } from './DestinationCard'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ComparisonViewProps {
  destinations: DestinationOption[]
}

export function ComparisonView({ destinations }: ComparisonViewProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!destinations || destinations.length === 0) {
    return null
  }

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  }

  // Mobile: Sequential cards (vertical stack)
  if (isMobile) {
    return (
      <motion.div
        className="space-y-4 mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {destinations.map((dest, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <DestinationCard destination={dest} rank={idx + 1} />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  // Desktop: Grid layout
  const gridCols =
    destinations.length === 1
      ? 'grid-cols-1 max-w-3xl mx-auto'
      : destinations.length === 2
      ? 'grid-cols-2 max-w-5xl mx-auto'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <motion.div
      className={`grid ${gridCols} gap-6 mt-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {destinations.map((dest, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          <DestinationCard destination={dest} rank={idx + 1} />
        </motion.div>
      ))}
    </motion.div>
  )
}
