<script setup lang="ts">
import AppBar from './components/app/AppBar.vue'
import AppFooter from './components/app/AppFooter.vue'
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.vue'
</script>

<template>
  <v-app>
    <app-bar />
    <v-main>
      <router-view />
    </v-main>
    <app-footer />

    <!-- Global Loading Overlay -->
    <GlobalLoadingOverlay />
  </v-app>
</template>
