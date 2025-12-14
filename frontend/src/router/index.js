import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DriverDashboard from '@/views/DriverDashboard.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/driver',
      name: 'driver',
      component: DriverDashboard,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
    },
  ],
})

export default router

