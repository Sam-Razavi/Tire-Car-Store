<script setup>
/*
  BookServiceView.vue
  Booking form for car and tire services.
  User can select service type, date, time and enter personal information.
*/

import { ref, computed } from "vue";
import { useBookingStore } from "../stores/bookingStore";

const bookingStore = useBookingStore();

// ---- Form fields ----
const name = ref("");
const email = ref("");
const phone = ref("");
const regNr = ref("");

const serviceType = ref("Oil change");
const selectedDate = ref("");
const selectedTime = ref("");

// Service types
const serviceTypes = [
  "Oil change",
  "Brake adjustment",
  "Full service",
  "Tire change",
];

// Time slots
const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

// Bookings for selected date
const bookingsForSelectedDate = computed(() => {
  if (!selectedDate.value) return [];
  return bookingStore.bookings.filter(
    (b) => b.date === selectedDate.value && b.status !== "cancelled"
  );
});

// Occupied times
const occupiedTimes = computed(() => {
  return bookingsForSelectedDate.value.map((b) => b.time);
});

// Available times
const availableTimes = computed(() => {
  return timeSlots.filter((t) => !occupiedTimes.value.includes(t));
});

// Basic validation
function isFormValid() {
  return (
    name.value.trim() &&
    email.value.trim() &&
    phone.value.trim() &&
    regNr.value.trim() &&
    serviceType.value &&
    selectedDate.value &&
    selectedTime.value
  );
}

// Submit booking
function submitBooking() {
  if (!isFormValid()) {
    alert("Please fill in all fields.");
    return;
  }

  // Prevent double booking
  if (bookingStore.isSlotTaken(selectedDate.value, selectedTime.value)) {
    alert("That time is already booked. Please choose another time.");
    return;
  }

  const newBooking = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    regNr: regNr.value.trim().toUpperCase(),
    serviceType: serviceType.value,
    date: selectedDate.value,
    time: selectedTime.value,
  };

  bookingStore.addBooking(newBooking);

  // Reset form
  name.value = "";
  email.value = "";
  phone.value = "";
  regNr.value = "";
  serviceType.value = "Oil change";
  selectedDate.value = "";
  selectedTime.value = "";
}
</script>

<template>
  <section class="page">
    <h1>Book Service</h1>

    <!-- Booking form -->
    <form class="card form" @submit.prevent="submitBooking">
      <div class="field">
        <label>Name</label>
        <input v-model="name" type="text" placeholder="Your name" />
      </div>

      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="name@example.com" />
      </div>

      <div class="field">
        <label>Phone</label>
        <input v-model="phone" type="tel" placeholder="07XXXXXXXX" />
      </div>

      <div class="field">
        <label>Registration number</label>
        <input v-model="regNr" type="text" placeholder="ABC123" />
      </div>

      <div class="field">
        <label>Service type</label>
        <select v-model="serviceType">
          <option v-for="s in serviceTypes" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Date</label>
        <input v-model="selectedDate" type="date" />
      </div>

      <div class="field">
        <label>Time</label>
        <select v-model="selectedTime" :disabled="!selectedDate">
          <option value="" disabled>Select a time</option>
          <option v-for="t in availableTimes" :key="t" :value="t">
            {{ t }}
          </option>
        </select>

        <p v-if="selectedDate && availableTimes.length === 0" class="small">
          No available times for this date.
        </p>
      </div>

      <div class="btnRow">
        <button class="btn" type="submit">Book service</button>
      </div>
    </form>

    <!-- Time overview -->
    <div v-if="selectedDate" class="card timesBox">
      <h2>Times for {{ selectedDate }}</h2>

      <div class="timesGrid">
        <div>
          <h3>Available times</h3>
          <ul>
            <li v-for="t in availableTimes" :key="'a-' + t">{{ t }}</li>
          </ul>
        </div>

        <div>
          <h3>Occupied times</h3>
          <ul>
            <li v-for="t in occupiedTimes" :key="'o-' + t">{{ t }}</li>
          </ul>
          <p v-if="occupiedTimes.length === 0" class="small">
            No occupied times.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form {
  max-width: 520px;
  width: 100%;
  margin-top: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  font-size: 14px;
  margin-bottom: 4px;
}

.small {
  font-size: 13px;
  margin-top: 6px;
}

.btnRow {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.timesBox {
  margin-top: 20px;
  max-width: 700px;
  width: 100%;
}

.timesGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

ul {
  padding-left: 18px;
}
</style>
