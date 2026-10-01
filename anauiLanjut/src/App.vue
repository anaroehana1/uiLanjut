<script setup>
import Navbar from '@/components/app/Navbar.vue'
</script>

<template>
  <div class="app-shell">
    <Navbar />
    <main class="page-shell">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #0f1221;
  color: #fff;
}

.page-shell {
  max-width: 1440px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
}
</style>