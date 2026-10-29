
<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Cari acara berdasarkan nama...',
  },
})

defineEmits(['update:modelValue', 'search', 'clear'])
</script>

<template>
  <form class="search-bar" role="search" @submit.prevent="$emit('search')">
    <span class="search-icon" aria-hidden="true">⌕</span>

    <input
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      aria-label="Cari acara"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <button
      v-if="modelValue"
      type="button"
      class="clear-button"
      aria-label="Hapus pencarian"
      @click="$emit('update:modelValue', ''); $emit('clear')"
    >
      ×
    </button>

    <button type="submit" class="search-button">
      Cari
    </button>
  </form>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 8px 7px 14px;
  box-sizing: border-box;
  border: 1px solid #d4d4d8;
  border-radius: 12px;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-bar:focus-within {
  border-color: #5145cd;
  box-shadow: 0 0 0 3px rgb(81 69 205 / 10%);
}

.search-icon {
  flex-shrink: 0;
  color: #71717a;
  font-size: 27px;
  line-height: 1;
}

.search-bar input {
  flex: 1;
  width: 0;
  min-width: 0;
  padding: 8px 0;
  border: none;
  outline: none;
  background: transparent;
  color: #27272a;
  font: inherit;
  font-size: 14px;
}

.search-bar input::placeholder {
  color: #a1a1aa;
}

.clear-button {
  flex-shrink: 0;
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: #71717a;
  font-size: 22px;
  cursor: pointer;
}

.search-button {
  flex-shrink: 0;
  padding: 10px 17px;
  border: none;
  border-radius: 8px;
  background: #5145cd;
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.search-button:hover {
  background: #4338b5;
}

@media (max-width: 420px) {
  .search-bar {
    gap: 7px;
    padding-left: 10px;
  }

  .search-button {
    padding: 10px 12px;
  }
}
</style>
