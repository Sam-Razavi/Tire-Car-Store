import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import BookServiceView from "../views/BookServiceView.vue";
import MyBookingsView from "../views/MyBookingsView.vue";
import AboutView from "../views/AboutView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/book-service", name: "book-service", component: BookServiceView },
  { path: "/my-bookings", name: "my-bookings", component: MyBookingsView },
  { path: "/about", name: "about", component: AboutView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
