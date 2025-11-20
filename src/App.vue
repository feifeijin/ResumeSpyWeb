<script setup lang="ts">
import AppBar from './components/app/AppBar.vue'
import AppFooter from './components/app/AppFooter.vue'
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.vue'
import GlobalToastContainer from './components/GlobalToastContainer.vue'
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

    <!-- Global Toast Container -->
    <GlobalToastContainer />
  </v-app>
</template>
