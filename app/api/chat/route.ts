// API Route: Chat with Claude (Non-Streaming)
// POST /api/chat - Returns JSON with content and destinations

import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'
import { searchFlights } from '@/lib/amadeus'
import { getAttractions } from '@/lib/opentripmap'
import { getWeatherForecast } from '@/lib/openweather'
import { getAirportTransport } from '@/lib/transport'
import { MODEL } from '@/lib/claude'
import { DestinationOption, ChatApiResponse } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Prompt for extracting search parameters from user message
const PARAM_EXTRACTION_PROMPT = `Extract flight search parameters from user's message and return ONLY valid JSON.

CRITICAL: User wants to search for REAL FLIGHTS. If they mention flights, destinations, travel, trips - set needsSearch to TRUE.

Return ONLY this JSON structure (no markdown, no explanation):
{
  "origin": "WAW|KRK|GDN|etc (Warsaw=WAW, Kraków=KRK, Gdańsk=GDN)",
  "destination": "BCN|LIS|ROM|PAR|LON|AMS|etc or null",
  "departureDate": "YYYY-MM-DD or null",
  "returnDate": "YYYY-MM-DD or null",
  "maxPrice": number or null,
  "maxDuration": number or null,
  "preferences": "string or null",
  "needsSearch": true
}

Examples:
Input: "Loty z Warszawy do Paryża w maju"
Output: {"origin":"WAW","destination":"PAR","departureDate":"2025-05-01","returnDate":null,"maxPrice":null,"maxDuration":null,"preferences":null,"needsSearch":true}

Input: "Znajdź loty z Krakowa"
Output: {"origin":"KRK","destination":null,"departureDate":null,"returnDate":null,"maxPrice":null,"maxDuration":null,"preferences":null,"needsSearch":true}

Input: "Pokaż mi loty do Barcelony w czerwcu"
Output: {"origin":"WAW","destination":"BCN","departureDate":"2025-06-01","returnDate":null,"maxPrice":null,"maxDuration":null,"preferences":null,"needsSearch":true}

Input: "Co słychać?"
Output: {"origin":null,"destination":null,"departureDate":null,"returnDate":null,"maxPrice":null,"maxDuration":null,"preferences":null,"needsSearch":false}

Rules:
- If user mentions flights/travel/trips → needsSearch=true
- For Polish cities: Warszawa=WAW, Kraków=KRK, Gdańsk=GDN, Poznań=POZ, Wrocław=WRO
- For dates like "w maju", "w czerwcu" use "2025-05-01", "2025-06-01"
- If origin not specified but user is Polish, assume WAW
- Return ONLY the JSON, nothing else`

// Prompt for formatting destinations data
const FORMATTING_PROMPT = `You are FlightChat - an enthusiastic, warm travel AI assistant.

The user asked about travel options. Below are the search results with flights, attractions, weather, and transport for each destination.

Create a friendly, helpful response in Polish that:
1. Presents 3-5 best options with clear comparison
2. For each destination shows:
   - Flight: price, dates, duration, stops
   - Weather: temperature with emoji
   - Top 3 attractions (must-see)
   - Transport from airport to city center
3. Adds personal insight/recommendation for each
4. Clearly marks "best choice" with justification
5. Uses emojis and markdown formatting
6. Is concise but informative

Format with headers, bullet points, and clear structure.`

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()

    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', { status: 400 })
    }

    console.log('💬 Chat request from user:', userId)
    console.log('📨 Messages count:', messages.length)

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1]
    const userContent = typeof lastUserMessage.content === 'string' 
      ? lastUserMessage.content 
      : lastUserMessage.content[0]?.text || ''

    // Step 1: Extract search parameters using Claude
    console.log('🔍 Step 1: Extracting search parameters...')
    
    const extractionResponse = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: PARAM_EXTRACTION_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const extractionText = extractionResponse.content.find(b => b.type === 'text')?.text || '{}'
    
    console.log('🔍 Raw extraction response:', extractionText)
    
    let searchParams: {
      origin?: string | null
      destination?: string | null
      departureDate?: string | null
      returnDate?: string | null
      maxPrice?: number | null
      maxDuration?: number | null
      preferences?: string | null
      needsSearch?: boolean
    }
    
    try {
      // Clean up response - remove markdown code blocks if present
      const cleanedText = extractionText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      searchParams = JSON.parse(cleanedText)
      console.log('📋 Extracted params:', searchParams)
    } catch (parseError) {
      console.error('❌ Failed to parse extraction response:', extractionText)
      console.error('Parse error:', parseError)
      searchParams = { needsSearch: false }
    }

    // If user is just chatting (not searching), use Claude for general conversation
    if (!searchParams.needsSearch) {
      console.log('💬 General conversation mode (no flight search)')
      
      const conversationResponse = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 2048,
        system: `Jesteś FlightChat - entuzjastycznym asystentem podróży AI. Pomagasz użytkownikom ZNAJDOWAĆ KONKRETNE LOTY.

Jeśli użytkownik pyta o loty/podróże/destynacje - powiedz mu żeby był konkretny:
"Powiedz mi skąd chcesz lecieć, dokąd i kiedy - znajdę dla Ciebie najlepsze loty!"

Przykład: "Chcę polecieć z Warszawy do Paryża w maju"`,
        messages: messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      })

      const responseText = conversationResponse.content.find(b => b.type === 'text')?.text 
        || 'Przepraszam, nie zrozumiałem. Powiedz mi skąd chcesz lecieć, dokąd i kiedy - znajdę najlepsze loty!'

      const response: ChatApiResponse = {
        content: responseText,
        destinations: undefined,
      }

      return Response.json(response)
    }
    
    console.log('✈️ Flight search mode activated!')

    // Step 2: Set defaults and validate
    // Default origin to WAW if not specified (Polish users)
    if (!searchParams.origin) {
      searchParams.origin = 'WAW'
      console.log('ℹ️ No origin specified, defaulting to WAW (Warsaw)')
    }
    
    // Default departure date to next week if not specified
    if (!searchParams.departureDate) {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      searchParams.departureDate = nextWeek.toISOString().split('T')[0]
      console.log('ℹ️ No date specified, defaulting to next week:', searchParams.departureDate)
    }
    
    // Validate required params
    if (!searchParams.origin || !searchParams.departureDate) {
      console.log('⚠️ Missing required params after defaults')
      const response: ChatApiResponse = {
        content: 'Powiedz mi proszę:\n\n• **Skąd** chcesz lecieć? (np. Warszawa, Kraków)\n• **Kiedy** planujesz wyjazd? (np. w maju, 15 czerwca)\n• **Dokąd** chcesz polecieć? (opcjonalnie)\n\nPrzykład: "Znajdź loty z Warszawy do Barcelony w czerwcu"',
        destinations: undefined,
      }
      return Response.json(response)
    }

    // Step 3: Call Amadeus for flights
    console.log('✈️ Step 2: Searching flights...')
    
    let flights: { destination: string; destinationName: string; price: number; departureDate: string; returnDate?: string }[] = []
    let destinations: DestinationOption[] = []
    let errorMessage: string | null = null

    try {
      flights = await searchFlights({
        origin: searchParams.origin,
        destination: searchParams.destination || undefined,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate || undefined,
        maxPrice: searchParams.maxPrice || undefined,
        maxDuration: searchParams.maxDuration || undefined,
        preferences: searchParams.preferences || undefined,
        maxResults: 5,
      })

      console.log(`✅ Found ${flights.length} flights`)

      if (flights.length === 0) {
        const response: ChatApiResponse = {
          content: `Niestety nie znalazłem lotów dla podanych kryteriów:\n\n• Wylot: ${searchParams.origin}\n• Data: ${searchParams.departureDate}${searchParams.destination ? '\n• Cel: ' + searchParams.destination : ''}\n\nSpróbuj zmienić datę, cel podróży lub zwiększyć budżet. Mogę też zasugerować alternatywne terminy lub destynacje!`,
          destinations: undefined,
        }
        return Response.json(response)
      }

      // Step 4: Enrich with attractions, weather, and transport
      console.log('🎯 Step 3: Enriching destinations data...')
      
      destinations = await Promise.all(
        flights.slice(0, 5).map(async (flight) => {
          try {
            const [attractions, weather] = await Promise.all([
              getAttractions(flight.destination, 5).catch(() => []),
              getWeatherForecast(flight.destination, flight.departureDate).catch(() => null),
            ])
            const transport = getAirportTransport(flight.destination)

            return {
              destination: flight.destination,
              destinationName: flight.destinationName,
              flight,
              attractions,
              weather,
              transport,
              totalEstimatedCost: flight.price,
            } as DestinationOption
          } catch (err) {
            console.error(`Error enriching ${flight.destination}:`, err)
            return {
              destination: flight.destination,
              destinationName: flight.destinationName,
              flight,
              attractions: [],
              weather: null,
              transport: null,
              totalEstimatedCost: flight.price,
            } as unknown as DestinationOption
          }
        })
      )

      console.log(`✅ Enriched ${destinations.length} destinations`)

    } catch (apiError: unknown) {
      console.error('❌ Error fetching destinations:', apiError)
      errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error'
    }

    // Step 5: Format response with Claude
    console.log('📝 Step 4: Formatting response...')

    let formattedContent: string

    if (errorMessage) {
      formattedContent = `Przepraszam, wystąpił problem z wyszukiwaniem lotów. Upewnij się, że klucze API są poprawnie skonfigurowane.\n\nBłąd: ${errorMessage}`
    } else {
      const formatResponse = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 2048,
        system: FORMATTING_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Original query: "${userContent}"\n\nSearch results:\n\n${JSON.stringify(destinations, null, 2)}`,
          },
        ],
      })

      formattedContent = formatResponse.content.find(b => b.type === 'text')?.text 
        || 'Znalazłem kilka opcji dla Ciebie! Sprawdź karty poniżej.'
    }

    // Build final response
    const response: ChatApiResponse = {
      content: formattedContent,
      destinations: destinations.length > 0 ? destinations : undefined,
    }

    console.log('✅ Chat completed successfully')
    console.log('📊 Response length:', response.content.length, 'chars')
    console.log('🎯 Destinations:', response.destinations?.length || 0)

    return Response.json(response)

  } catch (error: unknown) {
    console.error('❌ Chat API error:', error)
    
    // Provide user-friendly error messages
    let errorMessage = 'Przepraszam, wystąpił błąd. Spróbuj ponownie.'
    let statusCode = 500

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiError = error as any

    if (apiError.status === 400 && apiError.message?.includes('credit balance')) {
      errorMessage = '⚠️ **Brak środków na koncie Anthropic API.**\n\nAby korzystać z FlightChat, musisz doładować konto:\n1. Wejdź na console.anthropic.com\n2. Przejdź do Plans & Billing\n3. Dodaj kredyty (min. $5)\n\nPo doładowaniu odśwież stronę i spróbuj ponownie.'
      statusCode = 402
    } else if (apiError.status === 401) {
      errorMessage = '⚠️ **Nieprawidłowy klucz API Anthropic.** Sprawdź ANTHROPIC_API_KEY w pliku .env.local.'
      statusCode = 401
    } else if (apiError.status === 429) {
      errorMessage = '⚠️ **Za dużo zapytań.** Poczekaj chwilę i spróbuj ponownie.'
      statusCode = 429
    } else if (apiError.status === 529 || apiError.status === 503) {
      errorMessage = '⚠️ **Serwer Claude jest tymczasowo przeciążony.** Spróbuj ponownie za minutę.'
      statusCode = 503
    }

    const response: ChatApiResponse = {
      content: errorMessage,
      destinations: undefined,
    }

    return Response.json(response, { status: statusCode })
  }
}
