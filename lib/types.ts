// FlightChat TypeScript Types & Interfaces

// ============================================
// FLIGHT TYPES
// ============================================

export interface FlightOffer {
  id: string
  destination: string
  destinationName: string
  price: number
  currency: string
  departureDate: string
  returnDate?: string
  airline?: string
  duration?: string
  stops?: number
  departureTime?: string
  arrivalTime?: string
}

export interface FlightSearchParams {
  origin: string
  destination?: string
  departureDate: string
  returnDate?: string
  maxPrice?: number
  maxArrivalTime?: string
  minDuration?: number
  maxDuration?: number
  currency?: string
  directFlightsOnly?: boolean
  preferences?: string
  maxResults?: number
}

// ============================================
// WEATHER TYPES
// ============================================

export interface WeatherData {
  destination: string
  date: string
  temperatureAvg: number
  temperatureMin: number
  temperatureMax: number
  description: string
  icon: string
}

// ============================================
// ATTRACTION TYPES
// ============================================

export interface Attraction {
  name: string
  description?: string
  category: string
  coordinates: {
    lat: number
    lon: number
  }
  wikipediaUrl?: string
  image?: string
  rating?: number
}

// ============================================
// TRANSPORT TYPES
// ============================================

export interface TransportOption {
  type: string
  price: string
  duration: string
  frequency?: string
  recommendation?: string
}

export interface AirportTransport {
  airportCode: string
  airportName: string
  options: TransportOption[]
}

// ============================================
// DESTINATION COMPARISON
// ============================================

export interface DestinationOption {
  destination: string
  destinationName: string
  flight: FlightOffer
  attractions: Attraction[]
  weather: WeatherData | null
  transport: AirportTransport | null
  totalEstimatedCost: number
  claudeRecommendation?: string
}

// ============================================
// CHAT TYPES
// ============================================

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  destinations?: DestinationOption[]
  timestamp: Date
}

export interface Conversation {
  id: string
  userId: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// ============================================
// USER TYPES
// ============================================

export interface UserPreferences {
  defaultOrigin: string
  currency: string
  language: 'pl' | 'en'
  theme: 'light' | 'dark'
}

export interface User {
  id: string
  email: string
  subscriptionTier: string
  subscriptionStatus: 'active' | 'inactive' | 'cancelled'
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  preferences?: UserPreferences
  createdAt: Date
  updatedAt: Date
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiError {
  error: string
  message?: string
  code?: string
}

export interface DestinationsApiResponse {
  destinations: DestinationOption[]
  error?: string
}

// Non-streaming chat API response (Option B)
export interface ChatApiResponse {
  content: string
  destinations?: DestinationOption[]
}

// Legacy streaming event (kept for backward compatibility)
export interface ChatStreamEvent {
  type: 'text' | 'destinations' | 'error' | 'done'
  content?: string
  data?: DestinationOption[]
  error?: string
}
