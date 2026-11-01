
<script setup>
import { useEvents } from '../composables/useEvents'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

import OrganizerEventCard from '../components/event/OrganizerEventCard.vue'
import EventCreateForm from '../components/event/EventCreateForm.vue'

const router = useRouter()

const {
  activeEvents,
  completedEvents,
  createEvent,
  completeEvent,
  deleteEvent,
  fetchEvents,
  loading,
  error,
} = useEvents()

const notice = ref('')
const noticeType = ref('success')
const eventForm = ref(null)
const isSubmitting = ref(false)
const activeTab = ref('active')

// Mengambil data acara dari REST API saat halaman dibuka
onMounted(async () => {
  await fetchEvents()

  if (error.value) {
    notice.value = error.value
    noticeType.value = 'error'
  }
})

async function refreshEvents() {
  notice.value = ''
  await fetchEvents()

  if (error.value) {
    notice.value = error.value
    noticeType.value = 'error'
  }
}

// Menambahkan acara melalui REST API
async function handleCreateEvent(eventData) {
  isSubmitting.value = true
  notice.value = ''
  noticeType.value = 'success'

  try {
    await createEvent(eventData)

    eventForm.value?.handleSuccess()

    activeTab.value = 'active'
    notice.value = 'Acara berhasil ditambahkan ke server.'
  } catch (err) {
    const message = err.message || 'Gagal menambahkan acara.'
    eventForm.value?.handleError(message)
    notice.value = message
    noticeType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

// Menandai acara selesai melalui REST API
async function handleCompleteEvent(event) {
  const confirmed = window.confirm(
    `Yakin ingin menandai "${event.title}" sebagai acara selesai?`
  )

  if (!confirmed) return

  try {
    await completeEvent(event.id)
    notice.value = 'Status acara berhasil diperbarui.'
    noticeType.value = 'success'
  } catch (err) {
    notice.value = err.message || 'Gagal memperbarui status acara.'
    noticeType.value = 'error'
  }
}

// Menghapus acara melalui REST API
async function handleDeleteEvent(event) {
  const confirmed = window.confirm(
    `Yakin ingin menghapus acara "${event.title}"? Pendaftaran terkait juga akan dihapus.`
  )

  if (!confirmed) return

  try {
    await deleteEvent(event.id)
    notice.value = 'Acara berhasil dihapus.'
    noticeType.value = 'success'
  } catch (err) {
    notice.value = err.message || 'Gagal menghapus acara.'
    noticeType.value = 'error'
  }
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
        @click="activeTab = 'create'"
      >
        + Buat Acara
      </button>
    </header>

    <p
      v-if="notice"
      :class="['notice', `notice--${noticeType}`]"
      :role="noticeType === 'error' ? 'alert' : 'status'"
    >
      {{ notice }}
      <button type="button" @click="notice = ''">Tutup</button>
    </p>

    <nav class="management-tabs" aria-label="Pengelolaan acara">
      <button
        type="button"
        :class="['management-tab', { 'is-active': activeTab === 'active' }]"
        :aria-pressed="activeTab === 'active'"
        @click="activeTab = 'active'"
      >
        ● Acara Aktif <span>{{ activeEvents.length }}</span>
      </button>
      <button
        type="button"
        :class="['management-tab', { 'is-active': activeTab === 'create' }]"
        :aria-pressed="activeTab === 'create'"
        @click="activeTab = 'create'"
      >
        + Buat Acara
      </button>
      <button
        type="button"
        :class="['management-tab', { 'is-active': activeTab === 'completed' }]"
        :aria-pressed="activeTab === 'completed'"
        @click="activeTab = 'completed'"
      >
        ■ Acara Selesai <span>{{ completedEvents.length }}</span>
      </button>
      <button
        class="refresh-button"
        type="button"
        :disabled="loading"
        @click="refreshEvents"
      >
        {{ loading ? 'Memuat...' : 'Muat Ulang' }}
      </button>
    </nav>

    <p v-if="loading" class="loading-message" role="status">
      Sedang mengambil data acara dari server...
    </p>

    <section v-if="activeTab === 'create'" class="create-section">
      <EventCreateForm
        ref="eventForm"
        :loading="isSubmitting"
        @submit="handleCreateEvent"
        @cancel="activeTab = 'active'"
      />
    </section>

    <section v-if="activeTab === 'active'" class="event-section">
      <div class="section-heading">
        <div>
          <h2>Acara Aktif</h2>
          <p>Acara yang masih dikelola oleh panitia.</p>
        </div>

        <span class="count-badge">{{ activeEvents.length }}</span>
      </div>

      <div v-if="activeEvents.length && !loading" class="event-grid">
        <OrganizerEventCard
          v-for="event in activeEvents"
          :key="event.id"
          :event="event"
          @view-detail="handleViewDetail"
          @complete="handleCompleteEvent"
          @delete="handleDeleteEvent"
        />
      </div>

      <div v-else-if="!loading" class="empty-state">
        <span class="empty-icon">📅</span>
        <h3>Belum ada acara aktif</h3>
        <p>
          Klik tombol Buat Acara untuk menambahkan acara baru.
        </p>
        <button class="create-button" type="button" @click="activeTab = 'create'">
          + Buat Acara
        </button>
      </div>
    </section>

    <section v-if="activeTab === 'completed'" class="event-section">
      <div class="section-heading">
        <div>
          <h2>Arsip Acara</h2>
          <p>Daftar acara yang sudah ditandai selesai.</p>
        </div>

        <span class="count-badge count-badge--muted">
          {{ completedEvents.length }}
        </span>
      </div>

      <div v-if="completedEvents.length && !loading" class="event-grid">
        <OrganizerEventCard
          v-for="event in completedEvents"
          :key="event.id"
          :event="event"
          :is-completed="true"
          @view-detail="handleViewDetail"
          @delete="handleDeleteEvent"
        />
      </div>

      <div v-else-if="!loading" class="empty-state">
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

.notice--error {
  border-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.notice button {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.management-tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px solid #e4e4e7;
}

.management-tab,
.refresh-button {
  padding: 11px 14px;
  border: 0;
  border-radius: 8px 8px 0 0;
  background: transparent;
  color: #71717a;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.management-tab span {
  margin-left: 4px;
  color: inherit;
  opacity: 0.75;
}

.management-tab.is-active {
  border-bottom: 2px solid #6644ff;
  color: #5145cd;
}

.refresh-button {
  margin-left: auto;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  background: #ffffff;
  color: #52525b;
}

.refresh-button:hover:not(:disabled) {
  border-color: #c4b5fd;
  color: #5145cd;
}

.refresh-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.loading-message {
  margin: 18px 0 0;
  color: #71717a;
  font-size: 14px;
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

  .refresh-button {
    margin-left: 0;
  }
}
</style>
