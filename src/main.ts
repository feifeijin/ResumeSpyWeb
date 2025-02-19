import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerMarkdownEditor } from './plugins/v-md-editor'
import { registerPlugins } from '@/plugins'

import App from './App.vue'
import router from './router'

const app = createApp(App)

registerMarkdownEditor(app)
registerPlugins(app)

app.use(createPinia())
app.use(router)

app.mount('#app')
