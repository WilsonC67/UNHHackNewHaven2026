import { Router } from 'express'
import { getIata } from '../data/city_iata_map.js'
import type { FlightOffer } from '../types.js'

const router = Router()

const SERPAPI_BASE = 'https://serpapi.com/search.json'

interface SerpApiFlightLeg {
  departure_airport: { name: string; id: string; time: string }
  arrival_airport: { name: string; id: string; time: string }
  airline: string
  airline_logo: string
  flight_number: string
  duration: number
}

interface SerpApiItinerary {
  flights: SerpApiFlightLeg[]
  price: number
  total_duration: number
  airline_logo: string
  booking_token: string
}

interface SerpApiResponse {
  best_flights?: SerpApiItinerary[]
  other_flights?: SerpApiItinerary[]
  error?: string
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `PT${h}H${m}M`
}

function mapItinerary(it: SerpApiItinerary): FlightOffer {
  const firstLeg = it.flights[0]
  const lastLeg = it.flights[it.flights.length - 1]
  return {
    id: it.booking_token,
    price: it.price,
    currency: 'USD',
    airline: firstLeg.airline,
    airlineLogo: it.airline_logo,
    flightNumber: firstLeg.flight_number,
    departure: firstLeg.departure_airport.time,
    arrival: lastLeg.arrival_airport.time,
    duration: formatDuration(it.total_duration),
    stops: it.flights.length - 1,
    bookingToken: it.booking_token,
  }
}

router.post('/', async (req, res) => {
  const { originQuery, destinationQuery, departureDate, adults = 1 } = req.body as {
    originQuery: string
    destinationQuery: string
    departureDate: string
    adults?: number
  }

  if (!originQuery || !destinationQuery || !departureDate) {
    res.status(400).json({ success: false, error: 'originQuery, destinationQuery, and departureDate are required' })
    return
  }

  const originIata = getIata(originQuery)
  const destinationIata = getIata(destinationQuery)

  if (!originIata) {
    res.status(400).json({ success: false, error: `No airport found for origin "${originQuery}"` })
    return
  }
  if (!destinationIata) {
    res.status(400).json({ success: false, error: `No airport found for destination "${destinationQuery}"` })
    return
  }

  try {
    const params = new URLSearchParams({
      engine: 'google_flights',
      departure_id: originIata,
      arrival_id: destinationIata,
      outbound_date: departureDate,
      type: '2',
      adults: String(adults),
      currency: 'USD',
      hl: 'en',
      api_key: process.env.SERPAPI_KEY ?? '',
    })

    const response = await fetch(`${SERPAPI_BASE}?${params}`)
    const data = await response.json() as SerpApiResponse

    if (data.error) {
      throw new Error(data.error)
    }

    const itineraries = [...(data.best_flights ?? []), ...(data.other_flights ?? [])]
    const flights: FlightOffer[] = itineraries.slice(0, 5).map(mapItinerary)

    res.json({ success: true, data: flights })
  } catch (err) {
    console.error('Flights error:', err)
    res.json({
      success: false,
      data: [],
      fallback: true,
      error: 'Flight search unavailable — check Google Flights for options!',
    })
  }
})

export default router
