<template>
  <div class="category-page">
    <h2 class="section-title">Explore by Category</h2>
    <div class="category-grid">
      <div class="category-card" v-for="(cat, index) in categories" :key="index">
        <div class="cat-icon">{{ cat.icon }}</div>
        <h3>{{ cat.name }}</h3>
        <p>{{ cat.count }} Events</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { name: 'Music & Concerts', icon: '🎵', count: 24 },
  { name: 'Technology', icon: '💻', count: 18 },
  { name: 'Art & Design', icon: '🎨', count: 12 },
  { name: 'Business', icon: '💼', count: 30 },
  { name: 'Health & Wellness', icon: '🧘', count: 15 },
  { name: 'Food & Drink', icon: '🍕', count: 22 }
];
</script>