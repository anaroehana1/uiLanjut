<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEvents } from '@/composables/useEvent';

const route = useRoute();
const router = useRouter();
const { getEventById } = useEvents();
const event = computed(() => getEventById(route.params.id));
</script>

<template>
  <div v-if="event && !event.done" class="event-detail-page">
    <button @click="router.push('/browse/events')" class="btn-back">&larr; Back to Events</button>

    <div class="detail-header">
      <span class="event-tag">{{ event.cat }}</span>
      <h1>{{ event.title }}</h1>
      <div class="meta-info">
        <span class="meta-item">📅 {{ event.date }}<template v-if="event.time"> · {{ event.time }}</template></span>
        <span class="meta-item">📍 {{ event.loc }}</span>
        <span class="meta-item">👥 Quota: {{ event.quota }} Attendees</span>
      </div>
    </div>

    <!-- ASYMMETRICAL LAYOUT -->
    <div class="detail-content grid-asymmetric">

      <!-- F-PATTERN: Breaking text with Headings & Bullet Points -->
      <div class="main-desc">
        <h2>About This Event</h2>
        <p>{{ event.desc }}</p>
      </div>

      <!-- FOCAL POINT & STICKY PANE -->
      <div class="sidebar">
        <div class="ticket-card sticky-pane">
          <h3>Attendee Registration</h3>
          <p class="price">{{ event.price || 'Free' }}</p>
          <p class="ticket-desc">Secure your seat now before the quota is full.</p>
          <!-- STRONGEST FOCAL POINT -->
          <button class="btn-register">Register Now</button>
          <p class="spots">Only 12 seats left!</p>
        </div>
      </div>

    </div>
  </div>
  <section v-else class="event-not-found">
    <h1>Event Not Available</h1>
    <p>This event may have been removed or completed.</p>
    <button @click="router.push('/browse/events')" class="btn-back">&larr; Back to Events</button>
  </section>
</template>

<style scoped>
.btn-back { background: none; border: none; font-size: 1rem; cursor: pointer;
  margin-bottom: var(--space-6); color: var(--text-muted); }
.event-not-found { padding: var(--space-16) var(--space-4); text-align: center; }
.event-not-found h1 { margin-bottom: var(--space-2); color: var(--text-main); }
.event-not-found p { margin-bottom: var(--space-4); color: var(--text-muted); }
.detail-header { background: var(--bg-light); border-radius: var(--space-4);
  border: 1px solid var(--border-color); padding: var(--space-12) var(--space-8); margin-bottom: var(--space-8); }
.event-tag { display: inline-block; background: rgba(102, 68, 255, 0.1); color: var(--primary);
  padding: var(--space-1) var(--space-4); border-radius: 50px; font-weight: 600; font-size: 0.9rem; margin-bottom: var(--space-4); }
.detail-header h1 { font-size: 2.8rem; margin-bottom: var(--space-4); line-height: 1.2; }
.meta-info { display: flex; gap: var(--space-6); }
.meta-item { color: var(--text-muted); font-weight: 500; font-size: 1.05rem; }

/* ASYMMETRICAL GRID */
.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.main-desc h2 { margin-bottom: var(--space-4); font-size: 1.8rem; border-left: 4px solid var(--primary); padding-left: var(--space-2); }
.main-desc p { color: var(--text-main); line-height: 1.8; margin-bottom: var(--space-6); font-size: 1.05rem; }
.agenda-list { list-style: none; padding: 0; margin: 0 0 var(--space-8) 0; }
.agenda-list li { padding: var(--space-3) 0; border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 1.05rem; }

/* FOCAL POINT CARD */
.ticket-card {
  background: white;
  padding: var(--space-8);
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  text-align: center;
}

/* STICKY BEHAVIOR */
.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-card h3 { font-size: 1.5rem; margin-bottom: var(--space-2); }
.price { font-size: 2.8rem; font-weight: 800; color: var(--primary); margin-bottom: var(--space-2); }
.ticket-desc { color: var(--text-muted); margin-bottom: var(--space-6); }

.btn-register {
  width: 100%;
  padding: var(--space-4);
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-register:hover { background: var(--primary-hover); }
.spots { margin-top: var(--space-4); color: #e63946; font-weight: 600; font-size: 0.95rem; }

@media (max-width: 900px) {
  .grid-asymmetric { grid-template-columns: 1fr; }
}
</style>