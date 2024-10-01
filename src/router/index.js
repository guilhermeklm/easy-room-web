import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        auth: true
      }
    }
  ]
})

// antes de cada rota, vai ser executado oq esta dentro do beforeEach
router.beforeEach(async (to, from, next) => {
  if (to.meta?.auth) {
    const auth = useAuthStore()

    if (auth.token && auth.user) {
      console.log("tem token e user")
      const isAuthenticated = await auth.isTokenValid()

      if (isAuthenticated) {
        next()
      }
    }

    next({
      name: 'login',
      query: { error: 'Login expirado' }
    })
  } else {
    next()
  }
})

export default router
