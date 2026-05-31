<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import AppBar from './components/app/AppBar.vue'
import AppFooter from './components/app/AppFooter.vue'
import GuestSessionBanner from './components/GuestSessionBanner.vue'
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.vue'
import GlobalToastContainer from './components/GlobalToastContainer.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import MaintenanceView from './views/MaintenanceView.vue'
import ServiceUnavailableView from './views/ServiceUnavailableView.vue'
import { useServiceStatusStore } from '@/stores/serviceStatus'

const route = useRoute()

const hideFooterRoutes = new Set(['create', 'privacy', 'terms', 'commercial-transactions'])

const serviceStatus = useServiceStatusStore()
const { maintenanceMode, apiDown } = storeToRefs(serviceStatus)

// Maintenance / service-unavailable take over the chrome too — no AppBar/Footer
// to avoid triggering further API calls (e.g. auth-bound nav state).
const showChrome = computed(() => !maintenanceMode.value && !apiDown.value)
</script>

<template>
  <v-app>
    <template v-if="maintenanceMode">
      <MaintenanceView />
    </template>
    <template v-else-if="apiDown">
      <ServiceUnavailableView />
    </template>
    <template v-else>
      <app-bar v-if="showChrome" />
      <v-main>
        <GuestSessionBanner />
        <ErrorBoundary>
          <router-view />
        </ErrorBoundary>
      </v-main>
      <app-footer v-if="showChrome && !hideFooterRoutes.has(route.name as string)" />
    </template>

    <!-- Global Loading Overlay -->
    <GlobalLoadingOverlay />

    <!-- Global Toast Container -->
    <GlobalToastContainer />
  </v-app>
</template>
