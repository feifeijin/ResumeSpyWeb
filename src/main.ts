import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerMarkdownEditor } from './plugins/v-md-editor'
import { registerPlugins } from '@/plugins'
import { setupAxiosInterceptors } from '@/plugins/axios'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from '@/stores/auth'
import { useGuestStore } from '@/stores/guest'
import { useServiceStatusStore } from '@/stores/serviceStatus'
import { initAnalytics } from '@/lib/analytics'

const app = createApp(App)
const pinia = createPinia()

registerMarkdownEditor(app)
registerPlugins(app)

app.use(pinia)
app.use(router)
app.use(i18n)

// Catch any error that bubbles past component-level `onErrorCaptured`
// (the ErrorBoundary in App.vue). This is the final safety net before
// Vue would otherwise log to console and leave the UI in a broken state.
app.config.errorHandler = (err, _instance, info) => {
  console.error('[app.config.errorHandler]', info, err)
  const serviceStatus = useServiceStatusStore(pinia)
  serviceStatus.setAppError(err)
}

setupAxiosInterceptors(pinia)

// Analytics: PostHog page views + product funnel. No-ops without env vars.
initAnalytics()

// Initialize auth from Supabase session, then set up guest if needed, then mount
const authStore = useAuthStore(pinia)
authStore.initialize().then(() => {
  if (!authStore.isAuthenticated) {
    const guestStore = useGuestStore(pinia)
    guestStore.initializeGuestSession()
  }
  app.mount('#app')
})
