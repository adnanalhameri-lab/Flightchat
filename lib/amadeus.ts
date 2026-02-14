// Amadeus Flight API Client

import Amadeus from 'amadeus'
import { Redis } from '@upstash/redis'
import { FlightSearchParams, FlightOffer } from './types'
import { getCityName } from './utils'

// Initialize Redis client for caching (lazy - handles missing env vars)
let _redis: Redis | null = null
function getRedis(): Redis | null {
  if (!_redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return _redis
}

// Initialize Amadeus client (lazy)
let _amadeus: Amadeus | null = null
function getAmadeus(): Amadeus | null {
  if (!_amadeus && process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
    _amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
      hostname: process.env.AMADEUS_ENVIRONMENT === 'test' ? 'test' : 'production',
    })
  }
  return _amadeus
}

// Cache TTL: 30 minutes (flight prices change frequently)
const CACHE_TTL = 60 * 30

/**
 * Search for flights based on parameters
 */
export async function searchFlights(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  // Generate cache key
  const cacheKey = `flights:${JSON.stringify(params)}`

  // Check cache first
  const redis = getRedis()
  try {
    if (redis) {
      const cached = await redis.get<FlightOffer[]>(cacheKey)
      if (cached && Array.isArray(cached)) {
        console.log('✅ Cache HIT for flights:', params.origin, '->', params.destination || 'anywhere')
        return cached
      }
    }
  } catch (error) {
    console.warn('⚠️ Cache read error:', error)
  }

  console.log('🔍 Cache MISS - calling Amadeus API:', params.origin, '->', params.destination || 'anywhere')

  try {
    let offers: FlightOffer[] = []

    // Check if searching for specific destination or "anywhere"
    if (params.destination && params.destination !== 'anywhere') {
      // Specific destination - use Flight Offers Search
      offers = await searchSpecificDestination(params)
    } else {
      // "Anywhere" - use Flight Inspiration Search
      offers = await searchInspirationFlights(params)
    }

    // Apply filters
    offers = applyFilters(offers, params)

    // Limit results
    const maxResults = params.maxResults || 10
    offers = offers.slice(0, maxResults)

    // Cache results
    try {
      if (redis) {
        await redis.setex(cacheKey, CACHE_TTL, offers)
        console.log('💾 Cached flight results for 30 minutes')
      }
    } catch (error) {
      console.warn('⚠️ Cache write error:', error)
    }

    return offers
  } catch (error: any) {
    console.error('❌ Amadeus API error:', error)
    
    // Return empty array instead of throwing
    // This allows the app to continue gracefully
    return []
  }
}

/**
 * Generate mock flight data for testing (when Amadeus API is not configured)
 */
function generateMockFlights(params: FlightSearchParams): FlightOffer[] {
  console.log('🧪 Generating mock flight data for testing')
  
  const destinations = params.destination 
    ? [{ code: params.destination, name: getCityName(params.destination) }]
    : [
        { code: 'BCN', name: 'Barcelona' },
        { code: 'LIS', name: 'Lisbon' },
        { code: 'ROM', name: 'Rome' },
        { code: 'PAR', name: 'Paris' },
        { code: 'LON', name: 'London' },
      ]
  
  return destinations.map((dest, index) => ({
    id: `mock-${dest.code}-${index}`,
    destination: dest.code,
    destinationName: dest.name,
    price: 300 + (index * 50),
    currency: 'PLN',
    departureDate: params.departureDate,
    returnDate: params.returnDate || undefined,
    airline: 'LOT Polish Airlines',
    duration: '2h 30m',
    stops: 0,
    departureTime: '10:00',
    arrivalTime: '12:30',
  }))
}

/**
 * Search for flights to a specific destination
 */
async function searchSpecificDestination(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  const amadeus = getAmadeus()
  if (!amadeus) {
    console.warn('⚠️ Amadeus client not initialized - using mock data')
    return generateMockFlights(params)
  }
  
  const response = await amadeus.shopping.flightOffersSearch.get({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination!,
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    adults: 1,
    currencyCode: params.currency || 'PLN',
    max: 20,
    nonStop: params.directFlightsOnly || false,
  })

  return formatFlightOffers(response.data)
}

/**
 * Search for inspirational flight destinations
 */
async function searchInspirationFlights(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  const amadeus = getAmadeus()
  if (!amadeus) {
    console.warn('⚠️ Amadeus client not initialized - using mock data')
    return generateMockFlights(params)
  }
  
  const response = await amadeus.shopping.flightDestinations.get({
    origin: params.origin,
    departureDate: params.departureDate,
    duration: params.maxDuration,
    maxPrice: params.maxPrice,
  })

  return formatInspirationalFlights(response.data, params.departureDate)
}

/**
 * Format Flight Offers Search response
 */
function formatFlightOffers(data: any[]): FlightOffer[] {
  if (!data || data.length === 0) return []

  return data.map((offer) => {
    const outbound = offer.itineraries[0]
    const returnFlight = offer.itineraries[1]
    
    const firstSegment = outbound.segments[0]
    const lastSegment = outbound.segments[outbound.segments.length - 1]

    return {
      id: offer.id,
      destination: firstSegment.arrival.iataCode,
      destinationName: getCityName(firstSegment.arrival.iataCode),
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      departureDate: firstSegment.departure.at,
      returnDate: returnFlight?.segments[0]?.departure.at,
      airline: offer.validatingAirlineCodes?.[0],
      stops: outbound.segments.length - 1,
      departureTime: firstSegment.departure.at,
      arrivalTime: lastSegment.arrival.at,
      duration: outbound.duration,
    }
  })
}

/**
 * Format Flight Inspiration Search response
 */
function formatInspirationalFlights(data: any[], departureDate: string): FlightOffer[] {
  if (!data || data.length === 0) return []

  return data.map((dest, index) => ({
    id: `inspiration-${index}`,
    destination: dest.destination,
    destinationName: getCityName(dest.destination),
    price: parseFloat(dest.price?.total || '0'),
    currency: 'PLN',
    departureDate: departureDate,
    returnDate: dest.returnDate,
  }))
}

/**
 * Apply filters to flight results
 */
function applyFilters(offers: FlightOffer[], params: FlightSearchParams): FlightOffer[] {
  let filtered = [...offers]

  // Filter by max price
  if (params.maxPrice) {
    filtered = filtered.filter((offer) => offer.price <= params.maxPrice!)
  }

  // Filter by max arrival time
  if (params.maxArrivalTime && offers[0]?.arrivalTime) {
    const [maxHour, maxMinute] = params.maxArrivalTime.split(':').map(Number)
    
    filtered = filtered.filter((offer) => {
      if (!offer.arrivalTime) return true
      
      const arrivalDate = new Date(offer.arrivalTime)
      const arrivalHour = arrivalDate.getHours()
      const arrivalMinute = arrivalDate.getMinutes()
      
      return (
        arrivalHour < maxHour ||
        (arrivalHour === maxHour && arrivalMinute <= maxMinute)
      )
    })
  }

  // Filter by direct flights only
  if (params.directFlightsOnly) {
    filtered = filtered.filter((offer) => offer.stops === 0)
  }

  // Sort by price (cheapest first)
  filtered.sort((a, b) => a.price - b.price)

  return filtered
}
