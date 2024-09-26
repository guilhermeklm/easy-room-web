import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        auth: true
      }
    }
  ]
})

// antes de cada rota, vai ser executado oq esta dentro do beforeEach
router.beforeEach(async (to, from, next) => {
  if(to.meta?.auth) {
    const auth = authStore()

    if(auth.token && auth.user) {
      const isAuthenticated = await auth.checkToken()

      if(isAuthenticated) {
        next()
      }
    }

    next({name: 'login'})
  } else {
    next()
  }
})

export default router
