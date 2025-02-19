/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import type { App } from 'vue'
import vuetify from './vuetify'

export function registerPlugins(app: App) {
  app.use(vuetify)
}
