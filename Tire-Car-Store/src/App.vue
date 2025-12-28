<script setup>
// Kör kod när appen startar
import { onMounted } from "vue";

// Importerar min Pinia-store för bokningar
import { useBookingStore } from "./stores/bookingStore";

// Skapar en instans av bookingStore
const bookingStore = useBookingStore();

// När appen laddas hämtas sparade bokningar (t.ex. från localStorage)
onMounted(() => {
  bookingStore.loadBookings();
});
</script>

<template>
  <div>
    <!-- Header med logga och navigation -->
    <header class="header">
      <div class="container headerInner">
        <!-- Appens logga och titel -->
        <div class="brand">
          <div class="logo">🚗</div>
          <div>
            <div class="title">Tire & Car Service</div>
            <div class="subtitle">Booking system</div>
          </div>
        </div>

        <!-- Navigation mellan sidor -->
        <nav class="nav">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/book-service">Book Service</RouterLink>
          <RouterLink to="/my-bookings">My Bookings</RouterLink>
          <RouterLink to="/about">About Us</RouterLink>
        </nav>
      </div>
    </header>

    <!-- Här visas den aktiva sidan -->
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Styling för header */
.header {
  border-bottom: 1px solid #ddd;
  background: white;
}

/* Innehållet i headern */
.headerInner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
}

/* Logga och titel */
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

/* Navigation */
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

/* Markerar aktiv sida */
.nav a.router-link-active {
  font-weight: 700;
  background: #f1f1f1;
}
</style>
