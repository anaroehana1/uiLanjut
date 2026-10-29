<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvents } from '../composables/useEvents'
import AppButton from '../components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()
const { getEventById, isUserRegistered } = useEvents()

const event = computed(() => getEventById(route.params.id))
const registered = computed(() => isUserRegistered(route.params.id))
const eventDate = computed(() => {
  if (!event.value?.date) return 'Date not available'

  const date = new Date(event.value.date)
  if (Number.isNaN(date.getTime())) return event.value.date

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
})

function openRegistration() {
  router.push({
    name: registered.value ? 'ticket-receipt' : 'event-registration',
    params: { id: route.params.id },
  })
}
</script>

<template>
  <main class="event-detail-page">
    <button type="button" class="back-link" @click="router.push({ name: 'events' })">
      &larr; Back to Events
    </button>

    <section v-if="event" class="detail-header">
      <div class="event-tags">
        <span class="event-tag">{{ event.cat || 'Event' }}</span>
        <span :class="['status-tag', registered ? 'is-registered' : 'is-open']">
          {{ registered ? 'Registered' : event.quota > 0 ? 'Open Registration' : 'Sold Out' }}
        </span>
      </div>
      <h1>{{ event.title }}</h1>
      <div class="meta-info">
        <span><strong>Date:</strong> {{ eventDate }}</span>
        <span><strong>Location:</strong> {{ event.loc }}</span>
        <span><strong>Remaining Quota:</strong> {{ event.quota }} Attendees</span>
      </div>
    </section>

    <section v-if="event" class="detail-content">
      <article class="main-desc">
        <h2>About This Event</h2>
        <p>{{ event.desc || 'More event information will be available soon.' }}</p>
      </article>

      <aside class="sidebar">
        <div class="ticket-card">
          <h2>Event Registration</h2>
          <p v-if="registered" class="registration-status">
            You are registered for this event. Your booking is confirmed.
          </p>
          <p v-else class="ticket-desc">
            Secure your spot now before the remaining quota is filled.
          </p>

          <AppButton
            class="register-button"
            :disabled="!registered && event.quota <= 0"
            @click="openRegistration"
          >
            {{ registered ? 'Already Registered' : event.quota > 0 ? 'Register Now' : 'Sold Out' }}
          </AppButton>

          <button
            v-if="registered"
            type="button"
            class="ticket-link"
            @click="openRegistration"
          >
            View Your Ticket Receipt &rarr;
          </button>
          <p v-else class="spots">{{ event.quota }} seats available</p>
        </div>
      </aside>
    </section>

    <section v-else class="not-found">
      <h1>Event not found</h1>
      <p>This event may have been removed or the link is invalid.</p>
      <AppButton @click="router.push({ name: 'events' })">Back to Event Catalog</AppButton>
    </section>
  </main>
</template>

<style scoped>
.event-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4px 0 48px;
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

.detail-header {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  background: #ffffff;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.event-tag,
.status-tag {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.event-tag {
  background: #ede9fe;
  color: #6644ff;
  text-transform: uppercase;
}

.status-tag.is-open {
  background: #dcfce7;
  color: #15803d;
}

.status-tag.is-registered {
  background: #dbeafe;
  color: #1d4ed8;
}

.detail-header h1 {
  margin: 0 0 12px;
  color: #1c1948;
  font-size: clamp(25px, 4vw, 36px);
  line-height: 1.2;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  color: #52525b;
  font-size: 13px;
}

.meta-info strong {
  color: #1c1948;
}

.detail-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  gap: 28px;
}

.main-desc h2 {
  margin: 0 0 12px;
  padding-left: 10px;
  border-left: 3px solid #6644ff;
  color: #1c1948;
  font-size: 21px;
}

.main-desc p {
  margin: 0;
  color: #52525b;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-line;
}

.ticket-card {
  padding: 22px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgb(0 0 0 / 5%);
  text-align: center;
}

.ticket-card h2 {
  margin: 0 0 10px;
  color: #1c1948;
  font-size: 18px;
}

.ticket-desc,
.registration-status {
  margin: 0 0 14px;
  color: #71717a;
  font-size: 13px;
  line-height: 1.6;
}

.registration-status {
  color: #15803d;
  font-weight: 600;
}

.register-button {
  width: 100%;
}

.spots {
  margin: 10px 0 0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 700;
}

.ticket-link {
  display: block;
  margin: 12px auto 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6644ff;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.not-found {
  padding: 30px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  background: #ffffff;
}

.not-found p {
  margin-bottom: 18px;
  color: #71717a;
}

@media (max-width: 800px) {
  .detail-content {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
