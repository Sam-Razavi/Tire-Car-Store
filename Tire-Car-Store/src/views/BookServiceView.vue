<script setup>
/*
  BookServiceView.vue
  Här finns bokningsformuläret för bil- och däckservice.
  Användaren kan välja typ av service, datum, tid och fylla i sina uppgifter.
*/

import { ref, computed } from "vue";
import { useBookingStore } from "../stores/bookingStore";

// Hämtar Pinia-store där bokningar sparas och hämtas
const bookingStore = useBookingStore();

// ---- Fält i formuläret ----
// Jag använder ref() för att kunna koppla inputs med v-model
const name = ref("");
const email = ref("");
const phone = ref("");
const regNr = ref("");

// Standardval i formuläret
const serviceType = ref("Oil change");
const selectedDate = ref("");
const selectedTime = ref("");

// Olika typer av service som användaren kan välja
const serviceTypes = [
  "Oil change",
  "Brake adjustment",
  "Full service",
  "Tire change",
];

// Tider som går att boka (en lista med fasta tider)
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

// Bokningar för valt datum
// computed används så att listan uppdateras automatiskt när selectedDate ändras
const bookingsForSelectedDate = computed(() => {
  if (!selectedDate.value) return [];
  return bookingStore.bookings.filter(
    (b) => b.date === selectedDate.value && b.status !== "cancelled" // jag visar inte avbokade tider
  );
});

// Tider som redan är upptagna för valt datum
const occupiedTimes = computed(() => {
  return bookingsForSelectedDate.value.map((b) => b.time);
});

// Tider som är lediga (tar bort de tider som redan är bokade)
const availableTimes = computed(() => {
  return timeSlots.filter((t) => !occupiedTimes.value.includes(t));
});

// Enkel validering så att allt måste vara ifyllt
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

// Skickar in bokningen
function submitBooking() {
  // Om något saknas så stoppar jag och visar en alert
  if (!isFormValid()) {
    alert("Please fill in all fields.");
    return;
  }

  // Kollar så man inte kan dubbelboka samma tid
  if (bookingStore.isSlotTaken(selectedDate.value, selectedTime.value)) {
    alert("That time is already booked. Please choose another time.");
    return;
  }

  // Bygger upp ett bokningsobjekt med användarens data
  const newBooking = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    regNr: regNr.value.trim().toUpperCase(), // regnr blir versaler för att se snyggt ut
    serviceType: serviceType.value,
    date: selectedDate.value,
    time: selectedTime.value,
  };

  // Lägger till bokningen i store (och sparar den där)
  bookingStore.addBooking(newBooking);

  // Nollställer formuläret efter bokning
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

    <!-- Formulär för bokning -->
    <form class="card form" @submit.prevent="submitBooking">
      <div class="field">
        <label>Name</label>
        <!-- v-model kopplar input till ref:en "name" -->
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
        <!-- Dropdown för att välja service -->
        <select v-model="serviceType">
          <option v-for="s in serviceTypes" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Date</label>
        <!-- Datumval -->
        <input v-model="selectedDate" type="date" />
      </div>

      <div class="field">
        <label>Time</label>

        <!-- Tidval är disabled tills man har valt ett datum -->
        <select v-model="selectedTime" :disabled="!selectedDate">
          <option value="" disabled>Select a time</option>
          <option v-for="t in availableTimes" :key="t" :value="t">
            {{ t }}
          </option>
        </select>

        <!-- Visas om det inte finns några tider kvar -->
        <p v-if="selectedDate && availableTimes.length === 0" class="small">
          No available times for this date.
        </p>
      </div>

      <div class="btnRow">
        <button class="btn" type="submit">Book service</button>
      </div>
    </form>

    <!-- Extra info: visar lediga och upptagna tider för valt datum -->
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

          <!-- Om inget är bokat än -->
          <p v-if="occupiedTimes.length === 0" class="small">
            No occupied times.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Jag centrerar innehållet på sidan */
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Formens storlek */
.form {
  max-width: 520px;
  width: 100%;
  margin-top: 12px;
}

/* Varje fält i formuläret */
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  font-size: 14px;
  margin-bottom: 4px;
}

/* Lite mindre text för info-meddelanden */
.small {
  font-size: 13px;
  margin-top: 6px;
}

/* Rad för knappen */
.btnRow {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

/* Boxen med tider under formuläret */
.timesBox {
  margin-top: 20px;
  max-width: 700px;
  width: 100%;
}

/* Två kolumner: lediga vs upptagna tider */
.timesGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

ul {
  padding-left: 18px;
}
</style>
