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

const app = createApp(App)
const pinia = createPinia()

registerMarkdownEditor(app)
registerPlugins(app)

app.use(pinia)
app.use(router)
app.use(i18n)

setupAxiosInterceptors(pinia)

// Initialize auth from Supabase session, then set up guest if needed
const authStore = useAuthStore(pinia)
authStore.initialize().then(() => {
  if (!authStore.isAuthenticated) {
    const guestStore = useGuestStore(pinia)
    guestStore.initializeGuestSession()
  }
})

app.mount('#app')
