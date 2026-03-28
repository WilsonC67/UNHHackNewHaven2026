import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/quiz' },
    {
      path: '/quiz',
      component: () => import('../views/QuizView.vue'),
    },
    {
      path: '/reveal',
      component: () => import('../views/DestinationRevealView.vue'),
    },
    {
      path: '/itinerary',
      component: () => import('../views/ItineraryView.vue'),
    },
  ],
})

export default router
