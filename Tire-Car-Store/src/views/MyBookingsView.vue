<script setup>
/*
  MyBookingsView.vue
  Den här sidan är för att se och hantera bokningar.
  Krav: man ska kunna se listor, söka (regNr/email/id), filtrera på datum,
  ändra/avboka bokningar och markera som klar + spara vad som gjordes.
*/

import { ref, computed } from "vue";
import { useBookingStore } from "../stores/bookingStore";

// Hämtar store där alla bokningar ligger
const bookingStore = useBookingStore();

// Text som användaren skriver i sökfältet (regNr eller email eller id)
const searchText = ref("");

// Datumfilter (om man vill se bara en viss dag)
const filterDate = ref("");

// För detaljer: vilken bokning som är vald + om vi är i edit-läge
const selectedBookingId = ref(null);
const isEditing = ref(false);

// En kopia av bokningen som jag redigerar i formuläret
// (så man inte ändrar direkt i listan innan man klickar Save)
const editBooking = ref({
  id: "",
  name: "",
  email: "",
  phone: "",
  regNr: "",
  serviceType: "",
  date: "",
  time: "",
  status: "",
  performedAction: "",
  description: "", // beskrivning av vad som ska göras (what will happen)
});

// Samma service-typer som på bokningssidan
const serviceTypes = [
  "Oil change",
  "Brake adjustment",
  "Full service",
  "Tire change",
];

// Samma tider som på bokningssidan
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

// Filtrerad lista (först datumfilter, sen sök)
const filteredBookings = computed(() => {
  // Jag utgår från sortedBookings så att listan redan är sorterad
  let list = bookingStore.sortedBookings;

  // Filtrera på datum om datum är valt
  if (filterDate.value) {
    list = list.filter((b) => b.date === filterDate.value);
  }

  // Sökfilter (kan vara email, regNr eller id)
  const q = searchText.value.trim().toLowerCase();
  if (q) {
    list = list.filter((b) => {
      const email = (b.email || "").toLowerCase();
      const reg = (b.regNr || "").toLowerCase();
      const id = (b.id || "").toLowerCase();
      return email.includes(q) || reg.includes(q) || id.includes(q);
    });
  }

  return list;
});

// Jag delar upp bokningar i olika listor beroende på status
const upcomingBookings = computed(() =>
  filteredBookings.value.filter((b) => b.status === "upcoming")
);

const ongoingBookings = computed(() =>
  filteredBookings.value.filter((b) => b.status === "ongoing")
);

const completedBookings = computed(() =>
  filteredBookings.value.filter((b) => b.status === "completed")
);

const cancelledBookings = computed(() =>
  filteredBookings.value.filter((b) => b.status === "cancelled")
);

// Hämtar detaljerna för vald bokning (från store)
const selectedBooking = computed(() => {
  if (!selectedBookingId.value) return null;
  return (
    bookingStore.bookings.find((b) => b.id === selectedBookingId.value) || null
  );
});

// Öppnar detaljpanelen för en bokning
function openDetails(id) {
  selectedBookingId.value = id;
  isEditing.value = false; // alltid börja i view-läge
}

// Starta edit: kopierar vald bokning till editBooking
function startEdit() {
  if (!selectedBooking.value) return;

  isEditing.value = true;
  editBooking.value = { ...selectedBooking.value };
}

// Avbryter edit-läge (ingen ändring sparas)
function cancelEdit() {
  isEditing.value = false;
}

// Sparar ändringarna i store
function saveEdit() {
  // Enkel koll att allt är ifyllt
  if (
    !editBooking.value.name ||
    !editBooking.value.email ||
    !editBooking.value.phone ||
    !editBooking.value.regNr ||
    !editBooking.value.serviceType ||
    !editBooking.value.date ||
    !editBooking.value.time
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }

  // Kollar så man inte bokar samma tid som någon annan
  // (men ignorera den bokningen vi redan redigerar)
  if (
    bookingStore.isSlotTaken(
      editBooking.value.date,
      editBooking.value.time,
      editBooking.value.id
    )
  ) {
    alert("That time is already booked. Please choose another time.");
    return;
  }

  // Uppdaterar bokningen i store
  bookingStore.updateBooking({
    ...editBooking.value,
    regNr: editBooking.value.regNr.toUpperCase(), // regnr i versaler för att vara konsekvent
  });

  isEditing.value = false;
}

// Avbokar en bokning
function cancelBooking(id) {
  // Jag frågar användaren först för säkerhets skull
  const ok = confirm("Are you sure you want to cancel this booking?");
  if (!ok) return;

  bookingStore.cancelBooking(id);

  // Om man avbokar den som man tittar på, stäng detaljrutan
  if (selectedBookingId.value === id) {
    selectedBookingId.value = null;
    isEditing.value = false;
  }
}

// Markerar en bokning som completed (och sparar vad som gjordes)
function completeBooking(id) {
  // Prompt används här för att snabbt skriva vad som gjordes
  const performedAction = prompt(
    "What was done? (Write a short text for history)",
    "Service completed"
  );

  // Om man klickar Cancel i prompten så gör vi inget
  if (performedAction === null) return;

  bookingStore.completeBooking(id, performedAction);

  // Gå tillbaka till view-läge efter ändring
  isEditing.value = false;
}

// Markerar som ongoing (extra funktion för att visa “ongoing” i listorna)
function markOngoing(id) {
  const booking = bookingStore.bookings.find((b) => b.id === id);
  if (!booking) return;

  bookingStore.updateBooking({
    ...booking,
    status: "ongoing",
  });

  isEditing.value = false;
}

// Rensar sök och datumfilter
function clearFilters() {
  searchText.value = "";
  filterDate.value = "";
}
</script>

<template>
  <section>
    <h1>My Bookings</h1>

    <!-- Filter-rutan: sök + datum -->
    <div class="filters card">
      <div class="filterField">
        <label>Search (email, regNr or booking id)</label>
        <input
          v-model="searchText"
          type="text"
          placeholder="example: ABC123 or name@mail.com"
        />
      </div>

      <div class="filterField">
        <label>Filter by date</label>
        <input v-model="filterDate" type="date" />
      </div>

      <!-- Knapp för att nollställa filter -->
      <button class="btn" type="button" @click="clearFilters">Clear</button>
    </div>

    <!-- Här visas listor med bokningar, uppdelat på status -->
    <div class="lists">
      <div class="listBox card">
        <h2>Upcoming</h2>
        <p v-if="upcomingBookings.length === 0" class="small">
          No upcoming bookings.
        </p>
        <ul v-else>
          <li v-for="b in upcomingBookings" :key="b.id">
            <!-- Klickbar rad så man kan öppna detaljer -->
            <button class="linkBtn" @click="openDetails(b.id)">
              {{ b.id }} - {{ b.date }} {{ b.time }} - {{ b.regNr }} -
              {{ b.serviceType }}
              <span class="badge" :class="b.status">{{ b.status }}</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="listBox card">
        <h2>Ongoing</h2>
        <p v-if="ongoingBookings.length === 0" class="small">
          No ongoing bookings.
        </p>
        <ul v-else>
          <li v-for="b in ongoingBookings" :key="b.id">
            <button class="linkBtn" @click="openDetails(b.id)">
              {{ b.id }} - {{ b.date }} {{ b.time }} - {{ b.regNr }} -
              {{ b.serviceType }}
              <span class="badge" :class="b.status">{{ b.status }}</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="listBox card">
        <h2>Completed (History)</h2>
        <p v-if="completedBookings.length === 0" class="small">
          No completed bookings.
        </p>
        <ul v-else>
          <li v-for="b in completedBookings" :key="b.id">
            <button class="linkBtn" @click="openDetails(b.id)">
              {{ b.id }} - {{ b.date }} {{ b.time }} - {{ b.regNr }} -
              {{ b.serviceType }}
              <span class="badge" :class="b.status">{{ b.status }}</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="listBox card">
        <h2>Cancelled</h2>
        <p v-if="cancelledBookings.length === 0" class="small">
          No cancelled bookings.
        </p>
        <ul v-else>
          <li v-for="b in cancelledBookings" :key="b.id">
            <button class="linkBtn" @click="openDetails(b.id)">
              {{ b.id }} - {{ b.date }} {{ b.time }} - {{ b.regNr }} -
              {{ b.serviceType }}
              <span class="badge" :class="b.status">{{ b.status }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Detaljpanelen kommer bara fram när man valt en bokning -->
    <div v-if="selectedBooking" class="details card">
      <h2>Booking Details</h2>

      <!-- View-läge (bara visa info) -->
      <div v-if="!isEditing">
        <p><strong>ID:</strong> {{ selectedBooking.id }}</p>
        <p><strong>Name:</strong> {{ selectedBooking.name }}</p>
        <p><strong>Email:</strong> {{ selectedBooking.email }}</p>
        <p><strong>Phone:</strong> {{ selectedBooking.phone }}</p>
        <p><strong>RegNr:</strong> {{ selectedBooking.regNr }}</p>
        <p><strong>Service:</strong> {{ selectedBooking.serviceType }}</p>

        <!-- Beskrivning av vad som ska göras (kravet "what will happen") -->
        <p><strong>Description:</strong> {{ selectedBooking.description }}</p>

        <p>
          <strong>Date/Time:</strong> {{ selectedBooking.date }}
          {{ selectedBooking.time }}
        </p>
        <p>
          <strong>Status:</strong>
          {{ selectedBooking.status }}
          <span class="badge" :class="selectedBooking.status">{{
            selectedBooking.status
          }}</span>
        </p>

        <!-- Extra info om bokningen är klar -->
        <p v-if="selectedBooking.status === 'completed'">
          <strong>Performed action:</strong> {{ selectedBooking.performedAction }}
        </p>

        <!-- Knappar för att hantera bokningen -->
        <div class="actions">
          <button
            class="btn"
            @click="startEdit"
            :disabled="selectedBooking.status === 'completed'"
          >
            Edit
          </button>

          <button class="btn" @click="cancelBooking(selectedBooking.id)">
            Cancel booking
          </button>

          <button
            class="btn"
            @click="markOngoing(selectedBooking.id)"
            :disabled="selectedBooking.status !== 'upcoming'"
          >
            Mark ongoing
          </button>

          <button
            class="btn"
            @click="completeBooking(selectedBooking.id)"
            :disabled="
              selectedBooking.status === 'completed' ||
              selectedBooking.status === 'cancelled'
            "
          >
            Mark completed
          </button>
        </div>
      </div>

      <!-- Edit-läge (här kan man ändra bokningen) -->
      <div v-else>
        <p class="small">(Editing booking {{ editBooking.id }})</p>

        <!-- Visar description även i edit-läge (read-only) så man ser "what will happen" -->
        <p class="small">
          <strong>Description:</strong> {{ editBooking.description }}
        </p>

        <div class="form">
          <div class="field">
            <label>Name</label>
            <input v-model="editBooking.name" type="text" />
          </div>

          <div class="field">
            <label>Email</label>
            <input v-model="editBooking.email" type="email" />
          </div>

          <div class="field">
            <label>Phone</label>
            <input v-model="editBooking.phone" type="tel" />
          </div>

          <div class="field">
            <label>RegNr</label>
            <input v-model="editBooking.regNr" type="text" />
          </div>

          <div class="field">
            <label>Service type</label>
            <select v-model="editBooking.serviceType">
              <option v-for="s in serviceTypes" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
          </div>

          <div class="field">
            <label>Date</label>
            <input v-model="editBooking.date" type="date" />
          </div>

          <div class="field">
            <label>Time</label>
            <select v-model="editBooking.time">
              <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <!-- Knappar för att spara eller avbryta -->
          <div class="actions">
            <button class="btn" @click="saveEdit">Save</button>
            <button class="btn" @click="cancelEdit">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Använder global .card och .btn från main.css */

.filters {
  display: grid;
  grid-template-columns: 1fr 240px 120px;
  gap: 12px;
  align-items: end;
}

.filterField {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 4px;
}

.small {
  font-size: 13px;
}

/* Rutnät med listorna */
.lists {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.listBox {
  padding: 12px;
}

/* En knapp som ser ut som en länk (för att öppna detaljer) */
.linkBtn {
  border: none;
  background: transparent;
  padding: 4px 0;
  text-decoration: underline;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
}

.details {
  margin-top: 16px;
  max-width: 980px;
}

/* Knapprad i detaljpanelen */
.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Edit-formen i två kolumner */
.form {
  margin-top: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
}

/* Små badges för status */
.badge {
  display: inline-block;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #ccc;
  margin-left: 6px;
}

.badge.upcoming {
  background: #fff;
}

.badge.ongoing {
  background: #f7f7f7;
}

.badge.completed {
  background: #efefef;
}

.badge.cancelled {
  background: #ffecec;
}
</style>
