<script setup>
import { useRouter } from 'vue-router';
import { useEvents } from '@/composables/useEvent';
import AppCard from '@/components/ui/AppCard.vue';
import AppButton from '@/components/ui/AppButton.vue';

const router = useRouter();
const { events, totalEvents, activeEvents, completedEvents } = useEvents();
</script>

<template>
  <div class="dashboard-overview">
    <div class="dashboard-header">
      <div>
        <h1>Organizer Analytics &amp; Overview</h1>
        <p class="subtitle">Monitor real-time statistics and track status across all managed events.</p>
      </div>
      <AppButton variant="primary" @click="router.push('/dashboard/events')">▣ &nbsp;Manage Events →</AppButton>
    </div>

    <div class="metrics-grid">
      <AppCard class="metric-card">
        <h2>Total Events</h2>
        <p class="metric-value">{{ totalEvents }}</p>
        <span>All recorded events</span>
      </AppCard>
      <AppCard class="metric-card">
        <h2>Active Events</h2>
        <p class="metric-value text-success">{{ activeEvents.length }}</p>
        <span>Live in public catalog</span>
      </AppCard>
      <AppCard class="metric-card">
        <h2>Completed Events</h2>
        <p class="metric-value text-muted">{{ completedEvents.length }}</p>
        <span>Archived completed events</span>
      </AppCard>
    </div>

    <section class="data-table-container">
      <div class="table-header">
        <div>
          <h2>Recent Events Status Overview</h2>
          <p>Master registry of all events managed across the Gatherly platform.</p>
        </div>
        <button class="manage-link" type="button" @click="router.push('/dashboard/events')">Open Event Management →</button>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Category</th>
              <th>Date &amp; Location</th>
              <th>Quota</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="events.length === 0">
              <td colspan="5">
                <div class="empty-table">
                  <span aria-hidden="true">📊</span>
                  <p>No events recorded in the system yet.</p>
                  <AppButton variant="primary" @click="router.push('/dashboard/events')">Create First Event</AppButton>
                </div>
              </td>
            </tr>
            <tr v-for="event in events" :key="event.id">
              <td class="event-name">{{ event.title }}</td>
              <td><span class="category-badge">{{ event.cat }}</span></td>
              <td>{{ event.date }}<template v-if="event.time"> · {{ event.time }}</template> • {{ event.loc }}</td>
              <td>{{ event.quota }} people</td>
              <td><span :class="['status-badge', event.done ? 'status-completed' : 'status-active']">{{ event.done ? 'Completed' : 'Active' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-overview { max-width: 1120px; margin: 0 auto; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.dashboard-header h1 { margin: 0 0 0.3rem; color: #1c1948; font-size: 1.55rem; font-weight: 750; }
.subtitle, .table-header p { margin: 0; color: #667085; font-size: 0.82rem; }
.metrics-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-bottom: 1.25rem; }
.metric-card { padding: 1.1rem; }
.metric-card h2 { margin: 0 0 0.75rem; color: #667085; font-size: 0.72rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.03em; }
.metric-value { margin: 0 0 0.35rem; color: #6644ff; font-size: 2rem; font-weight: 800; line-height: 1; }
.metric-card > span { color: #667085; font-size: 0.72rem; }
.text-success { color: #22c55e; }
.text-muted { color: #8a8d93; }
.data-table-container { padding: 1.15rem; background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.table-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.table-header h2 { margin: 0 0 0.25rem; color: #1c1948; font-size: 1.05rem; font-weight: 700; }
.manage-link { padding: 0; color: #6644ff; background: none; border: 0; cursor: pointer; font-size: 0.76rem; font-weight: 650; white-space: nowrap; }
.manage-link:hover { text-decoration: underline; }
.table-scroll { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; white-space: nowrap; }
.data-table th, .data-table td { padding: 0.72rem 0.65rem; text-align: left; border-bottom: 1px solid #eaecf0; font-size: 0.74rem; }
.data-table th { color: #667085; background: #fafafa; font-size: 0.66rem; font-weight: 700; text-transform: uppercase; }
.event-name { color: #344054; font-weight: 650; }
.category-badge, .status-badge { display: inline-block; padding: 0.22rem 0.5rem; border-radius: 999px; font-size: 0.66rem; font-weight: 650; }
.category-badge { color: #6644ff; background: #f0edff; }
.status-active { color: #16803c; background: #dcfae6; }
.status-completed { color: #667085; background: #eaecf0; }
.empty-table { display: flex; min-height: 150px; flex-direction: column; align-items: center; justify-content: center; gap: 0.45rem; text-align: center; }
.empty-table > span { font-size: 1.7rem; }
.empty-table p { margin: 0 0 0.35rem; color: #667085; font-size: 0.76rem; }
@media (max-width: 640px) {
  .dashboard-header, .table-header { align-items: flex-start; flex-direction: column; }
  .metrics-grid { grid-template-columns: 1fr; }
}
</style>
