import { defineStore } from 'pinia'
import { ref } from 'vue'
import { itineraryService } from '../services/index'
import type { QuizAnswers, Itinerary } from '../types/itinerary'

export const useTripStore = defineStore('trip', () => {
  const quizAnswers = ref<QuizAnswers | null>(null)
  const itinerary = ref<Itinerary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItinerary() {
    if (!quizAnswers.value) return
    loading.value = true
    error.value = null
    try {
      itinerary.value = await itineraryService.generateItinerary(quizAnswers.value)
    } catch {
      error.value = 'Could not generate your trip. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function reset() {
    quizAnswers.value = null
    itinerary.value = null
    error.value = null
  }

  return { quizAnswers, itinerary, loading, error, fetchItinerary, reset }
})
