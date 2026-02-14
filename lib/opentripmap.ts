// OpenTripMap API Client for Attractions

import axios from 'axios'
import { Redis } from '@upstash/redis'
import { Attraction } from './types'
import { getCoordinates } from './utils'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const OTM_API_KEY = process.env.OPENTRIPMAP_API_KEY!
const OTM_BASE_URL = 'https://api.opentripmap.com/0.1/en/places'

// Cache TTL: 7 days (attractions don't change often)
const CACHE_TTL = 60 * 60 * 24 * 7

/**
 * Get top attractions for a destination
 */
export async function getAttractions(
  destination: string,
  limit: number = 5
): Promise<Attraction[]> {
  const cacheKey = `attractions:${destination}`

  // Check cache first
  try {
    const cached = await redis.get<Attraction[]>(cacheKey)
    if (cached && Array.isArray(cached)) {
      console.log('✅ Cache HIT for attractions:', destination)
      return cached.slice(0, limit)
    }
  } catch (error) {
    console.warn('⚠️ Attractions cache read error:', error)
  }

  console.log('🔍 Cache MISS - calling OpenTripMap API:', destination)

  try {
    // Get coordinates from IATA code
    const coords = getCoordinates(destination)
    
    if (coords.lat === 0 && coords.lon === 0) {
      console.warn('⚠️ No coordinates found for:', destination)
      return []
    }

    // Search attractions in 5km radius
    const response = await axios.get(`${OTM_BASE_URL}/radius`, {
      params: {
        apikey: OTM_API_KEY,
        radius: 5000, // 5km
        lon: coords.lon,
        lat: coords.lat,
        rate: 2, // Rating 2-3 (good to excellent)
        kinds: 'interesting_places,museums,architecture,historic,monuments,natural',
        limit: 20,
      },
    })

    if (!response.data || response.data.length === 0) {
      console.warn('⚠️ No attractions found for:', destination)
      return []
    }

    // Get details for top attractions
    const attractions: Attraction[] = await Promise.all(
      response.data.slice(0, limit).map(async (place: any) => {
        try {
          const details = await axios.get(`${OTM_BASE_URL}/xid/${place.xid}`, {
            params: { apikey: OTM_API_KEY },
          })

          return {
            name: details.data.name || place.name || 'Unknown',
            description: details.data.wikipedia_extracts?.text || details.data.info?.descr,
            category: place.kinds?.split(',')[0] || 'attraction',
            coordinates: {
              lat: place.point.lat,
              lon: place.point.lon,
            },
            wikipediaUrl: details.data.wikipedia,
            image: details.data.preview?.source,
            rating: place.rate,
          }
        } catch (error) {
          console.warn('⚠️ Failed to get attraction details:', place.name, error)
          
          // Return basic info if details fail
          return {
            name: place.name || 'Unknown',
            category: place.kinds?.split(',')[0] || 'attraction',
            coordinates: {
              lat: place.point.lat,
              lon: place.point.lon,
            },
            rating: place.rate,
          }
        }
      })
    )

    // Filter out attractions without names
    const validAttractions = attractions.filter((a) => a.name && a.name !== 'Unknown')

    // Cache results
    try {
      await redis.setex(cacheKey, CACHE_TTL, validAttractions)
      console.log('💾 Cached attractions for 7 days')
    } catch (error) {
      console.warn('⚠️ Attractions cache write error:', error)
    }

    return validAttractions.slice(0, limit)
  } catch (error: any) {
    console.error('❌ OpenTripMap API error:', error.message)
    
    // Return empty array for graceful degradation
    return []
  }
}
