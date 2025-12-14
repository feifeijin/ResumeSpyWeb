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

// Initialize guest session for anonymous users so quota is available
const authStore = useAuthStore(pinia)
const guestStore = useGuestStore(pinia)
if (!authStore.isAuthenticated) {
  guestStore.initializeGuestSession()
}

app.mount('#app')
