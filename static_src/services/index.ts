import { GeminiItineraryService } from './gemini'
import type { ItineraryService } from '../types/itinerary'

export const itineraryService: ItineraryService = new GeminiItineraryService()
