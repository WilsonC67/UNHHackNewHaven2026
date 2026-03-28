import { GoogleGenerativeAI } from '@google/generative-ai'
import cities from '../../src/data/top_100_cities.json'
import type { ItineraryService, QuizAnswers, Itinerary } from '../types/itinerary'

export class GeminiItineraryService implements ItineraryService {
  private genAI: GoogleGenerativeAI

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
  }

  async generateItinerary(answers: QuizAnswers): Promise<Itinerary> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
    const prompt = this.buildPrompt(answers)
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Gemini sometimes wraps JSON in markdown code fences despite instructions
    const json = text.replace(/^```json\s*/m, '').replace(/\s*```$/m, '').trim()
    return JSON.parse(json) as Itinerary
  }

  private buildPrompt(answers: QuizAnswers): string {
    return `
You are Stowaway, a travel discovery engine that surprises people with destinations they would never have considered.

You MUST choose a destination from this exact list — do not invent or suggest any city not on it:
${(cities as string[]).join(', ')}

The user answered a personality quiz as follows:
- Budget: ${answers.budget}
- Travel vibe: ${answers.vibe}
- Travel style: ${answers.travelStyle}
- Biggest travel fear: ${answers.biggestFear}
- Preferred season: ${answers.preferredSeason}

Choose the single most SURPRISING and fitting destination from the list. Avoid the obvious choice.
If the user said "adventure" don't pick Paris. Push them somewhere unexpected that still genuinely fits their answers.

Return ONLY a valid JSON object — no markdown, no explanation, no code fences — matching this exact shape:
{
  "destination": "<city from the list above>",
  "tagline": "<one punchy sentence, e.g. 'Where neon meets ancient'>",
  "personalizedReason": "<2-3 sentences explaining why this city fits this specific user's quiz answers>",
  "days": [
    { "day": 1, "morning": "...", "afternoon": "...", "evening": "..." },
    { "day": 2, "morning": "...", "afternoon": "...", "evening": "..." },
    { "day": 3, "morning": "...", "afternoon": "...", "evening": "..." },
    { "day": 4, "morning": "...", "afternoon": "...", "evening": "..." },
    { "day": 5, "morning": "...", "afternoon": "...", "evening": "..." }
  ],
  "mustEat": [
    { "dish": "...", "restaurant": "...", "description": "..." },
    { "dish": "...", "restaurant": "...", "description": "..." },
    { "dish": "...", "restaurant": "...", "description": "..." }
  ],
  "hiddenGems": ["...", "...", "..."],
  "beyondTheHorizon": "<one transformative experience unique to this destination>",
  "packingTips": ["...", "...", "..."]
}
`.trim()
  }
}
