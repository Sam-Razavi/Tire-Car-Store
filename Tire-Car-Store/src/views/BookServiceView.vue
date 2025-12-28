<script setup>
/*
  BookServiceView.vue
  This page contains the booking form.
  Requirement: user must be able to book a service with name, email, phone, regNr, date and time,
  and choose service type. Also show available vs occupied times.
*/

import { ref, computed } from "vue";
import { useBookingStore } from "../stores/bookingStore";

const bookingStore = useBookingStore();

// ---- Form fields ----
const name = ref("");
const email = ref("");
const phone = ref("");
const regNr = ref("");

const serviceType = ref("Oil change"); // default value
const selectedDate = ref(""); // YYYY-MM-DD from <input type="date">
const selectedTime = ref(""); // from select dropdown

// Service types required in the assignment (examples)
const serviceTypes = [
  "Oil change",
  "Brake adjustment",
  "Full service",
  "Tire change",
];

// Simple time slots (student-friendly)
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

// Find bookings for the selected date
const bookingsForSelectedDate = computed(() => {
  if (!selectedDate.value) return [];
  return bookingStore.bookings.filter((b) => b.date === selectedDate.value);
});

// Occupied times on that date (ignore cancelled to make times free again)
const occupiedTimes = computed(() => {
  return bookingsForSelectedDate.value
    .filter((b) => b.status !== "cancelled")
    .map((b) => b.time);
});

// Available times = all slots minus occupied
const availableTimes = computed(() => {
  return timeSlots.filter((t) => !occupiedTimes.value.includes(t));
});

// Simple validation (keep it basic)
function isFormValid() {
  return (
    name.value.trim() !== "" &&
    email.value.trim() !== "" &&
    phone.value.trim() !== "" &&
    regNr.value.trim() !== "" &&
    serviceType.value.trim() !== "" &&
    selectedDate.value.trim() !== "" &&
    selectedTime.value.trim() !== ""
  );
}

// Submit booking
function submitBooking() {
  if (!isFormValid()) {
    alert("Please fill in all fields.");
    return;
  }

  // Create a booking object (store will add id/status/performedAction)
  const newBooking = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    regNr: regNr.value.trim().toUpperCase(),
    serviceType: serviceType.value,
    date: selectedDate.value,
    time: selectedTime.value,
  };

  // Add booking to store (save is simulated with alert inside the store)
  bookingStore.addBooking(newBooking);

  // Reset form (student-like)
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
  <section>
    <h1>Book Service</h1>

    <form class="form" @submit.prevent="submitBooking">
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
        <!-- This counts as a simple "calendar" selection -->
        <input v-model="selectedDate" type="date" />
      </div>

      <div class="field">
        <label>Time</label>
        <select v-model="selectedTime" :disabled="!selectedDate">
          <option value="" disabled>Select a time</option>

          <!-- Only show available times in the dropdown -->
          <option v-for="t in availableTimes" :key="t" :value="t">
            {{ t }}
          </option>
        </select>

        <p v-if="selectedDate && availableTimes.length === 0" class="small">
          No available times for this date. Please choose another date.
        </p>
      </div>

      <button class="btn" type="submit">Book service</button>
    </form>

    <div v-if="selectedDate" class="timesBox">
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
          <p v-if="occupiedTimes.length === 0" class="small">No occupied times.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Simple student-like styling */
.form {
  max-width: 520px;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 6px;
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

input,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 10px 12px;
  border: 1px solid #333;
  background: #fff;
  cursor: pointer;
}

.small {
  font-size: 13px;
  margin-top: 6px;
}

.timesBox {
  margin-top: 16px;
  max-width: 700px;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 6px;
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
