// Destination Card Component - Display complete destination info

'use client'

import { DestinationOption } from '@/lib/types'
import { Plane, MapPin, Cloud, ExternalLink, Calendar } from 'lucide-react'
import { TransportInfo } from './TransportInfo'
import { formatCurrency, getWeatherEmoji } from '@/lib/utils'

interface DestinationCardProps {
  destination: DestinationOption
  rank?: number
}

export function DestinationCard({ destination, rank }: DestinationCardProps) {
  const { flight, weather, attractions, transport, destinationName } = destination

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 bg-surface animate-slide-in-bottom">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {rank && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                {rank}
              </span>
            )}
            <h3 className="text-2xl font-bold text-text">
              {destinationName}
            </h3>
          </div>
          <p className="text-sm text-text-secondary">{flight.destination}</p>
        </div>
        
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(flight.price, flight.currency)}
          </p>
          <p className="text-xs text-text-secondary">za osobę</p>
        </div>
      </div>

      {/* Flight Info */}
      <div className="mb-4 p-4 bg-background/50 rounded-lg border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Plane className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-text">Lot</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <span className="text-text">
              {formatDate(flight.departureDate)}
              {flight.returnDate && ` - ${formatDate(flight.returnDate)}`}
            </span>
          </div>
          
          {flight.stops !== undefined && (
            <p className="text-text-secondary">
              {flight.stops === 0 ? (
                <span className="text-success font-medium">✓ Lot bezpośredni</span>
              ) : (
                `${flight.stops} przesiadka${flight.stops > 1 ? 'i' : ''}`
              )}
            </p>
          )}
          
          {flight.airline && (
            <p className="text-text-secondary">
              Linia lotnicza: {flight.airline}
            </p>
          )}
        </div>
      </div>

      {/* Weather */}
      {weather && (
        <div className="mb-4 p-4 bg-background/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="w-4 h-4 text-accent" />
            <span className="font-semibold text-sm text-text">Pogoda</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getWeatherEmoji(weather.icon)}</span>
            <div className="flex-1">
              <p className="text-lg font-semibold text-text">
                {weather.temperatureAvg}°C
              </p>
              <p className="text-sm text-text-secondary capitalize">
                {weather.description}
              </p>
              <p className="text-xs text-text-secondary">
                {weather.temperatureMin}°C - {weather.temperatureMax}°C
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attractions */}
      {attractions.length > 0 && (
        <div className="mb-4 p-4 bg-background/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="font-semibold text-sm text-text">Must-see</span>
          </div>
          
          <ul className="space-y-2 text-sm">
            {attractions.slice(0, 3).map((attr, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                <div className="flex-1">
                  <span className="text-text font-medium">{attr.name}</span>
                  {attr.description && (
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {attr.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Transport */}
      {transport && <TransportInfo transport={transport} />}

      {/* CTA Button */}
      <button className="w-full mt-6 py-3 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg">
        Zobacz szczegóły
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  )
}
