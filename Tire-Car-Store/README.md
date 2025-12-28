# Tire & Car Service – Booking System 🚗

This project is a simple web-based booking system for car and tire services.  
It was developed as part of the course **Applikationsutveckling för webben**.

The goal of the project is to demonstrate how to build a small but complete
Vue application with routing, state management, and basic CRUD functionality.

---

## 📌 Features

- Book car and tire services online
- Choose service type, date, and time
- Prevent double booking of time slots
- View all bookings in a clear overview
- Search bookings by email, registration number, or booking ID
- Filter bookings by date
- Edit existing bookings
- Cancel bookings
- Mark bookings as ongoing or completed
- Save performed actions for completed services (history)
- Responsive and simple UI

---

## 🛠 Technologies Used

- **Vue 3** (Composition API)
- **Vue Router** – page navigation
- **Pinia** – state management
- **HTML / CSS**
- **JavaScript**
- JSON file for initial data (simulated backend)

---

## 📂 Project Structure

```text
src/
│── assets/
│   └── main.css
│
│── data/
│   └── bookings.json
│
│── stores/
│   └── bookingStore.js
│
│── views/
│   ├── HomeView.vue
│   ├── BookServiceView.vue
│   ├── MyBookingsView.vue
│   └── AboutView.vue
│
│── App.vue
│── main.js
│── router/
│   └── index.js
