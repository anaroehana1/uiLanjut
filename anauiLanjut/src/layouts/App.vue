<script setup lang="ts">
import Navbar from '@/components/app/Navbar.vue';
import Breadcrumb from '@/components/app/Breadcrumb.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
    <div class="app-layout">
        <Navbar />
        <main class="main-content">
            <Breadcrumb v-if="!route.path.startsWith('/browse')" />
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
