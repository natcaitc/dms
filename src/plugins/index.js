/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import createAuth0Plugin from './auth0'

export function registerPlugins (app) {
  const auth0 = createAuth0Plugin()

  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(auth0)
}
