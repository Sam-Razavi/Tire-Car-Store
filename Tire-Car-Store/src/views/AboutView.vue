<template>
  <!-- About-sidan (kort info om appen och företaget) -->
  <section class="about card">
    <h1>About Us</h1>

    <!-- En lite viktigare intro-text -->
    <p class="lead">
      We provide reliable and professional car and tire services,
      making it easy for customers to book and manage their service appointments online.
    </p>

    <!-- Mer detaljer om vad som finns för tjänster -->
    <p>
      Our workshop offers a range of services including oil changes,
      brake adjustments, full vehicle service, and tire changes.
      With our booking system, you can quickly choose a service,
      select an available time, and keep track of your bookings.
    </p>

    <!-- Fokus på vad appen försöker göra (enkelt och smidigt) -->
    <p>
      We focus on simplicity, efficiency, and a smooth customer experience,
      allowing you to manage your car service with just a few clicks.
    </p>

    <!-- Liten notis om att detta är för kursen -->
    <p class="note">
      This application was developed as part of a course project in
      <em>Applikationsutveckling för webben</em>.
    </p>
  </section>
</template>

<style scoped>
/* Begränsar bredden så texten inte blir för bred att läsa */
.about {
  max-width: 760px;
}

/* Introtexten ska synas lite mer */
.lead {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

/* Notisen längst ner ska vara mindre och lite “diskret” */
.note {
  margin-top: 18px;
  font-size: 13px;
  color: #666;
}
</style>
