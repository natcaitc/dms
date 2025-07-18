/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
// import { setupLayouts } from 'virtual:generated-layouts'
// import { routes } from 'vue-router/auto-routes'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import LogoCRUD from '@/components/LogoCRUD.vue'
import UploadLogo from '@/components/UploadLogo.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import { useAuth0 } from '@auth0/auth0-vue'

// Auth guard
const authGuard = (to, from, next) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  if (isAuthenticated.value) {
    next()
  } else {
    loginWithRedirect({ appState: { targetUrl: to.fullPath } })
  }
}

// Create routes
const routes = [
  { path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HelloWorld,
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfilePage,
        beforeEnter: authGuard,
      },
      {
        path: 'verify',
        name: 'verify',
        component: () => import('@/pages/VerifyPage.vue'),
        beforeEnter: authGuard,
      },
    ],
  },
  { path: '/logos',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'logos',
        component: LogoCRUD,
        beforeEnter: authGuard,
      },
      {
        path: 'upload',
        children: [
          {
            path: '',
            name: 'upload',
            component: UploadLogo,
            beforeEnter: authGuard,
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
