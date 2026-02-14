// OpenWeather API Client for Weather Forecasts

import axios from 'axios'
import { Redis } from '@upstash/redis'
import { WeatherData } from './types'
import { getCoordinates } from './utils'
import { format, parseISO } from 'date-fns'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const OW_API_KEY = process.env.OPENWEATHER_API_KEY!
const OW_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Cache TTL: 12 hours (weather forecasts are updated frequently)
const CACHE_TTL = 60 * 60 * 12

/**
 * Get weather forecast for a destination and date
 */
export async function getWeatherForecast(
  destination: string,
  date: string
): Promise<WeatherData | null> {
  const cacheKey = `weather:${destination}:${date}`

  // Check cache first
  try {
    const cached = await redis.get<WeatherData>(cacheKey)
    if (cached) {
      console.log('✅ Cache HIT for weather:', destination, date)
      return cached
    }
  } catch (error) {
    console.warn('⚠️ Weather cache read error:', error)
  }

  console.log('🔍 Cache MISS - calling OpenWeather API:', destination, date)

  try {
    const coords = getCoordinates(destination)
    
    if (coords.lat === 0 && coords.lon === 0) {
      console.warn('⚠️ No coordinates found for:', destination)
      return null
    }

    // Use 16-day forecast (FREE tier)
    const response = await axios.get(`${OW_BASE_URL}/forecast/daily`, {
      params: {
        lat: coords.lat,
        lon: coords.lon,
        cnt: 16, // 16 days
        units: 'metric',
        appid: OW_API_KEY,
      },
    })

    if (!response.data || !response.data.list) {
      console.warn('⚠️ No weather data received for:', destination)
      return null
    }

    // Find weather for specific date
    const targetDate = parseISO(date)
    const forecast = response.data.list.find((day: any) => {
      const forecastDate = new Date(day.dt * 1000)
      return format(forecastDate, 'yyyy-MM-dd') === date
    })

    if (!forecast) {
      console.warn('⚠️ No weather data for date:', date)
      return null
    }

    const weatherData: WeatherData = {
      destination,
      date,
      temperatureAvg: Math.round(forecast.temp.day),
      temperatureMin: Math.round(forecast.temp.min),
      temperatureMax: Math.round(forecast.temp.max),
      description: translateWeatherDescription(forecast.weather[0].description),
      icon: forecast.weather[0].icon,
    }

    // Cache results
    try {
      await redis.setex(cacheKey, CACHE_TTL, weatherData)
      console.log('💾 Cached weather forecast for 12 hours')
    } catch (error) {
      console.warn('⚠️ Weather cache write error:', error)
    }

    return weatherData
  } catch (error: any) {
    console.error('❌ OpenWeather API error:', error.message)
    
    // Return null for graceful degradation
    return null
  }
}

/**
 * Translate weather descriptions from English to Polish
 */
function translateWeatherDescription(desc: string): string {
  const translations: Record<string, string> = {
    'clear sky': 'bezchmurnie',
    'few clouds': 'lekkie zachmurzenie',
    'scattered clouds': 'częściowe zachmurzenie',
    'broken clouds': 'pochmurno',
    'overcast clouds': 'całkowite zachmurzenie',
    'shower rain': 'przelotny deszcz',
    'light rain': 'lekki deszcz',
    'moderate rain': 'umiarkowany deszcz',
    'heavy intensity rain': 'intensywny deszcz',
    'very heavy rain': 'bardzo intensywny deszcz',
    'extreme rain': 'ekstremalny deszcz',
    'freezing rain': 'marznący deszcz',
    'light intensity shower rain': 'lekkie opady',
    'heavy intensity shower rain': 'intensywne opady',
    'ragged shower rain': 'nieregularne opady',
    'thunderstorm': 'burza',
    'thunderstorm with light rain': 'burza z lekkim deszczem',
    'thunderstorm with rain': 'burza z deszczem',
    'thunderstorm with heavy rain': 'burza z intensywnym deszczem',
    'light thunderstorm': 'lekka burza',
    'heavy thunderstorm': 'silna burza',
    'ragged thunderstorm': 'gwałtowna burza',
    'snow': 'śnieg',
    'light snow': 'lekki śnieg',
    'heavy snow': 'intensywne opady śniegu',
    'sleet': 'deszcz ze śniegiem',
    'light shower sleet': 'lekkie opady deszczu ze śniegiem',
    'shower sleet': 'deszcz ze śniegiem',
    'light rain and snow': 'lekki deszcz ze śniegiem',
    'rain and snow': 'deszcz ze śniegiem',
    'light shower snow': 'lekkie opady śniegu',
    'shower snow': 'opady śniegu',
    'heavy shower snow': 'intensywne opady śniegu',
    'mist': 'mgła',
    'smoke': 'dym',
    'haze': 'zamglenie',
    'sand/dust whirls': 'pył',
    'fog': 'gęsta mgła',
    'sand': 'burza piaskowa',
    'dust': 'pył',
    'volcanic ash': 'popiół wulkaniczny',
    'squalls': 'szkwały',
    'tornado': 'tornado',
  }

  const normalized = desc.toLowerCase().trim()
  return translations[normalized] || desc
}
