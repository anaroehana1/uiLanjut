<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' },
});
</script>

<template>
  <button :type="type" :class="['app-button', `app-button--${variant}`]">
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s;
}

.app-button--primary {
  color: white;
  background: #6644ff;
  box-shadow: 0 5px 12px rgba(102, 68, 255, 0.25);
}

.app-button--primary:hover {
  background: #5533ee;
  transform: translateY(-1px);
}
</style>
