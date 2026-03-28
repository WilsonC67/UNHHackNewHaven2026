<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTripStore } from '../stores/trip'

const store = useTripStore()
const router = useRouter()

onMounted(async () => {
  if (!store.quizAnswers) {
    router.push('/quiz')
    return
  }
  if (!store.itinerary) {
    await store.fetchItinerary()
  }
})
</script>

<template>
  <div class="itinerary">
    <!-- Loading -->
    <div v-if="store.loading" class="itinerary__loading">
      <p>Finding your destination beyond the horizon...</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="itinerary__error">
      <p>{{ store.error }}</p>
      <button @click="store.fetchItinerary()">Try again</button>
    </div>

    <!-- Itinerary -->
    <template v-else-if="store.itinerary">
      <!-- Hero -->
      <section class="itinerary__hero">
        <h1>{{ store.itinerary.destination }}</h1>
        <p class="itinerary__tagline">{{ store.itinerary.tagline }}</p>
        <p class="itinerary__reason">{{ store.itinerary.personalizedReason }}</p>
      </section>

      <!-- 5-Day Plan -->
      <section class="itinerary__days">
        <h2>Your 5-Day Plan</h2>
        <div v-for="day in store.itinerary.days" :key="day.day" class="itinerary__day">
          <h3>Day {{ day.day }}</h3>
          <div class="itinerary__day-slot">
            <span class="itinerary__day-label">Morning</span>
            <p>{{ day.morning }}</p>
          </div>
          <div class="itinerary__day-slot">
            <span class="itinerary__day-label">Afternoon</span>
            <p>{{ day.afternoon }}</p>
          </div>
          <div class="itinerary__day-slot">
            <span class="itinerary__day-label">Evening</span>
            <p>{{ day.evening }}</p>
          </div>
        </div>
      </section>

      <!-- Must Eat -->
      <section class="itinerary__food">
        <h2>Must Eat</h2>
        <div v-for="item in store.itinerary.mustEat" :key="item.dish" class="itinerary__food-card">
          <h3>{{ item.dish }}</h3>
          <p class="itinerary__food-restaurant">{{ item.restaurant }}</p>
          <p>{{ item.description }}</p>
        </div>
      </section>

      <!-- Hidden Gems -->
      <section class="itinerary__gems">
        <h2>Hidden Gems</h2>
        <ul>
          <li v-for="gem in store.itinerary.hiddenGems" :key="gem">{{ gem }}</li>
        </ul>
      </section>

      <!-- Beyond the Horizon -->
      <section class="itinerary__beyond">
        <h2>Beyond the Horizon</h2>
        <p>{{ store.itinerary.beyondTheHorizon }}</p>
      </section>

      <!-- Packing Tips -->
      <section class="itinerary__packing">
        <h2>Packing Tips</h2>
        <ul>
          <li v-for="tip in store.itinerary.packingTips" :key="tip">{{ tip }}</li>
        </ul>
      </section>

      <!-- Actions -->
      <div class="itinerary__actions">
        <button @click="store.reset(); router.push('/quiz')">Start Over</button>
        <button @click="store.fetchItinerary()">Re-roll Destination</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.itinerary {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.itinerary__loading,
.itinerary__error {
  text-align: center;
  padding: 4rem;
}
.itinerary__tagline {
  font-size: 1.25rem;
  font-style: italic;
}
.itinerary__day {
  margin-bottom: 2rem;
}
.itinerary__day-slot {
  margin-bottom: 0.5rem;
}
.itinerary__day-label {
  font-weight: bold;
  margin-right: 0.5rem;
}
.itinerary__food-card {
  margin-bottom: 1.5rem;
}
.itinerary__food-restaurant {
  font-style: italic;
}
.itinerary__actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
