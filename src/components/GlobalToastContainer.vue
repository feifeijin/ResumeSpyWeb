<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="false">
    <transition-group name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast-item--${toast.type}`"
        role="alert"
      >
        <v-icon :icon="getToastIcon(toast.type)" class="toast-icon" size="small" />

        <span class="toast-message">{{ toast.message }}</span>

        <div v-if="toast.actions && toast.actions.length > 0" class="toast-actions">
          <button
            v-for="(action, index) in toast.actions"
            :key="index"
            class="toast-action-btn"
            @click="action.action"
          >
            {{ action.text }}
          </button>
        </div>

        <button class="toast-close" @click="toastStore.removeToast(toast.id)" aria-label="Dismiss">
          <v-icon icon="mdi-close" size="x-small" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToastStore, type ToastType } from '@/stores/toast'

const toastStore = useToastStore()

const getToastIcon = (type: ToastType): string => {
  switch (type) {
    case 'success': return 'mdi-check-circle'
    case 'error':   return 'mdi-alert-circle'
    case 'warning': return 'mdi-alert'
    case 'info':    return 'mdi-information'
    default:        return 'mdi-information'
  }
}

defineOptions({ name: 'GlobalToastContainer' })
</script>

<style scoped>
/* ── Stack container ────────────────────────────────────────────
   pointer-events: none means the empty space between/around toasts
   never blocks clicks on the page beneath.                       */
.toast-stack {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  width: max-content;
  max-width: min(500px, 90vw);
}

/* ── Individual toast ───────────────────────────────────────────
   pointer-events: auto re-enables clicks only on the toast itself. */
.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  min-width: 300px;
  max-width: min(500px, 90vw);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  font-size: 0.875rem;
  line-height: 1.4;
  color: #fff;
  word-break: break-word;
}

/* ── Colours ─────────────────────────────────────────────────── */
.toast-item--success { background: rgb(var(--v-theme-success)); }
.toast-item--error   { background: rgb(var(--v-theme-error)); }
.toast-item--warning { background: rgb(var(--v-theme-warning)); color: rgba(0,0,0,.87); }
.toast-item--info    { background: rgb(var(--v-theme-info)); }

.toast-icon {
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
}

/* ── Action buttons ──────────────────────────────────────────── */
.toast-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.toast-action-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px 10px;
}
.toast-action-btn:hover {
  background: rgba(255,255,255,0.35);
}

/* ── Close button ────────────────────────────────────────────── */
.toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0.7;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
.toast-close:hover {
  opacity: 1;
  background: rgba(255,255,255,0.15);
}

/* ── Slide-in / fade-out animation ──────────────────────────── */
.toast-enter-active {
  transition: all 0.25s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.toast-move {
  transition: transform 0.25s ease;
}
</style>
