<script setup>

import { ref, computed } from "vue";
import { useBookingStore } from "../stores/bookingStore";

const bookingStore = useBookingStore();

// Search input (can be regNr OR email)
const searchText = ref("");

// Filter by date 
const filterDate = ref("");

// For showing details + editing
const selectedBookingId = ref(null);
const isEditing = ref(false);

// Editable copy of booking 
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
});

// Service types (same as book page)
const serviceTypes = [
  "Oil change",
  "Brake adjustment",
  "Full service",
  "Tire change",
];

// Time slots (same as book page)
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

// Filtered bookings (search + date filter)
const filteredBookings = computed(() => {
  let list = bookingStore.sortedBookings;

  // Date filter
  if (filterDate.value) {
    list = list.filter((b) => b.date === filterDate.value);
  }

  // Search filter (email or regNr)
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

// Simple groups (upcoming, ongoing, completed)
const upcomingBookings = computed(() =>
  filteredBookings.value.filter((b) => b.status === "upcoming")
);

const ongoingBookings = computed(() =>
  filteredBookings.value.filter((b) => b.status === "ongoing")
);

const completedBookings = computed(() =>
  filteredBookings.value.filter((b) => b.status === "completed")
);

// Get selected booking details
const selectedBooking = computed(() => {
  if (!selectedBookingId.value) return null;
  return bookingStore.bookings.find((b) => b.id === selectedBookingId.value) || null;
});

function openDetails(id) {
  selectedBookingId.value = id;
  isEditing.value = false;
}

// Start editing
function startEdit() {
  if (!selectedBooking.value) return;

  isEditing.value = true;
  editBooking.value = { ...selectedBooking.value };
}

// Cancel editing
function cancelEdit() {
  isEditing.value = false;
}

// Save edit (update store)
function saveEdit() {
  // Basic validation 
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

  // Update booking
  bookingStore.updateBooking({
    ...editBooking.value,
    regNr: editBooking.value.regNr.toUpperCase(),
  });

  isEditing.value = false;
}

// Cancel booking
function cancelBooking(id) {
  const ok = confirm("Are you sure you want to cancel this booking?");
  if (!ok) return;

  bookingStore.cancelBooking(id);

  // Close details if we cancelled the selected one
  if (selectedBookingId.value === id) {
    selectedBookingId.value = null;
    isEditing.value = false;
  }
}

// Mark completed
function completeBooking(id) {
  const performedAction = prompt(
    "What was done? (Write a short text for history)",
    "Service completed"
  );

  // If user pressed cancel in prompt, don't do anything
  if (performedAction === null) return;

  bookingStore.completeBooking(id, performedAction);

  // Refresh detail view
  isEditing.value = false;
}

// Mark ongoing 
function markOngoing(id) {
  const booking = bookingStore.bookings.find((b) => b.id === id);
  if (!booking) return;

  bookingStore.updateBooking({
    ...booking,
    status: "ongoing",
  });

  isEditing.value = false;
}

// Clear filters
function clearFilters() {
  searchText.value = "";
  filterDate.value = "";
}
</script>

<template>
  <section>
    <h1>My Bookings</h1>

    <!-- Filters -->
    <div class="filters">
      <div class="filterField">
        <label>Search (email, regNr or booking id)</label>
        <input v-model="searchText" type="text" placeholder="example: ABC123 or name@mail.com" />
      </div>

      <div class="filterField">
        <label>Filter by date</label>
        <input v-model="filterDate" type="date" />
      </div>

      <button class="btn" type="button" @click="clearFilters">Clear</button>
    </div>

    <!-- Booking lists -->
    <div class="lists">
      <div class="listBox">
        <h2>Upcoming</h2>
        <p v-if="upcomingBookings.length === 0" class="small">No upcoming bookings.</p>
        <ul v-else>
          <li v-for="b in upcomingBookings" :key="b.id">
            <button class="linkBtn" @click="openDetails(b.id)">
              {{ b.id }} - {{ b.date }} {{ b.time }} - {{ b.regNr }} - {{ b.serviceType }}
            </button>
          </li>
        </ul>
      </div>

      <div class="listBox">
        <h2>Ongoing</h2>
        <p v-if="ongoingBookings.length === 0" class="small">No ongoing bookings.</p>
        <ul v-else>
          <li v-for="b in ongoingBookings" :key="b.id">
            <button class="linkBtn" @click="openDetails(b.id)">
              {{ b.id }} - {{ b.date }} {{ b.time }} - {{ b.regNr }} - {{ b.serviceType }}
            </button>
          </li>
        </ul>
      </div>

      <div class="listBox">
        <h2>Completed (History)</h2>
        <p v-if="completedBookings.length === 0" class="small">No completed bookings.</p>
        <ul v-else>
          <li v-for="b in completedBookings" :key="b.id">
            <button class="linkBtn" @click="openDetails(b.id)">
              {{ b.id }} - {{ b.date }} {{ b.time }} - {{ b.regNr }} - {{ b.serviceType }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Details panel -->
    <div v-if="selectedBooking" class="details">
      <h2>Booking Details</h2>

      <!-- View mode -->
      <div v-if="!isEditing">
        <p><strong>ID:</strong> {{ selectedBooking.id }}</p>
        <p><strong>Name:</strong> {{ selectedBooking.name }}</p>
        <p><strong>Email:</strong> {{ selectedBooking.email }}</p>
        <p><strong>Phone:</strong> {{ selectedBooking.phone }}</p>
        <p><strong>RegNr:</strong> {{ selectedBooking.regNr }}</p>
        <p><strong>Service:</strong> {{ selectedBooking.serviceType }}</p>
        <p><strong>Date/Time:</strong> {{ selectedBooking.date }} {{ selectedBooking.time }}</p>
        <p><strong>Status:</strong> {{ selectedBooking.status }}</p>

        <p v-if="selectedBooking.status === 'completed'">
          <strong>Performed action:</strong> {{ selectedBooking.performedAction }}
        </p>

        <div class="actions">
          <button class="btn" @click="startEdit" :disabled="selectedBooking.status === 'completed'">
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
            :disabled="selectedBooking.status === 'completed' || selectedBooking.status === 'cancelled'"
          >
            Mark completed
          </button>
        </div>
      </div>

      <!-- Edit mode -->
      <div v-else>
        <p class="small">(Editing booking {{ editBooking.id }})</p>

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
              <option v-for="s in serviceTypes" :key="s" :value="s">{{ s }}</option>
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

.filters {
  max-width: 900px;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 6px;
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
}

.lists {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.listBox {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
}

.linkBtn {
  border: none;
  background: transparent;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
}

.details {
  margin-top: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  max-width: 900px;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

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
</style>
