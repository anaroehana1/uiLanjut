<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useEvents } from '../composables/useEvents'
import RegistrationSummary from '../components/event/RegistrationSummary.vue'
import RegistrationForm from '../components/event/RegistrationForm.vue'
import RegistrationReceipt from '../components/event/RegistrationReceipt.vue'
import AppModal from '../components/ui/AppModal.vue'
import AppButton from '../components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()

const { getEventById, registerAttendee, isUserRegistered, getRegistrationByEventId } =
  useEvents()

const event = computed(() => getEventById(route.params.id))
const showReceipt = ref(false)
const registration = ref(null)
const errorMessage = ref('')
const alreadyRegistered = computed(() => isUserRegistered(route.params.id))

function handleSubmit(participantData) {
  errorMessage.value = ''

  if (!event.value) {
    errorMessage.value = 'Event not found.'
    return
  }

  if (alreadyRegistered.value) {
    errorMessage.value = 'You are already registered for this event.'
    return
  }

  const result = registerAttendee(route.params.id, participantData)
  if (!result) {
    errorMessage.value = 'Registration failed. Check the event quota and status.'
    return
  }

  registration.value = result
  showReceipt.value = true
}

function handleCancel() {
  router.push({
    name: 'event-detail',
    params: { id: route.params.id },
  })
}

function closeReceipt() {
  showReceipt.value = false
  router.push({ name: 'events' })
}

function openYourEvents() {
  showReceipt.value = false
  router.push({ name: 'your-events' })
}

function viewExistingTicket() {
  const existingRegistration = getRegistrationByEventId(route.params.id)

  if (existingRegistration) {
    router.push({
      name: 'ticket-receipt',
      params: { id: route.params.id },
    })
  } else {
    router.push({ name: 'your-events' })
  }
}
</script>

<template>
  <main class="registration-page">
    <button type="button" class="back-link" @click="handleCancel">
      &larr; Back to Event Detail
    </button>

    <div v-if="!event" class="state-card">
      <h1>Event not found</h1>
      <p>The event may have been removed or this link is invalid.</p>
      <AppButton @click="router.push({ name: 'events' })">
        Back to Event Catalog
      </AppButton>
    </div>

    <div v-else class="registration-grid">
      <aside class="summary-column">
        <RegistrationSummary :event="event" />
      </aside>

      <section class="form-column">
        <div v-if="alreadyRegistered" class="registered-card">
          <span class="registered-badge">REGISTERED</span>
          <h2>Already Registered</h2>
          <p>Your booking is confirmed. You can view your digital ticket anytime.</p>
          <AppButton @click="viewExistingTicket">View Your Ticket</AppButton>
        </div>

        <template v-else>
          <p v-if="errorMessage" class="error-message" role="alert">
            {{ errorMessage }}
          </p>
          <RegistrationForm @submit="handleSubmit" @cancel="handleCancel" />
        </template>
      </section>
    </div>

    <AppModal
      v-model="showReceipt"
      title=""
      :show-close="false"
      :show-cancel="false"
      :show-confirm="false"
    >
      <RegistrationReceipt
        v-if="registration"
        :confirmed-data="registration"
        :event="event"
      />

      <template #footer>
        <div class="receipt-actions">
          <AppButton variant="outline" @click="closeReceipt">
            Back to Event Catalog
          </AppButton>
          <AppButton @click="openYourEvents">Go to Your Events</AppButton>
        </div>
      </template>
    </AppModal>
  </main>
</template>

<style scoped>
.registration-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4px 0 40px;
  box-sizing: border-box;
}

.back-link {
  margin-bottom: 14px;
  padding: 6px 0;
  border: 0;
  background: transparent;
  color: #52525b;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.back-link:hover {
  color: #6644ff;
}

.registration-grid {
  display: grid;
  grid-template-columns: minmax(230px, 0.58fr) minmax(0, 1.42fr);
  align-items: start;
  gap: 18px;
}

.summary-column,
.form-column {
  min-width: 0;
}

.error-message {
  margin: 0 0 14px;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
}

.registered-card,
.state-card {
  padding: 24px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  background: #ffffff;
}

.registered-badge {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 16px;
  background: #dcfce7;
  color: #15803d;
  font-size: 10px;
  font-weight: 700;
}

.registered-card h2,
.state-card h1 {
  margin: 12px 0 8px;
  color: #1c1948;
}

.registered-card p,
.state-card p {
  margin: 0 0 18px;
  color: #71717a;
  font-size: 14px;
  line-height: 1.6;
}

.receipt-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 800px) {
  .registration-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
