import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerMarkdownEditor } from './plugins/v-md-editor'
import { registerPlugins } from '@/plugins'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)

registerMarkdownEditor(app)
registerPlugins(app)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
