
<script setup>
import { computed, ref } from 'vue'
import { useEvents } from '../composables/useEvents'
import SearchBar from '../components/event/SearchBar.vue'
import CategoryFilter from '../components/event/CategoryFilter.vue'

const { events: savedEvents, isUserRegistered } = useEvents()

const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = [
  'All',
  'Workshop',
  'Meetup',
  'Competition',
  'Seminar',
  'Conference',
]

const sourceEvents = computed(() => savedEvents.value)

const filteredEvents = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return sourceEvents.value.filter((event) => {
    const matchesKeyword =
      !keyword ||
      event.title?.toLowerCase().includes(keyword) ||
      event.desc?.toLowerCase().includes(keyword) ||
      event.loc?.toLowerCase().includes(keyword)

    const matchesCategory =
      selectedCategory.value === 'All' ||
      event.cat === selectedCategory.value

    return !event.done && matchesKeyword && matchesCategory
  })
})

function formatDate(value) {
  if (!value) return 'Tanggal belum tersedia'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
</script>

<template>
  <div class="event-list-page">
    <div class="header-section">
      <h2 class="section-title">Upcoming Events</h2>
      <p class="section-desc">
        Discover workshops, seminars, tech meetups, and competitions.
      </p>
    </div>

    <div class="filter-section">
      <SearchBar
        v-model="searchQuery"
        placeholder="Cari nama atau deskripsi acara..."
        @clear="searchQuery = ''"
      />

      <CategoryFilter
        v-model="selectedCategory"
        :categories="categories"
      />
    </div>

    <div class="results-heading">
      <h3>Daftar Acara</h3>
      <span>{{ filteredEvents.length }} acara ditemukan</span>
    </div>

    <div v-if="filteredEvents.length" class="event-grid">
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="event-card"
      >
        <div class="event-body">
          <div class="event-meta">
            <span class="event-date">{{ formatDate(event.date) }}</span>
            <span class="event-category">{{ event.cat }}</span>
            <span v-if="isUserRegistered(event.id)" class="registered-badge">
              REGISTERED
            </span>
          </div>

          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-loc">{{ event.loc }}</p>
          <p class="event-desc">{{ event.desc }}</p>

          <p v-if="event.quota !== undefined" class="event-quota">
            Kuota tersisa: {{ event.quota }}
          </p>

          <div class="card-footer">
            <router-link
              :to="{ name: 'event-detail', params: { id: event.id } }"
              class="btn-link"
            >
              {{ isUserRegistered(event.id) ? 'View Ticket Details →' : 'View Event Details →' }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">🔎</span>
      <h3>Acara tidak ditemukan</h3>
      <p>Coba kata kunci atau kategori yang berbeda.</p>

      <button
        type="button"
        class="reset-button"
        @click="searchQuery = ''; selectedCategory = 'All'"
      >
        Reset Pencarian
      </button>
    </div>
  </div>
</template>

<style scoped>
.event-list-page {
  width: 100%;
}

.header-section {
  margin-bottom: 28px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 2.2rem;
}

.section-desc {
  margin: 0;
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-bottom: 30px;
}

.results-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.results-heading h3 {
  margin: 0;
  font-size: 1.25rem;
}

.results-heading span {
  color: var(--text-muted);
  font-size: 13px;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: var(--space-6);
}

.event-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  background: #ffffff;
  box-shadow: 0 4px 15px rgb(0 0 0 / 2%);
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgb(0 0 0 / 6%);
}

.event-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-6);
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: var(--space-4);
}

.event-date {
  padding: var(--space-1) var(--space-2);
  border-radius: 6px;
  background: rgb(102 68 255 / 10%);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
}

.event-title {
  margin: 0 0 var(--space-2);
  font-size: 1.35rem;
  line-height: 1.4;
}

.event-loc {
  margin: 0 0 var(--space-4);
  color: var(--text-muted);
  font-size: 0.95rem;
}

.event-desc {
  flex-grow: 1;
  margin: 0 0 var(--space-4);
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.event-quota {
  margin: 0 0 16px;
  color: var(--text-muted);
  font-size: 13px;
}

.card-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-link {
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
}

.btn-link:hover {
  color: var(--primary);
}

.registered-badge {
  padding: 5px 9px;
  border-radius: 6px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.empty-state {
  padding: 42px 20px;
  border: 1px dashed var(--border-color);
  border-radius: 14px;
  text-align: center;
}

.empty-icon {
  font-size: 34px;
}

.empty-state h3 {
  margin: 12px 0 8px;
}

.empty-state p {
  color: var(--text-muted);
  font-size: 14px;
}

.reset-button {
  padding: 10px 15px;
  border: 0;
  border-radius: 8px;
  background: var(--primary);
  color: #ffffff;
  font: inherit;
  cursor: pointer;
}

@media (max-width: 600px) {
  .section-title {
    font-size: 1.8rem;
  }
}
</style>
