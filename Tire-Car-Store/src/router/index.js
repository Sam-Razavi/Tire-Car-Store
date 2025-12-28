// Importerar funktioner som behövs för att skapa routing i Vue
import { createRouter, createWebHistory } from "vue-router";

// Importerar alla vyer (sidor) som ska användas i appen
import HomeView from "../views/HomeView.vue";
import BookServiceView from "../views/BookServiceView.vue";
import MyBookingsView from "../views/MyBookingsView.vue";
import AboutView from "../views/AboutView.vue";

// Här definierar jag alla routes (URL:er) i applikationen
const routes = [
  // Startsidan
  { path: "/", name: "home", component: HomeView },

  // Sida för att boka en tjänst
  { path: "/book-service", name: "book-service", component: BookServiceView },

  // Sida där användaren kan se sina bokningar
  { path: "/my-bookings", name: "my-bookings", component: MyBookingsView },

  // Om oss-sidan
  { path: "/about", name: "about", component: AboutView },
];

// Skapar själva routern och kopplar ihop historik och routes
const router = createRouter({
  history: createWebHistory(), // använder webbhistorik (vanliga URL:er)
  routes, // alla routes som finns i appen
});

// Exporterar routern så den kan användas i main.js
export default router;
