// Comparison View Component - Layout destination cards responsively

'use client'

import { DestinationOption } from '@/lib/types'
import { DestinationCard } from './DestinationCard'
import { useEffect, useState } from 'react'

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

  // Mobile: Sequential cards (vertical stack)
  if (isMobile) {
    return (
      <div className="space-y-4 mt-4">
        {destinations.map((dest, idx) => (
          <DestinationCard key={idx} destination={dest} rank={idx + 1} />
        ))}
      </div>
    )
  }

  // Desktop: Grid layout
  const gridCols =
    destinations.length === 1
      ? 'grid-cols-1 max-w-2xl'
      : destinations.length === 2
      ? 'grid-cols-2'
      : 'grid-cols-3'

  return (
    <div className={`grid ${gridCols} gap-4 mt-4`}>
      {destinations.map((dest, idx) => (
        <DestinationCard key={idx} destination={dest} rank={idx + 1} />
      ))}
    </div>
  )
}
