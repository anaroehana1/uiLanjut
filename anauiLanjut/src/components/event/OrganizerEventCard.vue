
<script setup>
import AppCard from '../ui/AppCard.vue'

defineProps({
  event: {
    type: Object,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['view-detail', 'complete', 'delete'])
</script>

<template>
  <AppCard
    :class="[
      'organizer-event-card',
      { 'card-completed': isCompleted },
    ]"
  >
    <div class="card-header">
      <span class="category-badge">
        {{ event.cat || 'Event' }}
      </span>

      <span
        :class="[
          'status-badge',
          isCompleted ? 'status-completed' : 'status-active',
        ]"
      >
        {{ isCompleted ? 'Completed' : 'Active' }}
      </span>
    </div>

    <h3
      :class="[
        'event-title',
        { 'text-strike': isCompleted },
      ]"
    >
      {{ event.title }}
    </h3>

    <p class="event-meta">
      📅 {{ event.date || 'Tanggal belum tersedia' }}
      &nbsp; | &nbsp;
      📍 {{ event.loc || 'Lokasi belum tersedia' }}
    </p>

    <p class="event-desc">
      {{ event.desc || 'Tidak ada deskripsi acara.' }}
    </p>

    <div v-if="isCompleted" class="completed-notice">
      🔒 Acara ini telah selesai dan diarsipkan dari katalog publik.
    </div>

    <div class="card-actions">
      <template v-if="!isCompleted">
        <button
          type="button"
          class="btn-action btn-detail"
          @click="$emit('view-detail', event.id)"
        >
          Lihat Detail
        </button>

        <button
          type="button"
          class="btn-action btn-complete"
          @click="$emit('complete', event)"
        >
          Selesaikan
        </button>

        <button
          type="button"
          class="btn-action btn-delete"
          @click="$emit('delete', event)"
        >
          Hapus
        </button>
      </template>

      <template v-else>
        <button
          type="button"
          class="btn-action btn-delete"
          @click="$emit('delete', event)"
        >
          Hapus dari Arsip
        </button>
      </template>
    </div>
  </AppCard>
</template>

<style scoped>
.organizer-event-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.category-badge,
.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
}

.category-badge {
  background: #ede9fe;
  color: #5145cd;
  text-transform: uppercase;
}

.status-active {
  background: #dcfce7;
  color: #15803d;
}

.status-completed {
  background: #e4e4e7;
  color: #52525b;
}

.event-title {
  margin: 0 0 12px;
  color: #27272a;
  font-size: 22px;
  line-height: 1.4;
}

.text-strike {
  color: #a1a1aa;
  text-decoration: line-through;
}

.card-completed {
  background: #fafafa;
  opacity: 0.9;
}

.event-meta {
  margin: 0 0 12px;
  color: #71717a;
  font-size: 13px;
  line-height: 1.7;
}

.event-desc {
  flex-grow: 1;
  margin: 0 0 20px;
  color: #52525b;
  font-size: 14px;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.completed-notice {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #f4f4f5;
  color: #52525b;
  font-size: 12px;
  line-height: 1.6;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e4e4e7;
}

.btn-action {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #ffffff;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detail {
  border-color: #5145cd;
  color: #5145cd;
}

.btn-detail:hover {
  background: #5145cd;
  color: #ffffff;
}

.btn-complete {
  border-color: #86efac;
  color: #15803d;
}

.btn-complete:hover {
  background: #15803d;
  color: #ffffff;
}

.btn-delete {
  border-color: #fecaca;
  color: #dc2626;
}

.btn-delete:hover {
  background: #dc2626;
  color: #ffffff;
}

@media (max-width: 480px) {
  .organizer-event-card {
    padding: 18px;
  }

  .btn-action {
    flex-basis: 100%;
  }
}
</style>
