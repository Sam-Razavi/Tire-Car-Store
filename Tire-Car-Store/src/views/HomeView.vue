<template>
  <section class="home">
    <div class="hero">
      <img src="../assets/hero.png" alt="Car service workshop" />
      <div class="heroText">
        <h1>Tire & Car Service</h1>
        <p>
          Book your car service easily online.
          Choose service type, date and time in just a few clicks.
        </p>
      </div>
    </div>

    <div class="intro card">
      <h2>Our Services</h2>
      <ul>
        <li>Oil change</li>
        <li>Brake adjustment</li>
        <li>Full service</li>
        <li>Tire change</li>
      </ul>

      <p>
        Use the menu above to book a service or manage your bookings.
      </p>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  max-height: 360px;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heroText {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 14px;
  border-radius: 8px;
  max-width: 420px;
}

.heroText h1 {
  margin: 0 0 6px 0;
}

.heroText p {
  margin: 0;
  font-size: 14px;
}

.intro ul {
  padding-left: 18px;
}
</style>
