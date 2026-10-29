<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useEvents } from '../composables/useEvents'
import AppCard from '../components/ui/AppCard.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppModal from '../components/ui/AppModal.vue'

const route = useRoute()
const router = useRouter()
const { getRegistrationByEventId, getEventById, cancelRegistration } = useEvents()

const registration = computed(() => getRegistrationByEventId(route.params.id))
const event = computed(() => getEventById(route.params.id))
const showCancelModal = ref(false)
const cancellationError = ref('')

function formatDate(value, options) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', options).format(date)
}

const eventDate = computed(() =>
  formatDate(registration.value?.eventDate, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
)

const registeredDate = computed(() =>
  formatDate(registration.value?.registeredAt, { dateStyle: 'medium' })
)

function goBack() {
  router.push({ name: 'your-events' })
}

function printTicket() {
  window.print()
}

function handleConfirmCancel() {
  if (!cancelRegistration(route.params.id)) {
    cancellationError.value = 'The registration could not be cancelled. Please try again.'
    showCancelModal.value = false
    return
  }

  showCancelModal.value = false
  router.push({ name: 'your-events' })
}
</script>

<template>
  <main class="ticket-page">
    <div class="page-actions no-print">
      <button type="button" class="back-button" @click="goBack">
        &larr; Back to Your Events
      </button>
    </div>

    <p v-if="cancellationError" class="cancellation-error" role="alert">
      {{ cancellationError }}
    </p>

    <div v-if="!registration" class="empty-state">
      <div class="empty-icon">🎟️</div>
      <h1>Ticket not found</h1>
      <p>The registration may have been cancelled or the ticket is unavailable.</p>
      <AppButton @click="goBack">Back to Your Events</AppButton>
    </div>

    <AppCard v-else class="ticket-card">
      <header class="ticket-header">
        <div>
          <span class="confirmed-badge">CONFIRMED PASS</span>
          <p class="registered-date">Registered on {{ registeredDate }}</p>
        </div>
        <strong class="booking-code">#{{ registration.bookingCode }}</strong>
      </header>

      <section class="ticket-section">
        <p class="section-label">EVENT DETAILS</p>
        <h1>{{ registration.eventTitle }}</h1>
        <div class="details-grid">
          <div>
            <span>Category</span>
            <strong>{{ registration.eventCat || 'Event' }}</strong>
          </div>
          <div>
            <span>Date &amp; Time</span>
            <strong>{{ eventDate }}</strong>
          </div>
          <div>
            <span>Location / Venue</span>
            <strong>{{ registration.eventLoc || '-' }}</strong>
          </div>
        </div>
      </section>

      <section class="ticket-section">
        <p class="section-label">ATTENDEE INFORMATION</p>
        <div class="details-grid">
          <div>
            <span>Full Name</span>
            <strong>{{ registration.fullname }}</strong>
          </div>
          <div>
            <span>Email Address</span>
            <strong>{{ registration.email }}</strong>
          </div>
          <div>
            <span>Phone Number</span>
            <strong>{{ registration.phone }}</strong>
          </div>
          <div>
            <span>Date of Birth</span>
            <strong>{{ registration.dob || '-' }}</strong>
          </div>
        </div>
      </section>

      <section class="ticket-section reason-section">
        <p class="section-label">REASON FOR ATTENDING</p>
        <p class="reason">{{ registration.reason || '-' }}</p>
      </section>

      <footer class="ticket-footer no-print">
        <AppButton variant="outline" @click="goBack">Back to Your Events</AppButton>
        <AppButton variant="secondary" @click="showCancelModal = true">
          Cancel Registration
        </AppButton>
        <AppButton @click="printTicket">Print Ticket</AppButton>
      </footer>
    </AppCard>

    <AppModal
      v-model="showCancelModal"
      title="Cancel Registration?"
      cancel-text="Keep Ticket"
      confirm-text="Cancel Registration"
      confirm-variant="danger"
      @confirm="handleConfirmCancel"
    >
      <p class="modal-message">
        Are you sure you want to cancel this registration? The event quota will be restored.
      </p>
    </AppModal>
  </main>
</template>

<style scoped>
.ticket-page {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 4px 0 48px;
}

.page-actions {
  margin-bottom: 18px;
}

.back-button {
  padding: 7px 0;
  border: 0;
  background: transparent;
  color: #52525b;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.back-button:hover {
  color: #6644ff;
}

.ticket-card {
  overflow: hidden;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 24px;
  border-bottom: 1px dashed #d4d4d8;
}

.confirmed-badge {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 4px;
  background: #dcfce7;
  color: #15803d;
  font-size: 10px;
  font-weight: 700;
}

.registered-date {
  margin: 7px 0 0;
  color: #71717a;
  font-size: 12px;
}

.booking-code {
  color: #6644ff;
  font-family: monospace;
  font-size: 13px;
}

.ticket-section {
  padding: 22px 24px;
  border-bottom: 1px solid #e4e4e7;
}

.section-label {
  margin: 0 0 12px;
  color: #52525b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.ticket-section h1 {
  margin: 0 0 18px;
  color: #1c1948;
  font-size: 22px;
  line-height: 1.35;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.details-grid > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.details-grid span {
  color: #71717a;
  font-size: 11px;
}

.details-grid strong {
  color: #27272a;
  font-size: 12px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.reason-section {
  border-bottom: 0;
}

.reason {
  margin: 0;
  padding: 14px;
  border-radius: 8px;
  background: #fafafa;
  color: #52525b;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-line;
}

.ticket-footer {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  padding: 18px 24px;
  border-top: 1px solid #e4e4e7;
}

.empty-state {
  padding: 36px 24px;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  background: #ffffff;
  text-align: center;
}

.empty-icon {
  font-size: 42px;
}

.empty-state h1 {
  color: #1c1948;
  font-size: 24px;
}

.empty-state p,
.modal-message {
  color: #71717a;
  font-size: 14px;
  line-height: 1.7;
}

.cancellation-error {
  padding: 12px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
}

@media (max-width: 560px) {
  .ticket-section,
  .ticket-header {
    padding: 18px 16px;
  }

  .details-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .ticket-footer {
    flex-direction: column;
    padding: 16px;
  }
}
</style>

<style>
@media print {
  body * {
    visibility: hidden !important;
  }

  .ticket-card,
  .ticket-card * {
    visibility: visible !important;
  }

  .ticket-card {
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    box-shadow: none !important;
    border: 1px solid #d4d4d8 !important;
  }

  .no-print {
    display: none !important;
  }
}
</style>
