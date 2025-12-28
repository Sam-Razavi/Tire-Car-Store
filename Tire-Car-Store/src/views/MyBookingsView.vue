<script setup>
import { computed } from "vue";
import { useBookingStore } from "../stores/bookingStore";

const bookingStore = useBookingStore();

// Show sorted bookings
const bookings = computed(() => bookingStore.sortedBookings);
</script>

<template>
  <section>
    <h1>My Bookings</h1>

    <p v-if="bookings.length === 0">No bookings yet.</p>

    <ul v-else>
      <li v-for="b in bookings" :key="b.id">
        <strong>{{ b.id }}</strong> - {{ b.date }} {{ b.time }} -
        {{ b.regNr }} - {{ b.serviceType }} - ({{ b.status }})
      </li>
    </ul>

    <p style="margin-top: 12px; font-size: 14px;">
      (This list is just a test. Next step: search, filter, edit, cancel, complete.)
    </p>
  </section>
</template>
