<script setup lang="ts">
import AppBar from './components/app/AppBar.vue'
import AppFooter from './components/app/AppFooter.vue'
</script>

<template>
  <v-app>
    <app-bar />
    <v-main>
      <router-view />
    </v-main>
    <app-footer />
  </v-app>
</template>
