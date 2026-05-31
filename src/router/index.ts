import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MySpyView from '../views/MySpyView.vue'
import CreateView from '../views/CreateView.vue'
import AuthView from '../views/AuthView.vue'
import AuthMagicView from '../views/AuthMagicView.vue'
import ArticleView from '../views/ArticleView.vue'
import ArticlesIndexView from '../views/ArticlesIndexView.vue'
import FaqView from '../views/FaqView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import TermsView from '../views/TermsView.vue'
import CommercialTransactionsView from '../views/CommercialTransactionsView.vue'
import { useAuthStore } from '@/stores/auth'
import { getSafeRedirect } from '@/utils/safe-redirect'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesIndexView,
    },
    {
      path: '/article/:slug',
      name: 'article',
      component: ArticleView,
    },
    {
      path: '/faq',
      name: 'faq',
      component: FaqView,
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
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
    },
    {
      path: '/commercial-transactions',
      name: 'commercial-transactions',
      component: CommercialTransactionsView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
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
    next(getSafeRedirect(to.query.redirect))
    return
  }

  next()
})

export default router
