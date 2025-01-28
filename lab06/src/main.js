import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { createNotivue } from 'notivue'
import 'notivue/notification.css'
import 'notivue/animations.css'
const notivue = createNotivue({
  position: 'top-right',
  limit: 3,
  notifications: {
    global: {
      duration: 5000
    }
  }
})

const app = createApp(App)
app.use(notivue)
app.use(createPinia())
app.use(router)

app.mount('#app')
