import { createAuth0 } from '@auth0/auth0-vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import TicketView from './views/TicketView.vue'

const routes = [
  { path: '/ticket/:id', component: TicketView },
  { path: '/', component: HomeView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: ".dark-mode",
        cssLayer: false
    }
  }
})
.use(createAuth0({
    domain: import.meta.env.VITE_DOMAIN,
    clientId: import.meta.env.VITE_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin
    }
}))
.use(router)
.use(createPinia())
.mount("#app")
