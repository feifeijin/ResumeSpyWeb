<template>
  <div class="global-toast-container">
    <v-snackbar
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :model-value="true"
      :color="getToastColor(toast.type)"
      :timeout="toast.persistent ? -1 : toast.duration || 5000"
      location="top center"
      :multi-line="toast.message.length > 60"
      :vertical="!!toast.actions && toast.actions.length > 0"
      class="toast-item"
      :style="{
        zIndex: 10000 + getToastIndex(toast.id),
        marginTop: `${getToastIndex(toast.id) * 80}px`,
      }"
      @update:model-value="(value) => !value && toastStore.removeToast(toast.id)"
    >
      <div class="d-flex align-center">
        <v-icon :icon="getToastIcon(toast.type)" class="me-3" size="small" />

        <span class="toast-message">{{ toast.message }}</span>
      </div>

      <template v-slot:actions v-if="toast.actions && toast.actions.length > 0">
        <v-btn
          v-for="(action, index) in toast.actions"
          :key="index"
          variant="text"
          size="small"
          @click="action.action"
          class="me-2"
        >
          {{ action.text }}
        </v-btn>
      </template>

      <template v-slot:actions v-else>
        <v-btn
          variant="text"
          size="small"
          icon="mdi-close"
          @click="toastStore.removeToast(toast.id)"
        />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useToastStore, type ToastType } from '@/stores/toast'

const toastStore = useToastStore()

// Get toast index for positioning
const getToastIndex = (id: string): number => {
  return toastStore.toasts.findIndex((toast) => toast.id === id)
}

// Get appropriate color for toast type
const getToastColor = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'primary'
  }
}

// Get appropriate icon for toast type
const getToastIcon = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return 'mdi-check-circle'
    case 'error':
      return 'mdi-alert-circle'
    case 'warning':
      return 'mdi-alert'
    case 'info':
      return 'mdi-information'
    default:
      return 'mdi-information'
  }
}

// Define component name for Vue DevTools
defineOptions({
  name: 'GlobalToastContainer',
})
</script>

<style scoped>
.global-toast-container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  position: fixed !important;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  max-width: 500px;
}

.toast-message {
  line-height: 1.4;
  word-wrap: break-word;
}

/* Override Vuetify's default snackbar positioning */
.toast-item :deep(.v-snackbar__wrapper) {
  position: static;
}

/* Custom animations for stacked toasts */
.toast-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Toast type specific styling */
.toast-item :deep(.v-snackbar--variant-flat.bg-success) {
  background-color: rgb(var(--v-theme-success)) !important;
}

.toast-item :deep(.v-snackbar--variant-flat.bg-error) {
  background-color: rgb(var(--v-theme-error)) !important;
}

.toast-item :deep(.v-snackbar--variant-flat.bg-warning) {
  background-color: rgb(var(--v-theme-warning)) !important;
  color: rgb(var(--v-theme-on-warning)) !important;
}

.toast-item :deep(.v-snackbar--variant-flat.bg-info) {
  background-color: rgb(var(--v-theme-info)) !important;
}
</style>
