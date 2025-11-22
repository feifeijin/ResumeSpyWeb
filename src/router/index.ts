import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MySpyView from '../views/MySpyView.vue'
import CreateView from '../views/CreateView.vue'
import AuthView from '../views/AuthView.vue'
import AuthMagicView from '../views/AuthMagicView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/myspy',
      name: 'myspy',
      component: MySpyView,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresGuest: true },
    },
    {
      path: '/auth/magic',
      name: 'auth-magic',
      component: AuthMagicView,
      meta: { requiresGuest: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'auth', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    const target = typeof to.query.redirect === 'string' ? to.query.redirect : '/'
    next(target)
    return
  }

  next()
})

export default router
