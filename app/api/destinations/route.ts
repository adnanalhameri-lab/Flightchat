// API Route: Search Destinations
// GET /api/destinations - Search for flights + attractions + weather + transport

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { searchFlights } from '@/lib/amadeus'
import { getAttractions } from '@/lib/opentripmap'
import { getWeatherForecast } from '@/lib/openweather'
import { getAirportTransport } from '@/lib/transport'
import { DestinationOption, FlightSearchParams } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Check subscription status
    // For Phase 1, we'll allow all authenticated users
    // In Phase 2, add subscription check:
    // const user = await getUserFromDB(userId)
    // if (user.subscriptionStatus !== 'active') {
    //   return NextResponse.json(
    //     { error: 'Active subscription required' },
    //     { status: 403 }
    //   )
    // }

    const params: FlightSearchParams = await req.json()

    // Validate required parameters
    if (!params.origin || !params.departureDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: origin and departureDate' },
        { status: 400 }
      )
    }

    console.log('🔍 Searching destinations:', params)

    // Step 1: Search flights
    const flights = await searchFlights(params)

    if (flights.length === 0) {
      return NextResponse.json({
        destinations: [],
        message: 'No flights found matching your criteria. Try adjusting your search parameters.',
      })
    }

    // Step 2: For each flight, get attractions + weather + transport
    const maxResults = params.maxResults || 3
    const topFlights = flights.slice(0, maxResults)

    console.log(`📊 Found ${flights.length} flights, processing top ${topFlights.length}`)

    const destinations: DestinationOption[] = await Promise.all(
      topFlights.map(async (flight) => {
        console.log(`  Processing: ${flight.destinationName}`)

        // Fetch data in parallel for speed
        const [attractions, weather, transport] = await Promise.all([
          getAttractions(flight.destination, 5).catch((err) => {
            console.error(`Failed to get attractions for ${flight.destination}:`, err)
            return []
          }),
          getWeatherForecast(flight.destination, flight.departureDate).catch((err) => {
            console.error(`Failed to get weather for ${flight.destination}:`, err)
            return null
          }),
          Promise.resolve(getAirportTransport(flight.destination)),
        ])

        return {
          destination: flight.destination,
          destinationName: flight.destinationName,
          flight,
          attractions,
          weather,
          transport,
          totalEstimatedCost: flight.price, // Just flight for now (Phase 2 will add hotels)
        }
      })
    )

    console.log(`✅ Successfully processed ${destinations.length} destinations`)

    return NextResponse.json({ destinations })
  } catch (error: any) {
    console.error('❌ Destinations API error:', error)

    return NextResponse.json(
      {
        error: 'Failed to search destinations',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}
