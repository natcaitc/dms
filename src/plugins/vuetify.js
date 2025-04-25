/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
// import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Fontawesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
// import { mdi } from 'vuetify/iconsets/mdi'
// import { fas } from '@fortawesome/free-solid-svg-icons'
import { all } from '@awesome.me/kit-8a3b5a2f73/icons'
// import { fass } from '@awesome.me/kit-8a3b5a2f73/icons'

// import { faUserSecret } from '@fortawesome/sharp-solid-svg-icons'
// library.add(fass)
library.add(...all)

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: { // Use Fontawesome
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
      // mdi,
    },
  },
  components: {},
  theme: {
    defaultTheme: 'dark',
  },
})
