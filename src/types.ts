export interface FlightOffer {
  id: string
  price: number
  currency: string
  airline: string
  airlineLogo: string
  flightNumber: string
  departure: string
  arrival: string
  duration: string
  stops: number
  bookingToken: string
}

export interface ResolvedAirport {
  iata: string
  name: string
  city: string
}
