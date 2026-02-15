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
    <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
      <div className="flex items-center gap-2 mb-3">
        <Bus className="w-4 h-4 text-orange-400" />
        <span className="font-medium text-sm text-white">Transport z lotniska</span>
      </div>

      <div className="space-y-2">
        {transport.options.slice(0, 3).map((option, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm p-2 bg-white/10 backdrop-blur-sm rounded border border-white/20"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white">{option.type}</span>
                {option.recommendation && (
                  <span className="inline-flex items-center gap-1 text-xs text-success">
                    <Star className="w-3 h-3 fill-current" />
                    Polecane
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-white/70">
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
                <p className="text-xs text-white/70 mt-1 italic">
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
