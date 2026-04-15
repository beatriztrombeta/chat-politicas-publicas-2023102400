import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/signup/SignupView.vue'

const routes = [
  {
    path: '/',
    name: 'root'
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let authCheckedAt = 0
let isAuthedCache = false
const AUTH_CACHE_TTL = 30000

function saveAuthUser(user) {
  localStorage.setItem('auth_user', JSON.stringify(user))
  window.dispatchEvent(new CustomEvent('auth-user-updated', { detail: user }))
}

function clearAuthUser() {
  localStorage.removeItem('auth_user')
  window.dispatchEvent(new CustomEvent('auth-user-updated', { detail: null }))
}

export function invalidateAuthCache() {
  authCheckedAt = 0
  isAuthedCache = false
}

export async function checkAuth(force = false) {
  const now = Date.now()

  if (!force && isAuthedCache && now - authCheckedAt < AUTH_CACHE_TTL) {
    return true
  }

  try {
    const res = await fetch(`${apiBase}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!res.ok) {
      invalidateAuthCache()
      clearAuthUser()
      return false
    }

    const body = await res.json().catch(() => ({}))

    saveAuthUser({
      id_usuario: body?.id_usuario ?? null,
      id_categoria_usuario: body?.id_categoria_usuario ?? null,
      email: body?.email ?? null,
      nome: body?.nome ?? null,
      status_cadastro: body?.status_cadastro ?? null
    })

    isAuthedCache = true
    authCheckedAt = now
    return true
  } catch {
    invalidateAuthCache()
    clearAuthUser()
    return false
  }
}

router.beforeEach(async (to) => {
  const publicNames = new Set(['login', 'auth', 'signup'])
  const isPublic = publicNames.has(to.name)

  if (to.path === '/') {
    const ok = await checkAuth()
    return ok ? { path: '/home' } : { path: '/login' }
  }

  if (isPublic) {
    const ok = await checkAuth()
    if (ok) {
      return { path: '/home' }
    }
    return true
  }

  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth)
  if (!requiresAuth) return true

  const ok = await checkAuth()
  if (!ok) {
    return { path: '/login' }
  }

  return true
})

export default router