import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerMarkdownEditor } from './plugins/v-md-editor'
import { registerPlugins } from '@/plugins'
import { setupAxiosInterceptors } from '@/plugins/axios'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)
const pinia = createPinia()

registerMarkdownEditor(app)
registerPlugins(app)

app.use(pinia)
app.use(router)
app.use(i18n)

setupAxiosInterceptors(pinia)

app.mount('#app')
