// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Pinia (state management)
import { createPinia } from "pinia";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia()); // enable pinia
app.use(router);

app.mount("#app");
