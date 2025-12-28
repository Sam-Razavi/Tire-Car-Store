// Detta är startpunkten för hela Vue-applikationen

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Pinia används för att hantera global state (t.ex. bokningar)
import { createPinia } from "pinia";

// Global CSS-fil för grundläggande styling
import "./assets/main.css";

// Skapar Vue-applikationen baserat på App.vue
const app = createApp(App);

// Aktiverar Pinia så att vi kan använda stores i hela appen
app.use(createPinia());

// Aktiverar Vue Router för navigering mellan sidor
app.use(router);

// Monterar applikationen i index.html (div med id="app")
app.mount("#app");
