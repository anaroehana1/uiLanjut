
<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'All',
  },
  categories: {
    type: Array,
    default: () => [
      'All',
      'Workshop',
      'Meetup',
      'Competition',
      'Seminar',
      'Conference',
    ],
  },
})

defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <div class="category-filter">
    <span class="filter-label">Kategori:</span>

    <div class="category-options">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        :class="[
          'category-option',
          { 'is-active': modelValue === category },
        ]"
        :aria-pressed="modelValue === category"
        @click="
          $emit('update:modelValue', category);
          $emit('change', category)
        "
      >
        {{ category === 'All' ? 'Semua' : category }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.filter-label {
  color: #52525b;
  font-size: 13px;
  font-weight: 600;
}

.category-options {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.category-option {
  padding: 9px 15px;
  border: 1px solid #e4e4e7;
  border-radius: 50px;
  background: #ffffff;
  color: #52525b;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.category-option:hover {
  border-color: #a78bfa;
  color: #5145cd;
}

.category-option.is-active {
  border-color: #5145cd;
  background: #5145cd;
  color: #ffffff;
}

.category-option:focus-visible {
  outline: 2px solid #a78bfa;
  outline-offset: 3px;
}
</style>
