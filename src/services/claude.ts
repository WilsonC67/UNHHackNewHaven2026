import Anthropic from '@anthropic-ai/sdk'
import cities from '../data/top_100_cities.json' with { type: 'json' }
import type { ItineraryService, QuizAnswers, Itinerary } from '../types.js'

export class ClaudeItineraryService implements ItineraryService {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  async generateItinerary(answers: QuizAnswers): Promise<Itinerary> {
    const stream = this.client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: this.buildPrompt(answers) }],
    })

    const response = await stream.finalMessage()
    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    const json = textBlock.text.replace(/^```json\s*/m, '').replace(/\s*```$/m, '').trim()
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
