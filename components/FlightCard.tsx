// FlightCard Component - Typ A: Minimalist flight card (Layla-inspired)

'use client'

import { DestinationOption } from '@/lib/types'
import { Plane, Clock, Calendar, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface FlightCardProps {
  destination: DestinationOption
  isLowestPrice?: boolean
}

export function FlightCard({ destination, isLowestPrice }: FlightCardProps) {
  const { flight, destinationName } = destination

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
    })
  }

  const getDuration = () => {
    // Mock duration calculation
    return '2h 30min'
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all duration-200 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Header - City & Airport */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-2xl font-bold text-gray-900">{destinationName}</h3>
          {isLowestPrice && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Najtańszy
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{flight.destination}</p>
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-orange-500">
            {formatCurrency(flight.price, flight.currency)}
          </span>
          <span className="text-sm text-gray-500">za osobę</span>
        </div>
      </div>

      {/* Flight Details */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        {/* Airline */}
        {flight.airline && (
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-gray-400" />
            <span>{flight.airline}</span>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            {formatDate(flight.departureDate)}
            {flight.returnDate && ` - ${formatDate(flight.returnDate)}`}
          </span>
        </div>

        {/* Duration & Stops */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{getDuration()}</span>
          {flight.stops !== undefined && (
            <>
              <span className="text-gray-400">•</span>
              <span className={flight.stops === 0 ? 'text-green-600 font-medium' : ''}>
                {flight.stops === 0 ? 'Bezpośredni' : `${flight.stops} przesiadka${flight.stops > 1 ? 'i' : ''}`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200">
        Zobacz lot
        <ExternalLink className="inline-block w-4 h-4 ml-2" />
      </button>
    </motion.div>
  )
}
