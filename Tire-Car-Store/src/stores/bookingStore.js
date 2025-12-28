import { defineStore } from "pinia";

// Importerar startbokningar från en JSON-fil
// Detta används för att ha data direkt när appen laddas
import initialBookings from "../data/bookings.json";

export const useBookingStore = defineStore("bookingStore", {
  state: () => ({
    // Alla bokningar lagras här medan appen körs
    bookings: [],

    // Ett enkelt meddelande som kan visas (t.ex. alert)
    message: "",
  }),

  getters: {
    // Returnerar bokningar sorterade efter datum och tid
    // Jag gör en kopia så att original-listan inte ändras
    sortedBookings(state) {
      return [...state.bookings].sort((a, b) => {
        const aDT = `${a.date} ${a.time}`;
        const bDT = `${b.date} ${b.time}`;
        return aDT.localeCompare(bDT);
      });
    },

    // Kollar om en viss datum + tid redan är bokad
    // Avbokade tider räknas inte
    // ignoreId används när man redigerar en bokning
    isSlotTaken: (state) => {
      return (date, time, ignoreId = null) => {
        return state.bookings.some((b) => {
          // Ignorera bokningen man själv redigerar
          if (ignoreId && b.id === ignoreId) return false;

          // Avbokade bokningar ska inte blockera tider
          if (b.status === "cancelled") return false;

          return b.date === date && b.time === time;
        });
      };
    },
  },

  actions: {
    // Returnerar en kort beskrivning (på engelska) baserat på serviceType
    // Detta används för att visa "what will happen" i bokningsdetaljerna
    getServiceDescription(serviceType) {
      // En enkel "student" lösning med if-satser
      if (serviceType === "Oil change") {
        return "Oil and filter replacement, including basic fluid checks.";
      }
      if (serviceType === "Brake adjustment") {
        return "Brake inspection and adjustment, including safety check.";
      }
      if (serviceType === "Full service") {
        return "Full vehicle service including inspection and basic maintenance checks.";
      }
      if (serviceType === "Tire change") {
        return "Tire change including pressure check and visual inspection.";
      }

      // Om något oväntat värde kommer in
      return "Service will be performed according to the selected booking type.";
    },

    // Laddar bokningar från JSON-filen när appen startar
    loadBookings() {
      // Kopierar objekten så vi inte ändrar direkt i JSON-importen
      // Här ser jag även till att alla bokningar har en description (om JSON saknar det)
      this.bookings = initialBookings.map((b) => {
        return {
          ...b,
          // Om description saknas i JSON, sätt en baserat på serviceType
          description:
            b.description && b.description.trim() !== ""
              ? b.description
              : this.getServiceDescription(b.serviceType),
        };
      });
    },

    // Skapar ett enkelt boknings-id (t.ex. B001, B002)
    generateId() {
      const number = this.bookings.length + 1;
      return "B" + String(number).padStart(3, "0");
    },

    // Lägger till en ny bokning
    addBooking(newBooking) {
      const bookingToAdd = {
        ...newBooking,
        id: this.generateId(),
        status: "upcoming",
        performedAction: "",

        // Sätter description automatiskt så vi uppfyller kravet "what will happen"
        description: this.getServiceDescription(newBooking.serviceType),
      };

      this.bookings.push(bookingToAdd);

      // Simulerar att bokningen sparas
      this.message = "Booking saved (simulated).";
      alert(this.message);
    },

    // Uppdaterar en bokning baserat på id
    updateBooking(updatedBooking) {
      const index = this.bookings.findIndex((b) => b.id === updatedBooking.id);
      if (index !== -1) {
        // Om någon bokning saknar description, sätt den baserat på serviceType
        // (t.ex. om man redigerar gammal data)
        const fixedBooking = {
          ...updatedBooking,
          description:
            updatedBooking.description && updatedBooking.description.trim() !== ""
              ? updatedBooking.description
              : this.getServiceDescription(updatedBooking.serviceType),
        };

        this.bookings[index] = fixedBooking;

        this.message = "Booking updated (simulated).";
        alert(this.message);
      }
    },

    // Avbokar en bokning (vi tar inte bort den, bara ändrar status)
    cancelBooking(id) {
      const booking = this.bookings.find((b) => b.id === id);
      if (booking) {
        booking.status = "cancelled";
        this.message = "Booking cancelled (simulated).";
        alert(this.message);
      }
    },

    // Markerar bokning som klar och sparar vad som gjordes
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
