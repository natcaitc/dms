/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'/**/


const app = createApp(App)

registerPlugins(app)

app.component('FontAwesomeIcon', FontAwesomeIcon) // Register component globally

app.mount('#app')
