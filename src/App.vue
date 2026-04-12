<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppBar from './components/app/AppBar.vue'
import AppFooter from './components/app/AppFooter.vue'
import GuestSessionBanner from './components/GuestSessionBanner.vue'
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.vue'
import GlobalToastContainer from './components/GlobalToastContainer.vue'

const route = useRoute()
</script>

<template>
  <v-app>
    <app-bar />
    <GuestSessionBanner />
    <v-main >
      <router-view />
    </v-main>
    <app-footer v-if="route.name !== 'create'" />

    <!-- Global Loading Overlay -->
    <GlobalLoadingOverlay />

    <!-- Global Toast Container -->
    <GlobalToastContainer />
  </v-app>
</template>
