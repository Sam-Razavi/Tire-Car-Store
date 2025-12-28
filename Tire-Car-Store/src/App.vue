<script setup>
// Load bookings when the app starts
import { onMounted } from "vue";
import { useBookingStore } from "./stores/bookingStore";

const bookingStore = useBookingStore();

onMounted(() => {
  bookingStore.loadBookings();
});
</script>


<template>
  <div>
    <header class="header">
      <div class="container headerInner">
        <div class="brand">
          <div class="logo">🚗</div>
          <div>
            <div class="title">Tire & Car Service</div>
            <div class="subtitle">Booking system</div>
          </div>
        </div>

        <nav class="nav">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/book-service">Book Service</RouterLink>
          <RouterLink to="/my-bookings">My Bookings</RouterLink>
          <RouterLink to="/about">About Us</RouterLink>
        </nav>
      </div>
    </header>

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.header {
  border-bottom: 1px solid #ddd;
  background: white;
}

.headerInner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  font-size: 24px;
}

.title {
  font-weight: 700;
}

.subtitle {
  font-size: 13px;
  color: #666;
}

.nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.nav a {
  text-decoration: none;
  color: #222;
  padding: 6px 8px;
  border-radius: 6px;
}

.nav a.router-link-active {
  font-weight: 700;
  background: #f1f1f1;
}
</style>

