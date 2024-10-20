import App from "./App.vue";
import HomeView from "./views/HomeView.vue";
import TicketView from "./views/TicketView.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/ticket/:id", component: TicketView },
  { path: "/", component: HomeView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(createPinia());
app
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
        darkModeSelector: ".dark-mode",
        cssLayer: false,
      },
    },
  })
  .use(router)
  .mount("#app");
