
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['app-button', `app-button--${variant}`, { 'is-loading': loading }]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="button-spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) =>
      ['primary', 'secondary', 'danger', 'outline', 'ghost'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.app-button--primary {
  background: #5145cd;
  color: #ffffff;
}

.app-button--primary:hover:not(:disabled) {
  background: #4338b5;
}

.app-button--secondary {
  background: #f3f4f6;
  color: #27272a;
  border-color: #e4e4e7;
}

.app-button--secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.app-button--danger {
  background: #dc2626;
  color: #ffffff;
}

.app-button--danger:hover:not(:disabled) {
  background: #b91c1c;
}

.app-button--outline {
  background: transparent;
  color: #5145cd;
  border-color: #5145cd;
}

.app-button--outline:hover:not(:disabled) {
  background: #f5f3ff;
}

.app-button--ghost {
  background: transparent;
  color: #52525b;
}

.app-button--ghost:hover:not(:disabled) {
  background: #f4f4f5;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
