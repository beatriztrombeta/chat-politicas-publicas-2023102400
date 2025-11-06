import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/composable/useAuth'
import AuthView from '@/views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path:'/auth',
    component: AuthView,
    meta: { guest: true },
  },
  {
    path: '/home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    component: LoginView,
    meta: { guest: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const loggedIn = await isAuthenticated()

  if (to.meta.requiresAuth && !loggedIn) {
    return '/login'
  }

  if (to.meta.guest && loggedIn) {
    return '/home'
  }

  return true
})


export default router
