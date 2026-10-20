<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <!-- RAIL & PANE SYSTEM
       Kerangka khusus untuk kebutuhan produktivitas/pengelolaan aplikasi. -->
  <div class="dashboard-layout">

    <!-- RAIL: Navigasi samping yang posisinya terkunci (fixed) -->
    <aside class="dashboard-rail">
      <div class="rail-brand">
        <router-link to="/">Gatherly Organizer</router-link>
      </div>
      
      <nav class="rail-nav">
        <router-link to="/dashboard" class="rail-link" exact-active-class="active">Dashboard</router-link>
        <router-link to="/dashboard/events" class="rail-link" active-class="active">Event Management</router-link>
      </nav>

      <div class="rail-footer">
        <router-link to="/" class="rail-link">&larr; Back to Public</router-link>
      </div>
    </aside>

    <!-- PANE: Area utama dinamis tempat konten berubah dan bisa digulir secara mandiri -->
    <main class="dashboard-pane">
      <div class="pane-content">
        <RouterView />
      </div>
    </main>

  </div>
</template>

<style scoped>
/*
  Full-screen app layout (khas dashboard).
  Tinggi dibatasi 100vh agar bagian rail tidak ikut terguyur ke atas saat pane di-scroll.
*/
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-gray);
}

/* RAIL STYLES */
.dashboard-rail {
  width: 220px;
  flex: 0 0 220px;
  background-color: #1c1948; /* Kontras gelap membedakan area nav dan konten */
  color: white;
  display: flex;
  flex-direction: column;
}

.rail-brand {
  padding: var(--space-6);
  font-size: 1.2rem;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.rail-brand a { color: white; text-decoration: none; }

.rail-nav {
  flex: 1;
  padding: var(--space-6) 0;
  display: flex;
  flex-direction: column;
}

.rail-link {
  padding: var(--space-3) var(--space-6);
  color: #a0a0b0;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.rail-link:hover, .rail-link.active {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border-left: 4px solid var(--primary);
}

.rail-footer { padding: var(--space-6); border-top: 1px solid rgba(255, 255, 255, 0.1); }

/* PANE STYLES */
.dashboard-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Scroll khusus untuk area ini saja */
}

.pane-content {
  padding: var(--space-8);
}

@media (max-width: 760px) {
  .dashboard-rail {
    width: 180px;
    flex-basis: 180px;
  }

  .pane-content {
    padding: var(--space-4);
  }
}

@media (max-width: 520px) {
  .dashboard-layout {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    flex-direction: column;
  }

  .dashboard-rail {
    width: 100%;
    flex-basis: auto;
  }

  .rail-nav {
    padding: var(--space-2) 0;
  }

  .rail-footer {
    display: none;
  }

  .dashboard-pane {
    overflow-y: visible;
  }
}
</style>