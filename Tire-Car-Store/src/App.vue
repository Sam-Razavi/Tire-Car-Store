<template>
  <div class="app">
    <header class="header">
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/book-service">Book Service</RouterLink>
        <RouterLink to="/my-bookings">My Bookings</RouterLink>
        <RouterLink to="/about">About Us</RouterLink>
      </nav>
    </header>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.header {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
}

.nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.nav a {
  text-decoration: none;
}

.nav a.router-link-active {
  font-weight: 700;
  text-decoration: underline;
}

.main {
  padding: 16px;
}
</style>
