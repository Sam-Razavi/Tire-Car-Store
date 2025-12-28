import { defineStore } from "pinia";

// We load default bookings from a JSON file.
import initialBookings from "../data/bookings.json";

export const useBookingStore = defineStore("bookingStore", {
  state: () => ({

    bookings: [],

 
    message: "",
  }),

  getters: {

    sortedBookings(state) {
      return [...state.bookings].sort((a, b) => {
        const aDT = `${a.date} ${a.time}`;
        const bDT = `${b.date} ${b.time}`;
        return aDT.localeCompare(bDT);
      });
    },
  },

  actions: {
    // Load bookings from JSON when the app starts
    loadBookings() {
 
      this.bookings = initialBookings.map((b) => ({ ...b }));
    },


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

    // Cancel booking 
    cancelBooking(id) {
      const booking = this.bookings.find((b) => b.id === id);
      if (booking) {
        booking.status = "cancelled";
        this.message = "Booking cancelled (simulated).";
        alert(this.message);
      }
    },

    // Mark booking completed 
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
