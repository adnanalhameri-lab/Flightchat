// TripPlanCard Component - Typ B: Trip plan with itinerary

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'

interface TripPlanCardProps {
  destination: string
  days: number
  attractions: string[]
  imageQuery?: string
}

export function TripPlanCard({ 
  destination, 
  days, 
  attractions,
  imageQuery = 'travel' 
}: TripPlanCardProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  // Use destination name for Unsplash image
  const imageUrl = `https://source.unsplash.com/800x400/?${imageQuery},${destination.toLowerCase()}`

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Hero Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-400 to-pink-400">
        <img
          src={imageUrl}
          alt={destination}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to gradient if image fails to load
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold drop-shadow-lg">{destination}</h3>
          <p className="text-sm opacity-90">{days}-dniowy plan podróży</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Trip Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{days} dni</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{attractions.length} atrakcji</span>
          </div>
        </div>

        {/* Attractions Checklist */}
        <div className="space-y-2 mb-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Do zobaczenia:</h4>
          {attractions.slice(0, 5).map((attraction, index) => (
            <label
              key={index}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checkedItems.has(index)}
                onChange={() => toggleCheck(index)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
              />
              <span className={`text-sm transition-all ${
                checkedItems.has(index) 
                  ? 'text-gray-400 line-through' 
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {attraction}
              </span>
            </label>
          ))}
          {attractions.length > 5 && (
            <p className="text-xs text-gray-500 pl-7">
              +{attractions.length - 5} więcej...
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
          Szczegóły planu
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
