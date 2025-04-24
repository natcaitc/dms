/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Fontawesome imports
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
import { mdi } from 'vuetify/iconsets/mdi'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

// Tree View
import { VTreeview } from 'vuetify/labs/VTreeview'


// import { faUserSecret } from '@fortawesome/sharp-solid-svg-icons'
library.add(fas)

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: { // Use Fontawesome
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
      mdi,
    },
  },
  components: {
    VTreeview,
  },
  theme: {
    defaultTheme: 'dark',
  },
})
