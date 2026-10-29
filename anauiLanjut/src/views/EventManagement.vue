
<script setup>
import { useEvents } from '../composables/useEvents'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import OrganizerEventCard from '../components/event/OrganizerEventCard.vue'
import EventCreateForm from '../components/event/EventCreateForm.vue'

const router = useRouter()

const {
  activeEvents,
  completedEvents,
  createEvent,
  completeEvent,
  deleteEvent,
} = useEvents()

const showCreateForm = ref(false)
const notice = ref('')

function handleCreateEvent(eventData) {
  createEvent(eventData)
  showCreateForm.value = false
  notice.value = 'Acara berhasil ditambahkan.'
}

function handleCompleteEvent(event) {
  const confirmed = window.confirm(
    `Yakin ingin menandai "${event.title}" sebagai acara selesai?`
  )

  if (!confirmed) return

  completeEvent(event.id)
  notice.value = 'Status acara berhasil diperbarui.'
}

function handleDeleteEvent(event) {
  const confirmed = window.confirm(
    `Yakin ingin menghapus acara "${event.title}"? Pendaftaran terkait juga akan dihapus.`
  )

  if (!confirmed) return

  deleteEvent(event.id)
  notice.value = 'Acara berhasil dihapus.'
}

function handleViewDetail(id) {
  router.push({
    name: 'event-detail',
    params: { id },
  })
}
</script>

<template>
  <main class="management-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">GATHERLY ORGANIZER</p>
        <h1>Event Management</h1>
        <p class="page-description">
          Kelola acara, pantau status, dan publikasikan acara baru.
        </p>
      </div>

      <button
        class="create-button"
        type="button"
        @click="showCreateForm = !showCreateForm"
      >
        {{ showCreateForm ? 'Tutup Formulir' : '+ Buat Acara' }}
      </button>
    </header>

    <p v-if="notice" class="notice" role="status">
      {{ notice }}
      <button type="button" @click="notice = ''">Tutup</button>
    </p>

    <section v-if="showCreateForm" class="create-section">
      <EventCreateForm
        @submit="handleCreateEvent"
        @cancel="showCreateForm = false"
      />
    </section>

    <section class="event-section">
      <div class="section-heading">
        <div>
          <h2>Acara Aktif</h2>
          <p>Acara yang masih dikelola oleh panitia.</p>
        </div>

        <span class="count-badge">{{ activeEvents.length }}</span>
      </div>

      <div v-if="activeEvents.length" class="event-grid">
        <OrganizerEventCard
          v-for="event in activeEvents"
          :key="event.id"
          :event="event"
          @view-detail="handleViewDetail"
          @complete="handleCompleteEvent"
          @delete="handleDeleteEvent"
        />
      </div>

      <div v-else class="empty-state">
        <span class="empty-icon">📅</span>
        <h3>Belum ada acara aktif</h3>
        <p>
          Klik tombol Buat Acara untuk menambahkan acara baru.
        </p>
      </div>
    </section>

    <section class="event-section">
      <div class="section-heading">
        <div>
          <h2>Arsip Acara</h2>
          <p>Daftar acara yang sudah ditandai selesai.</p>
        </div>

        <span class="count-badge count-badge--muted">
          {{ completedEvents.length }}
        </span>
      </div>

      <div v-if="completedEvents.length" class="event-grid">
        <OrganizerEventCard
          v-for="event in completedEvents"
          :key="event.id"
          :event="event"
          :is-completed="true"
          @view-detail="handleViewDetail"
          @delete="handleDeleteEvent"
        />
      </div>

      <div v-else class="empty-state">
        <span class="empty-icon">🗂️</span>
        <h3>Arsip masih kosong</h3>
        <p>Acara yang selesai akan ditampilkan di sini.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.management-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #5145cd;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.page-header h1 {
  margin: 0 0 10px;
  color: #18181b;
  font-size: clamp(26px, 4vw, 36px);
}

.page-description,
.section-heading p {
  margin: 0;
  color: #71717a;
  font-size: 14px;
  line-height: 1.6;
}

.create-button {
  padding: 12px 18px;
  border: 0;
  border-radius: 10px;
  background: #5145cd;
  color: #ffffff;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.create-button:hover {
  background: #4338b5;
}

.notice {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 14px 16px;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  background: #f0fdf4;
  color: #166534;
  font-size: 14px;
}

.notice button {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.create-section {
  margin-bottom: 36px;
}

.event-section {
  margin-top: 36px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 0 0 6px;
  color: #27272a;
  font-size: 22px;
}

.count-badge {
  display: inline-flex;
  min-width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  box-sizing: border-box;
  border-radius: 50px;
  background: #ede9fe;
  color: #5145cd;
  font-size: 13px;
  font-weight: 700;
}

.count-badge--muted {
  background: #f4f4f5;
  color: #52525b;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 20px;
}

.empty-state {
  padding: 40px 20px;
  border: 1px dashed #d4d4d8;
  border-radius: 14px;
  background: #fafafa;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
}

.empty-state h3 {
  margin: 14px 0 8px;
  color: #27272a;
  font-size: 17px;
}

.empty-state p {
  margin: 0;
  color: #71717a;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 700px) {
  .management-page {
    padding: 24px 16px 36px;
  }

  .event-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    align-items: flex-start;
  }
}
</style>
