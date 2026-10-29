<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/app/Navbar.vue';
import Breadcrumb from '@/components/app/Breadcrumb.vue';

const route = useRoute();
const showBreadcrumb = computed(() =>
    !['event-detail', 'event-registration', 'ticket-receipt'].includes(String(route.name))
);
</script>

<template>
    <div class="app-layout">
        <Navbar />
        <main class="main-content">
            <Breadcrumb v-if="showBreadcrumb" />
            <router-view />
        </main>
    </div>
</template>

<style scoped>
.app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.main-content {
    flex: 1;
    padding: 2rem;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
}
</style>
