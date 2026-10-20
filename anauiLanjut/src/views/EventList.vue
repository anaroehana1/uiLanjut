<script setup>
import { computed, ref } from 'vue';
import { useEvents } from '@/composables/useEvent';

const { activeEvents } = useEvents();
const searchQuery = ref('');
const selectedCategory = ref('All');
const categories = ['All', 'Workshop', 'Meetup', 'Competition', 'Seminar', 'Conference'];

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return activeEvents.value.filter((event) => {
    const matchesCategory = selectedCategory.value === 'All' || event.cat === selectedCategory.value;
    const matchesQuery = !query || [event.title, event.cat, event.loc]
      .some((value) => value.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });
});
</script>

<template>
  <div class="event-list-page">
    <div class="header-section">
      <h2 class="section-title">Upcoming Events</h2>
      <p class="section-desc">Discover workshops, seminars, tech meetups, and competitions near you.</p>
    </div>

    <div class="event-filters">
      <label class="search-field">
        <span class="sr-only">Search events by title, category, or location</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search events by title or location..."
        />
      </label>
      <div class="category-filters" aria-label="Filter events by category">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="category-filter"
          :class="{ selected: selectedCategory === category }"
          :aria-pressed="selectedCategory === category"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div v-if="filteredEvents.length" class="event-grid">
      <div class="event-card" v-for="event in filteredEvents" :key="event.id">
        <div class="event-body">
          <div class="event-meta">
            <span class="event-date">{{ event.date }}</span>
            <span class="event-category">{{ event.cat }}</span>
          </div>

          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-loc">📍 {{ event.loc }}</p>
          <p class="event-desc">{{ event.desc }}</p>

          <div class="card-footer">
            <router-link :to="`/browse/events/${event.id}`" class="btn-link">View Event Details &rarr;</router-link>
          </div>
        </div>
      </div>
    </div>

    <section v-else class="empty-state" aria-live="polite">
      <div class="empty-state-icon" aria-hidden="true">🗓️</div>
      <h3>{{ activeEvents.length ? 'No Events Match Your Search' : 'No Events Available Yet' }}</h3>
      <p v-if="activeEvents.length">
        Try another keyword or category to find an event.
      </p>
      <p v-else>
        There are currently no active events scheduled. Are you an organizer?
        Publish and manage your first event today through the dashboard.
      </p>
      <button
        v-if="activeEvents.length"
        type="button"
        class="btn-primary"
        @click="searchQuery = ''; selectedCategory = 'All'"
      >
        Clear Filters
      </button>
      <router-link v-else to="/dashboard" class="btn-primary">
        Go to Organizer Dashboard &rarr;
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.header-section { margin-bottom: 1.25rem; }
.section-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.2rem; }
.section-desc { color: var(--text-muted); font-size: 0.95rem; }

.event-filters { margin-bottom: 1.5rem; }
.search-field { display: block; max-width: 460px; margin-bottom: 0.75rem; }
.search-field input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  color: var(--text-main);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
.search-field input:focus { outline: 2px solid rgba(102, 68, 255, 0.3); border-color: var(--primary); }
.category-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.category-filter {
  padding: 0.35rem 0.75rem;
  color: var(--text-muted);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
}
.category-filter:hover, .category-filter.selected {
  color: white;
  background: var(--primary);
  border-color: var(--primary);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.06);
}

.event-body { padding: 1.5rem; display: flex; flex-direction: column; height: 100%; }

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.event-date {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-2);
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
}

.event-category { color: var(--text-muted); font-size: 0.85rem; font-weight: 500; text-transform: uppercase; }
.event-title { margin-bottom: var(--space-2); font-size: 1.4rem; }
.event-loc { color: var(--text-muted); font-size: 0.95rem; margin-bottom: var(--space-4); }
.event-desc { color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; margin-bottom: var(--space-6); flex-grow: 1; }

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.btn-link {
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
}
.btn-link:hover { color: var(--primary); }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  max-width: 560px;
  margin: 1.5rem auto 0;
  padding: 1.5rem;
  text-align: center;
  background: white;
  border: 1px solid #f1f1f5;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(28, 25, 72, 0.04);
}
.empty-state-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.empty-state h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.35rem; }
.empty-state p { max-width: 410px; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.85rem; }
.btn-primary {
  display: inline-block;
  padding: 0.65rem 1rem;
  color: white;
  background: var(--primary);
  border: 0;
  border-radius: 8px;
  box-shadow: 0 5px 12px rgba(102, 68, 255, 0.25);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}
.btn-primary:hover { background: var(--primary-hover); }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 600px) {
  .event-grid { grid-template-columns: 1fr; }
  .section-title { font-size: 1.55rem; }
}
</style>