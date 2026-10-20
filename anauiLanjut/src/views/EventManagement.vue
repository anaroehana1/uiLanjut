<script setup>
import { computed, reactive, ref } from 'vue';
import { useEvents } from '@/composables/useEvent';
import AppModal from '@/components/ui/AppModal.vue';

const { activeEvents, completedEvents, createEvent, completeEvent, deleteEvent } = useEvents();
const activeTab = ref('active');
const feedback = ref({ type: '', message: '' });
const pendingAction = ref(null);
const categories = ['Workshop', 'Meetup', 'Competition', 'Seminar', 'Conference'];
const form = reactive({
  title: '',
  cat: 'Workshop',
  date: '',
  time: '',
  loc: '',
  quota: 100,
  desc: '',
});

const visibleEvents = computed(() => activeTab.value === 'completed' ? completedEvents.value : activeEvents.value);
const modalTitle = computed(() => pendingAction.value?.type === 'complete' ? 'Complete Event?' : 'Delete Event Permanently?');
const modalMessage = computed(() => {
  if (pendingAction.value?.type === 'complete') {
    return `Are you sure you want to mark "${pendingAction.value.event.title}" as completed? It will be removed from public listings.`;
  }
  return `Are you sure you want to permanently delete "${pendingAction.value?.event.title}"? This action cannot be undone.`;
});
const modalConfirmText = computed(() => pendingAction.value?.type === 'complete' ? 'Yes, Complete' : 'Yes, Delete Permanently');

function formatDate(date) {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed);
}

function validateForm() {
  if (!form.title.trim() || !form.date || !form.time || !form.loc.trim() || !form.desc.trim()) {
    feedback.value = { type: 'error', message: 'Please fill in all required fields before publishing this event.' };
    return false;
  }
  if (!Number.isInteger(Number(form.quota)) || Number(form.quota) < 1) {
    feedback.value = { type: 'error', message: 'Attendee quota must be a whole number greater than zero.' };
    return false;
  }
  return true;
}

function submitEvent() {
  feedback.value = { type: '', message: '' };
  if (!validateForm()) return;

  createEvent({
    ...form,
    title: form.title.trim(),
    loc: form.loc.trim(),
    desc: form.desc.trim(),
    date: formatDate(form.date),
  });
  feedback.value = { type: 'success', message: 'Event published successfully and is now visible in the public catalog.' };
  form.title = '';
  form.cat = 'Workshop';
  form.date = '';
  form.time = '';
  form.loc = '';
  form.quota = 100;
  form.desc = '';
  activeTab.value = 'create';
}

function askForConfirmation(type, event) {
  pendingAction.value = { type, event };
}

function closeConfirmation() {
  pendingAction.value = null;
}

function confirmAction() {
  if (!pendingAction.value) return;
  const { type, event } = pendingAction.value;

  if (type === 'complete') {
    completeEvent(event.id);
    activeTab.value = 'completed';
  } else {
    deleteEvent(event.id);
  }
  closeConfirmation();
}
</script>

<template>
  <section class="event-management">
    <header class="page-heading">
      <div>
        <h1>Event Management Control</h1>
        <p>Manage event lifecycle, publish new events, and archive completed ones.</p>
      </div>
    </header>

    <nav class="management-tabs" aria-label="Event management tabs">
      <button
        type="button"
        :class="{ selected: activeTab === 'active' }"
        :aria-pressed="activeTab === 'active'"
        @click="activeTab = 'active'; feedback = { type: '', message: '' }"
      >
        <span aria-hidden="true">⚡</span> Active Events ({{ activeEvents.length }})
      </button>
      <button
        type="button"
        :class="{ selected: activeTab === 'create' }"
        :aria-pressed="activeTab === 'create'"
        @click="activeTab = 'create'; feedback = { type: '', message: '' }"
      >
        <span aria-hidden="true">＋</span> Create Event
      </button>
      <button
        type="button"
        :class="{ selected: activeTab === 'completed' }"
        :aria-pressed="activeTab === 'completed'"
        @click="activeTab = 'completed'; feedback = { type: '', message: '' }"
      >
        <span aria-hidden="true">✅</span> Completed Events ({{ completedEvents.length }})
      </button>
    </nav>

    <section v-if="activeTab === 'create'" class="form-panel">
      <h2>Create New Event Form</h2>
      <p class="panel-description">Information entered here will be published to the Gatherly public catalog.</p>

      <div v-if="feedback.message" :class="['feedback-banner', `feedback-${feedback.type}`]" role="status" aria-live="polite">
        {{ feedback.message }}
      </div>

      <form class="event-form" novalidate @submit.prevent="submitEvent">
        <label class="form-field">
          <span>Event Title <b>*</b></span>
          <input v-model="form.title" required maxlength="100" placeholder="e.g. Modern UI/UX Workshop" />
        </label>
        <div class="form-row">
          <label class="form-field">
            <span>Event Category <b>*</b></span>
            <select v-model="form.cat" required>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </label>
          <label class="form-field">
            <span>Date &amp; Time <b>*</b></span>
            <div class="date-time-fields">
              <input v-model="form.date" type="date" required aria-label="Event date" />
              <input v-model="form.time" type="time" required aria-label="Event time" />
            </div>
          </label>
        </div>
        <div class="form-row">
          <label class="form-field">
            <span>Event Location <b>*</b></span>
            <input v-model="form.loc" required maxlength="120" placeholder="e.g. Innovation Center, Jakarta" />
          </label>
          <label class="form-field">
            <span>Attendee Quota <b>*</b></span>
            <input v-model.number="form.quota" type="number" min="1" step="1" required />
          </label>
        </div>
        <label class="form-field">
          <span>Event Description <b>*</b></span>
          <textarea v-model="form.desc" required maxlength="1000" rows="4" placeholder="Describe the agenda, benefits, and key takeaways..."></textarea>
        </label>
        <div class="form-actions">
          <button class="button-secondary" type="button" @click="activeTab = 'active'; feedback = { type: '', message: '' }">Cancel</button>
          <button class="button-primary" type="submit">✎ &nbsp;Publish Event Now</button>
        </div>
      </form>
    </section>

    <section v-else class="events-panel">
      <div v-if="visibleEvents.length" class="events-grid">
        <article v-for="event in visibleEvents" :key="event.id" class="event-card" :class="{ 'event-card-completed': event.done }">
          <div class="card-topline">
            <span class="category-badge">{{ event.cat }}</span>
            <span v-if="event.done" class="completed-badge">Completed</span>
          </div>
          <h2 :class="{ 'completed-title': event.done }">{{ event.title }}</h2>
          <p class="event-meta"><span>▣</span> {{ event.date }}<template v-if="event.time"> · {{ event.time }}</template> <span class="meta-dot">•</span> <span>⌖</span> {{ event.loc }}</p>
          <p class="event-description">{{ event.desc }}</p>
          <p class="quota">Attendee quota: <strong>{{ event.quota }} people</strong></p>
          <div v-if="event.done" class="archive-note">This event has ended and is archived from the public catalog.</div>
          <div class="event-actions">
            <button v-if="!event.done" class="button-complete" type="button" @click="askForConfirmation('complete', event)">✓ &nbsp;Complete Event</button>
            <button class="button-delete" type="button" @click="askForConfirmation('delete', event)">▤ &nbsp;Delete</button>
          </div>
        </article>
      </div>
      <div v-else class="empty-management">
        <span aria-hidden="true">{{ activeTab === 'completed' ? '✅' : '🎟️' }}</span>
        <h2>{{ activeTab === 'completed' ? 'No Completed Events Yet' : 'No Active Events Yet' }}</h2>
        <p>{{ activeTab === 'completed' ? 'Events you complete will be archived here.' : 'Create and publish your first event to make it available in the public catalog.' }}</p>
        <button v-if="activeTab === 'active'" class="button-primary" type="button" @click="activeTab = 'create'">＋ &nbsp;Create Event</button>
      </div>
    </section>
  </section>

  <AppModal
    :is-open="Boolean(pendingAction)"
    :title="modalTitle"
    :message="modalMessage"
    :confirm-text="modalConfirmText"
    :confirm-variant="pendingAction?.type === 'complete' ? 'success' : 'danger'"
    @confirm="confirmAction"
    @close="closeConfirmation"
  />
</template>

<style scoped>
.event-management { max-width: 1120px; margin: 0 auto; color: #1c1948; }
.page-heading { margin-bottom: 1.5rem; }
.page-heading h1 { font-size: 1.8rem; font-weight: 750; margin: 0 0 0.35rem; }
.page-heading p, .panel-description { margin: 0; color: #64748b; font-size: 0.9rem; }
.management-tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
.management-tabs button { padding: 0.65rem 0.9rem; color: #64748b; background: transparent; border: 1px solid transparent; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; }
.management-tabs button:hover { background: white; }
.management-tabs button.selected { color: #6644ff; background: white; border-color: #e2e8f0; box-shadow: 0 2px 8px rgba(28, 25, 72, 0.05); }
.form-panel, .events-panel { padding: 1.4rem; background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.025); }
.form-panel h2 { margin: 0 0 0.3rem; font-size: 1.1rem; font-weight: 700; }
.panel-description { margin-bottom: 1rem; font-size: 0.82rem; }
.feedback-banner { margin-bottom: 1rem; padding: 0.7rem 0.85rem; border-radius: 7px; font-size: 0.85rem; font-weight: 600; }
.feedback-error { color: #b42332; background: #fee4e2; border: 1px solid #fecdca; }
.feedback-success { color: #147a3d; background: #dcfae6; border: 1px solid #abefc6; }
.event-form { display: flex; flex-direction: column; gap: 0.8rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
.form-field { display: flex; flex-direction: column; gap: 0.35rem; color: #344054; font-size: 0.78rem; font-weight: 650; }
.form-field b { color: #e63946; }
.form-field input, .form-field select, .form-field textarea { width: 100%; min-width: 0; padding: 0.62rem 0.7rem; color: #1c1948; background: white; border: 1px solid #d0d5dd; border-radius: 6px; font-size: 0.82rem; }
.form-field input:focus, .form-field select:focus, .form-field textarea:focus { outline: 2px solid rgba(102,68,255,.22); border-color: #6644ff; }
.form-field textarea { resize: vertical; }
.date-time-fields { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 0.4rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.55rem; margin-top: 0.25rem; }
.button-primary, .button-secondary, .button-complete, .button-delete { display: inline-flex; align-items: center; justify-content: center; padding: 0.6rem 0.85rem; border-radius: 7px; cursor: pointer; font-size: 0.82rem; font-weight: 650; transition: background .2s, transform .2s; }
.button-primary { color: white; background: #6644ff; border: 1px solid #6644ff; box-shadow: 0 4px 10px rgba(102,68,255,.2); }
.button-primary:hover { background: #5533ee; transform: translateY(-1px); }
.button-secondary { color: #475467; background: white; border: 1px solid #d0d5dd; }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1rem; }
.event-card { padding: 1.1rem; border: 1px solid #e4e7ec; border-radius: 10px; background: #fff; }
.event-card-completed { background: #fbfbfc; }
.card-topline { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.category-badge { padding: 0.23rem 0.55rem; color: #6644ff; background: #f0edff; border-radius: 20px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; }
.completed-badge { padding: 0.2rem 0.55rem; color: #667085; background: #eaecf0; border-radius: 20px; font-size: 0.68rem; font-weight: 650; }
.event-card h2 { margin: 0 0 0.55rem; font-size: 1.05rem; font-weight: 700; }
.completed-title { color: #667085; text-decoration: line-through; }
.event-meta { color: #667085; font-size: 0.76rem; line-height: 1.5; }
.meta-dot { margin: 0 0.2rem; }
.event-description { min-height: 3.5rem; color: #667085; font-size: 0.82rem; line-height: 1.55; }
.quota { color: #667085; font-size: 0.76rem; }
.quota strong { color: #344054; }
.archive-note { padding: 0.55rem; color: #667085; background: #f2f4f7; border-radius: 6px; font-size: 0.73rem; }
.event-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.9rem; padding-top: 0.8rem; border-top: 1px solid #eaecf0; }
.button-complete { color: #16803c; background: white; border: 1px solid #abefc6; }
.button-complete:hover { background: #ecfdf3; }
.button-delete { color: #d92d20; background: white; border: 1px solid #fecdca; }
.button-delete:hover { background: #fff1f0; }
.empty-management { display: flex; min-height: 250px; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.empty-management > span { margin-bottom: 0.7rem; font-size: 2.2rem; }
.empty-management h2 { margin: 0 0 0.4rem; font-size: 1.1rem; }
.empty-management p { max-width: 400px; margin: 0 0 1rem; color: #667085; font-size: 0.85rem; }
@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .form-panel, .events-panel { padding: 1rem; }
  .management-tabs button { flex: 1 1 auto; }
}
</style>
