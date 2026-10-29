<script setup>
import { computed } from 'vue'

const props = defineProps({
  confirmedData: {
    type: Object,
    default: null,
  },
  event: {
    type: Object,
    default: null,
  },
})

const eventDate = computed(() => {
  if (!props.event?.date) return 'Date not available'

  const date = new Date(props.event.date)
  if (Number.isNaN(date.getTime())) return props.event.date

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
})
</script>

<template>
  <div v-if="confirmedData && event" class="receipt-preview">
    <span class="success-badge">SUCCESS</span>
    <h3>Registration Confirmed</h3>
    <p class="receipt-greeting">
      Thank you, <strong>{{ confirmedData.fullname }}</strong>! Your registration for
      <strong>{{ event.title }}</strong> has been officially confirmed.
    </p>

    <div class="receipt-box">
      <div class="receipt-row">
        <span>Booking Reference</span>
        <strong class="ref-code">{{ confirmedData.bookingCode }}</strong>
      </div>
      <div class="receipt-row">
        <span>Attendee Email</span>
        <strong>{{ confirmedData.email }}</strong>
      </div>
      <div class="receipt-row">
        <span>Event Schedule</span>
        <strong>{{ eventDate }}</strong>
      </div>
      <div class="receipt-row">
        <span>Venue / Location</span>
        <strong>{{ event.loc }}</strong>
      </div>
    </div>
  </div>

  <p v-else class="receipt-empty">Registration confirmation is not available.</p>
</template>

<style scoped>
.receipt-preview {
  color: #27272a;
}

.success-badge {
  display: inline-block;
  padding: 5px 9px;
  border: 1px solid #86efac;
  border-radius: 4px;
  background: #dcfce7;
  color: #15803d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

h3 {
  margin: 10px 0;
  color: #1c1948;
  font-size: 19px;
}

.receipt-greeting {
  margin: 0 0 16px;
  color: #71717a;
  font-size: 13px;
  line-height: 1.6;
}

.receipt-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e4e4e7;
  border-radius: 9px;
  background: #ffffff;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  font-size: 12px;
}

.receipt-row > span {
  color: #71717a;
}

.receipt-row strong {
  color: #1c1948;
  text-align: right;
  overflow-wrap: anywhere;
}

.ref-code {
  padding: 3px 7px;
  border: 1px solid #e4e4e7;
  border-radius: 4px;
  color: #6644ff !important;
  font-family: monospace;
}

.receipt-empty {
  color: #71717a;
  font-size: 14px;
}
</style>
