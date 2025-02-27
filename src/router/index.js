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
    name: 'GameView',
    component: () => import('@/views/Game.vue'),
    props: true
  },
  {
    path: '/stats/:id',
    name: 'StatScreen',
    component: () => import('@/components/StatScreen.vue'),
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
