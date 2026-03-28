export interface QuizAnswers {
  budget: 'budget' | 'moderate' | 'luxury'
  vibe: string
  travelStyle: string
  biggestFear: string
  preferredSeason: 'spring' | 'summer' | 'autumn' | 'winter'
}

export interface DayPlan {
  day: number
  morning: string
  afternoon: string
  evening: string
}

export interface MustEat {
  dish: string
  restaurant: string
  description: string
}

export interface Itinerary {
  destination: string
  tagline: string
  personalizedReason: string
  days: DayPlan[]
  mustEat: MustEat[]
  hiddenGems: string[]
  beyondTheHorizon: string
  packingTips: string[]
}

export interface ItineraryService {
  generateItinerary(answers: QuizAnswers): Promise<Itinerary>
}
