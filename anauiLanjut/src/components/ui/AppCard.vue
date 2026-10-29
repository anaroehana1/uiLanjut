
<template>
  <div class="app-card">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgb(28 25 72 / 5%);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.app-card:hover {
  box-shadow: 0 8px 24px rgb(28 25 72 / 8%);
}
</style>
