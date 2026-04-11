import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'noir',
    themes: {
      noir: {
        dark: false,
        colors: {
          background:      '#FAFAFA',
          surface:         '#F0F0F0',
          primary:         '#121212',
          secondary:       '#D4D4D4',
          accent:          '#2B2B2B',
          'on-background': '#121212',
          'on-surface':    '#121212',
        },
      },
    },
  },
})
