import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('@/views/Team.vue')
  },
  {
    path: '/create-game',
    name: 'CreateGame',
    component: () => import('@/views/CreateGame.vue')
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: () => import('@/views/Game.vue')
  },
  {
    path: '/stats/:id',
    name: 'Stats',
    component: () => import('@/views/Stats.vue')
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('@/views/Results.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
