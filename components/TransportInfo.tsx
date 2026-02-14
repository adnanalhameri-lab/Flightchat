// Transport Info Component - Display airport transport options

'use client'

import { Bus, Clock, DollarSign, Star } from 'lucide-react'
import { AirportTransport } from '@/lib/types'

interface TransportInfoProps {
  transport: AirportTransport
}

export function TransportInfo({ transport }: TransportInfoProps) {
  if (!transport || transport.options.length === 0) {
    return null
  }

  return (
    <div className="mt-3 p-3 bg-background/50 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Bus className="w-4 h-4 text-accent" />
        <span className="font-medium text-sm text-text">Transport z lotniska</span>
      </div>

      <div className="space-y-2">
        {transport.options.slice(0, 3).map((option, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm p-2 bg-surface rounded border border-border/50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-text">{option.type}</span>
                {option.recommendation && (
                  <span className="inline-flex items-center gap-1 text-xs text-success">
                    <Star className="w-3 h-3 fill-current" />
                    Polecane
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {option.price}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {option.duration}
                </span>
                {option.frequency && <span>• {option.frequency}</span>}
              </div>

              {option.recommendation && (
                <p className="text-xs text-text-secondary mt-1 italic">
                  {option.recommendation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
