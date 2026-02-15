// Destination Card Component - Redesigned with glassmorphism and rich interactions

'use client'

import { DestinationOption } from '@/lib/types'
import { Plane, MapPin, Cloud, ExternalLink, Calendar, Heart, Share2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { TransportInfo } from './TransportInfo'
import { formatCurrency, getWeatherEmoji } from '@/lib/utils'
import { getCityImage } from '@/lib/placeholder-images'
import { generatePriceHistory, getPriceTrend } from '@/lib/mock-price-data'
import { DestinationTabs } from './DestinationTabs'
import { PriceChart } from './PriceChart'
import { FavoriteButton } from './FavoriteButton'
import { motion } from 'framer-motion'
import { motionVariants } from '@/lib/design-tokens'
import { useState } from 'react'

interface DestinationCardProps {
  destination: DestinationOption
  rank?: number
}

export function DestinationCard({ destination, rank }: DestinationCardProps) {
  const { flight, weather, attractions, transport, destinationName } = destination
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
    })
  }

  // Generate price data for charts
  const priceHistory = generatePriceHistory(flight.price)
  const priceTrend = getPriceTrend(priceHistory)

  // Get city background image
  const cityImage = getCityImage(destinationName)

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${destinationName} - FlightChat`,
          text: `Sprawdź tę ofertę: ${destinationName} za ${formatCurrency(flight.price, flight.currency)}!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Render trend icon
  const TrendIcon = priceTrend.trend === 'up' ? TrendingUp : priceTrend.trend === 'down' ? TrendingDown : Minus

  return (
    <motion.div
      className="destination-card group relative overflow-hidden rounded-2xl"
      style={{ height: '560px' }}
      initial="hidden"
      animate="visible"
      variants={motionVariants.card}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="card-background absolute inset-0 z-0">
        <img
          src={cityImage}
          alt={destinationName}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Dark gradient overlay - stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/40 to-blue-950/90" />
        {/* Additional side gradients for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-transparent to-blue-950/30" />
      </div>

      {/* Glassmorphism Content Container */}
      <div className="glass-strong absolute inset-0 z-10 flex flex-col p-6">
        {/* Header Section */}
        <header className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {rank && (
                <motion.span
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-ocean text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {rank}
                </motion.span>
              )}
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                {destinationName}
              </h3>
            </div>
            <p className="text-sm text-white/80 drop-shadow">{flight.destination}</p>
          </div>

          {/* Floating Price Badge */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl px-4 py-3 shadow-lg text-right backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-bold text-white">
                {formatCurrency(flight.price, flight.currency)}
              </p>
              <p className="text-xs text-white/90">za osobę</p>
              {/* Trend indicator */}
              <div className="flex items-center justify-end gap-1 mt-1">
                <TrendIcon className="w-3 h-3 text-white/90" />
                <span className="text-xs text-white/90">
                  {priceTrend.trend === 'up' ? 'rosnące' : priceTrend.trend === 'down' ? 'spadające' : 'stabilne'}
                </span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Tabs Section - Main Content */}
        <div className="flex-1 overflow-hidden">
          <DestinationTabs
            tabs={[
              {
                value: 'overview',
                label: 'Przegląd',
                content: (
                  <div className="space-y-3 text-white">
                    {/* Flight Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span>
                          {formatDate(flight.departureDate)}
                          {flight.returnDate && ` - ${formatDate(flight.returnDate)}`}
                        </span>
                      </div>

                      {flight.stops !== undefined && (
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-blue-400" />
                          <span>
                            {flight.stops === 0 ? (
                              <span className="text-green-400 font-medium">✓ Lot bezpośredni</span>
                            ) : (
                              `${flight.stops} przesiadka${flight.stops > 1 ? 'i' : ''}`
                            )}
                          </span>
                        </div>
                      )}

                      {flight.airline && (
                        <p className="text-white/80 text-sm">
                          Linia: {flight.airline}
                        </p>
                      )}
                    </div>

                    {/* Transport Info */}
                    {transport && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <TransportInfo transport={transport} />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                value: 'weather',
                label: 'Pogoda',
                content: weather ? (
                  <div className="flex items-center gap-4 text-white">
                    <span className="text-5xl drop-shadow-lg">{getWeatherEmoji(weather.icon)}</span>
                    <div className="flex-1">
                      <p className="text-3xl font-bold text-white drop-shadow">
                        {weather.temperatureAvg}°C
                      </p>
                      <p className="text-sm text-white/90 capitalize mt-1">
                        {weather.description}
                      </p>
                      <p className="text-xs text-white/70 mt-2">
                        Min {weather.temperatureMin}°C • Max {weather.temperatureMax}°C
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">Brak danych o pogodzie</p>
                ),
              },
              {
                value: 'attractions',
                label: 'Atrakcje',
                content: attractions.length > 0 ? (
                  <ul className="space-y-3 text-white">
                    {attractions.slice(0, 3).map((attr, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <MapPin className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="font-medium text-white drop-shadow">{attr.name}</span>
                          {attr.description && (
                            <p className="text-xs text-white/70 mt-1 line-clamp-2">
                              {attr.description}
                            </p>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/60 text-sm">Brak informacji o atrakcjach</p>
                ),
              },
              {
                value: 'trends',
                label: 'Trendy',
                content: (
                  <div className="space-y-3">
                    <PriceChart
                      data={priceHistory}
                      currentPrice={flight.price}
                      currency={flight.currency}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Footer - Action Buttons */}
        <footer className="flex items-center gap-2 pt-4 mt-4 border-t border-white/20">
          {/* Favorite Button */}
          <FavoriteButton
            destinationName={destinationName}
          />

          {/* Share Button */}
          <motion.button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-4 h-4" />
            Udostępnij
          </motion.button>

          {/* View Details Button */}
          <motion.button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 hover:shadow-lg text-white font-semibold transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Zobacz szczegóły
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </footer>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0">
        <div className="absolute inset-0 shadow-glow rounded-2xl" />
      </div>
    </motion.div>
  )
}
