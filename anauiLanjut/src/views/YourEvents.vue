
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useEvents } from '../composables/useEvents'
import AppCard from '../components/ui/AppCard.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppModal from '../components/ui/AppModal.vue'

const router = useRouter()

const {
  userRegistrations,
  cancelRegistration,
  getEventById,
  events,
} = useEvents()

const activeRegistrations = computed(() =>
  userRegistrations.value.filter((registration) =>
    events.value.some((event) => event.id === registration.eventId)
  )
)

function isEventDone(eventId) {
  const event = getEventById(eventId)
  return event ? event.done : false
}

const isCancelModalOpen = ref(false)
const eventToCancel = ref(null)

function handleOpenCancelModal(eventId) {
  eventToCancel.value = eventId
  isCancelModalOpen.value = true
}

function handleConfirmCancel() {
  if (eventToCancel.value !== null) {
    cancelRegistration(eventToCancel.value)
  }

  isCancelModalOpen.value = false
  eventToCancel.value = null
}

function handleCloseCancelModal() {
  isCancelModalOpen.value = false
  eventToCancel.value = null
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
</script>

<template>
  <main class="your-events-container">
    <header class="page-header">
      <h1 class="page-title">Your Events</h1>
      <p class="page-desc">
        Review your confirmed event registrations and view official digital passes.
      </p>
    </header>

    <section
      v-if="activeRegistrations.length === 0"
      class="empty-state"
    >
      <span class="empty-icon">🎟️</span>
      <span class="empty-badge">NO REGISTRATIONS</span>

      <h2>No Tickets Yet</h2>

      <p>
        You have not registered for an event yet. Browse the catalog to find
        workshops, seminars, and other events.
      </p>

      <AppButton
        variant="primary"
        @click="router.push({ name: 'events' })"
      >
        Browse Events
      </AppButton>
    </section>

    <section v-else class="tickets-grid">
      <AppCard
        v-for="item in activeRegistrations"
        :key="item.id"
        class="ticket-summary-card"
      >
        <div class="card-top">
          <div class="top-left">
            <span class="category-tag">
              {{ item.eventCat || 'Event' }}
            </span>

            <span
              :class="[
                'lifecycle-tag',
                isEventDone(item.eventId)
                  ? 'tag-concluded'
                  : 'tag-upcoming',
              ]"
            >
              {{ isEventDone(item.eventId) ? 'COMPLETED' : 'UPCOMING' }}
            </span>
          </div>

          <span class="booking-tag">
            {{ item.bookingCode }}
          </span>
        </div>

        <h2 class="card-event-title">
          {{ item.eventTitle }}
        </h2>

        <div class="card-meta">
          <div class="meta-row">
            <span>Date</span>
            <strong>{{ formatDate(item.eventDate) }}</strong>
          </div>

          <div class="meta-row">
            <span>Location</span>
            <strong>{{ item.eventLoc || '-' }}</strong>
          </div>

          <div class="meta-row">
            <span>Attendee</span>
            <strong>{{ item.fullname }}</strong>
          </div>
        </div>

        <div class="card-bottom">
          <button
            type="button"
            class="btn-view-ticket"
            @click="
              router.push({
                name: 'ticket-receipt',
                params: { id: item.eventId },
              })
            "
          >
            View Ticket Details →
          </button>

          <button
            v-if="!isEventDone(item.eventId)"
            type="button"
            class="btn-subtle-cancel"
            @click="handleOpenCancelModal(item.eventId)"
          >
            Cancel
          </button>

          <span v-else class="tag-archived-label">
            Archived
          </span>
        </div>
      </AppCard>
    </section>

    <AppModal
      v-model="isCancelModalOpen"
      title="Batalkan Pendaftaran?"
      :show-close="true"
      :show-cancel="true"
      :show-confirm="true"
      cancel-text="Pertahankan Tiket"
      confirm-text="Ya, Batalkan"
      confirm-variant="danger"
      @confirm="handleConfirmCancel"
      @cancel="handleCloseCancelModal"
    >
      <p class="modal-message">
        Yakin ingin membatalkan pendaftaran? Kuota acara akan dikembalikan
        jika pembatalan berhasil.
      </p>
    </AppModal>
  </main>
</template>

<style scoped>
.your-events-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  margin: 0 0 8px;
  color: #27272a;
  font-size: 32px;
}

.page-desc {
  margin: 0;
  color: #71717a;
  font-size: 14px;
  line-height: 1.7;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  border: 1px dashed #d4d4d8;
  border-radius: 16px;
  background: #ffffff;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
  font-size: 42px;
}

.empty-badge {
  margin-bottom: 12px;
  padding: 5px 10px;
  border-radius: 50px;
  background: #f4f4f5;
  color: #71717a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
}

.empty-state h2 {
  margin: 0 0 10px;
  color: #27272a;
  font-size: 23px;
}

.empty-state p {
  max-width: 500px;
  margin: 0 0 24px;
  color: #71717a;
  font-size: 14px;
  line-height: 1.7;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  align-items: stretch;
  gap: 22px;
}

.ticket-summary-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 22px;
}

.top-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag,
.lifecycle-tag {
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
}

.category-tag {
  background: #ede9fe;
  color: #5145cd;
  text-transform: uppercase;
}

.lifecycle-tag {
  letter-spacing: 0.5px;
}

.tag-upcoming {
  background: #dbeafe;
  color: #1d4ed8;
}

.tag-concluded {
  background: #f1f5f9;
  color: #64748b;
}

.booking-tag {
  padding: 5px 8px;
  border-radius: 5px;
  background: #f4f4f5;
  color: #52525b;
  font-family: monospace;
  font-size: 12px;
}

.card-event-title {
  margin: 0 0 20px;
  color: #27272a;
  font-size: 21px;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 15px;
  margin-bottom: 24px;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #71717a;
  font-size: 13px;
}

.meta-row strong {
  color: #27272a;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid #e4e4e7;
}

.btn-view-ticket,
.btn-subtle-cancel {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-view-ticket {
  color: #5145cd;
}

.btn-view-ticket:hover {
  text-decoration: underline;
}

.btn-subtle-cancel {
  color: #dc2626;
}

.btn-subtle-cancel:hover {
  text-decoration: underline;
}

.tag-archived-label {
  color: #71717a;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.modal-message {
  color: #52525b;
  font-size: 14px;
  line-height: 1.7;
}

@media (max-width: 600px) {
  .your-events-container {
    padding: 24px 16px 36px;
  }

  .page-title {
    font-size: 27px;
  }
}
</style>
