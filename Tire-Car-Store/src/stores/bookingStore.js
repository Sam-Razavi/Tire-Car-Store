import { defineStore } from "pinia";

// Load default bookings from a JSON file.
import initialBookings from "../data/bookings.json";

export const useBookingStore = defineStore("bookingStore", {
  state: () => ({
    // All bookings are stored here while the app runs
    bookings: [],

    // Simple message we can show/alert
    message: "",
  }),

  getters: {
    // Return bookings sorted by date+time (simple sorting)
    sortedBookings(state) {
      return [...state.bookings].sort((a, b) => {
        const aDT = `${a.date} ${a.time}`;
        const bDT = `${b.date} ${b.time}`;
        return aDT.localeCompare(bDT);
      });
    },

    // Check if a date+time slot is already taken (ignore cancelled bookings)
    // ignoreId is used when editing (so the booking doesn't conflict with itself)
    isSlotTaken: (state) => {
      return (date, time, ignoreId = null) => {
        return state.bookings.some((b) => {
          if (ignoreId && b.id === ignoreId) return false;
          if (b.status === "cancelled") return false;
          return b.date === date && b.time === time;
        });
      };
    },
  },

  actions: {
    // Load bookings from JSON when the app starts
    loadBookings() {
      // Copy so we don't directly mutate the imported JSON object
      this.bookings = initialBookings.map((b) => ({ ...b }));
    },

    // Generate a simple booking id 
    generateId() {
      const number = this.bookings.length + 1;
      return "B" + String(number).padStart(3, "0");
    },

    // Add new booking
    addBooking(newBooking) {
      const bookingToAdd = {
        ...newBooking,
        id: this.generateId(),
        status: "upcoming",
        performedAction: "",
      };

      this.bookings.push(bookingToAdd);

      // Simulate saving to JSON 
      this.message = "Booking saved (simulated).";
      alert(this.message);
    },

    // Update booking by id
    updateBooking(updatedBooking) {
      const index = this.bookings.findIndex((b) => b.id === updatedBooking.id);
      if (index !== -1) {
        this.bookings[index] = { ...updatedBooking };

        this.message = "Booking updated (simulated).";
        alert(this.message);
      }
    },

    // Cancel booking (we keep it but mark it as cancelled)
    cancelBooking(id) {
      const booking = this.bookings.find((b) => b.id === id);
      if (booking) {
        booking.status = "cancelled";
        this.message = "Booking cancelled (simulated).";
        alert(this.message);
      }
    },

    // Mark booking completed and save performed action (history)
    completeBooking(id, performedAction) {
      const booking = this.bookings.find((b) => b.id === id);
      if (booking) {
        booking.status = "completed";
        booking.performedAction = performedAction || "Completed service";
        this.message = "Booking marked as completed (simulated).";
        alert(this.message);
      }
    },
  },
});
