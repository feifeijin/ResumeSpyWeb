import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'noir',
    themes: {
      noir: {
        dark: true,
        colors: {
          background:      '#0c0a08',
          surface:         '#161210',
          primary:         '#c49a38',
          secondary:       '#2e2620',
          accent:          '#7a1a1a',
          'on-background': '#e2d5bc',
          'on-surface':    '#e2d5bc',
        },
      },
    },
  },
})
