<template>
  <nav class="breadcrumb">
    <ul>
      <li v-for="(item, index) in breadcrumbs" :key="index">
        <router-link v-if="index !== breadcrumbs.length - 1" :to="item.path">
          {{ item.name }}
        </router-link>

        <span v-else class="active-crumb">
          {{ item.name }}
        </span>

        <span v-if="index !== breadcrumbs.length - 1" class="separator"> / </span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)

  return [
    {
      name: 'Home',
      path: '/',
    },
    ...paths.map((path, index) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + paths.slice(0, index + 1).join('/'),
    })),
  ]
})
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.breadcrumb ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb a {
  text-decoration: none;
  color: var(--primary, #6644ff);
  font-weight: 500;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: #888;
  margin: 0 0.5rem;
}

.active-crumb {
  color: #333;
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  .active-crumb {
    color: #ccc;
  }
}
</style>