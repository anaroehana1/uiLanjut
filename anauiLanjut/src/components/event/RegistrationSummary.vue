<template>
  <article class="summary-card">
    <span class="summary-category">{{ event.cat || 'Event' }}</span>
    <h2>{{ event.title || 'Event details' }}</h2>

    <dl class="summary-details">
      <div>
        <dt>Date &amp; Time</dt>
        <dd>{{ formattedDate }}</dd>
      </div>
      <div>
        <dt>Location</dt>
        <dd>{{ event.loc || 'Venue not available' }}</dd>
      </div>
      <div>
        <dt>Available Seats</dt>
        <dd class="seats">{{ event.quota ?? 0 }} seats remaining</dd>
      </div>
    </dl>

    <p v-if="event.desc" class="summary-description">{{ event.desc }}</p>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const formattedDate = computed(() => {
  if (!props.event.date) return 'Date not available'

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

<style scoped>
.summary-card {
  padding: 22px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  background: #ffffff;
}

.summary-category {
  display: inline-block;
  margin-bottom: 12px;
  padding: 5px 9px;
  border-radius: 20px;
  background: #ede9fe;
  color: #6644ff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

h2 {
  margin: 0 0 18px;
  color: #1c1948;
  font-size: 20px;
  line-height: 1.4;
}

.summary-details {
  margin: 0;
  padding: 14px 0;
  border-top: 1px solid #eeeeF1;
  border-bottom: 1px solid #eeeeF1;
}

.summary-details > div {
  margin: 0 0 12px;
}

.summary-details > div:last-child {
  margin-bottom: 0;
}

dt {
  margin-bottom: 3px;
  color: #71717a;
  font-size: 11px;
  text-transform: uppercase;
}

dd {
  margin: 0;
  color: #27272a;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

dd.seats {
  color: #15803d;
}

.summary-description {
  margin: 14px 0 0;
  color: #71717a;
  font-size: 13px;
  line-height: 1.7;
}
</style>
