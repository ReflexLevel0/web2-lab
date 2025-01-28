import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createPinia } from "pinia";

import { createNotivue } from "notivue";
import "notivue/notification.css";
import "notivue/animations.css";
const notivue = createNotivue({
  position: "top-right",
  limit: 3,
  notifications: {
    global: {
      duration: 5000,
    },
  },
});

createApp(App).use(notivue).use(createPinia()).use(router).mount("#app");
