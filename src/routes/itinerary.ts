import { Router } from 'express'
import { OllamaItineraryService } from '../services/ollama.js'
import type { QuizAnswers } from '../types.js'

const router = Router()

router.post('/', async (req, res) => {
  const service = new OllamaItineraryService()
  const answers = req.body as QuizAnswers
  const itinerary = await service.generateItinerary(answers)
  res.json(itinerary)
})

export default router
