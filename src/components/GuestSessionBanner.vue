<template>
  <Transition name="banner-slide">
    <div v-if="showBanner" class="guest-banner">
      <span class="banner-glyph">◈</span>
      <span class="banner-text">
        {{ t('components.guestBanner.browsing', { current: guestStore.resumeCount, max: guestStore.maxResumeCount }) }}
      </span>
      <div class="banner-actions">
        <button
          v-if="!guestStore.hasReachedLimit"
          class="banner-btn"
          @click="showUpgradeDialog = true"
        >
          {{ t('components.guestBanner.createAccount') }}
        </button>
        <button
          v-else
          class="banner-btn banner-btn--warn"
          @click="showUpgradeDialog = true"
        >
          {{ t('components.guestBanner.signInContinue') }}
        </button>
        <button class="banner-close" @click="dismiss" :aria-label="t('components.guestBanner.close')">✕</button>
      </div>
    </div>
  </Transition>

  <!-- Upgrade Dialog -->
  <v-dialog v-model="showUpgradeDialog" max-width="460">
    <div class="noir-dialog">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ t('components.guestBanner.upgradeTitle') }}</h3>
        <button class="dialog-close" @click="showUpgradeDialog = false">✕</button>
      </div>
      <div class="dialog-body">
        <p class="dialog-desc">{{ t('components.guestBanner.upgradeDesc') }}</p>
        <ul class="dialog-list">
          <li>✦ &nbsp;{{ t('components.guestBanner.featureUnlimited') }}</li>
          <li>✦ &nbsp;{{ t('components.guestBanner.featureStorage') }}</li>
          <li>✦ &nbsp;{{ t('components.guestBanner.featureAi') }}</li>
          <li>✦ &nbsp;{{ t('components.guestBanner.featurePdf') }}</li>
        </ul>
      </div>
      <div class="dialog-footer">
        <button class="btn-ghost" @click="showUpgradeDialog = false">
          {{ t('components.guestBanner.continueAsGuest') }}
        </button>
        <button class="btn-ink" @click="goToAuth">
          {{ t('components.guestBanner.signUpNow') }}
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGuestStore } from '@/stores/guest'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t } = useI18n()
const guestStore = useGuestStore()
const authStore = useAuthStore()

const dismissed = ref(false)
const showUpgradeDialog = ref(false)

// Show banner only once quota data has loaded (avoids "0/0" flash on mount)
const showBanner = computed(
  () =>
    !authStore.isAuthenticated &&
    guestStore.isGuest &&
    guestStore.maxResumeCount > 0 &&
    !dismissed.value,
)

// Auto-open upgrade dialog when limit is hit while on page
watch(
  () => guestStore.hasReachedLimit,
  (hit) => {
    if (hit && showBanner.value) showUpgradeDialog.value = true
  },
)

const dismiss = () => {
  dismissed.value = true
}

const goToAuth = () => {
  showUpgradeDialog.value = false
  router.push({ name: 'auth' })
}
</script>

<style scoped>
/* ── Slide transition ─────────────────────────────────────── */
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}
.banner-slide-enter-from,
.banner-slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.banner-slide-enter-to,
.banner-slide-leave-from {
  max-height: 60px;
  opacity: 1;
}

/* ── Banner ──────────────────────────────────────────────── */
.guest-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #F5F5F5;
  border-bottom: 1px solid #D4D4D4;
  padding: 0.6rem 1.5rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  position: relative;
  z-index: 40;
}

.banner-glyph {
  color: #888888;
  flex-shrink: 0;
}

.banner-text {
  color: #666666;
  flex: 1;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.banner-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: #121212;
  background: none;
  border: 1px solid #D4D4D4;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.banner-btn:hover { color: #2B2B2B; border-color: #888888; }

.banner-btn--warn { color: #666666; }
.banner-btn--warn:hover { color: #121212; border-color: #888888; }

.banner-close {
  background: none;
  border: none;
  color: #AAAAAA;
  cursor: pointer;
  font-size: 0.75rem;
  transition: color 0.2s;
  padding: 0 0.25rem;
}

.banner-close:hover { color: #666666; }

/* ── Dialog ──────────────────────────────────────────────── */
.noir-dialog {
  background: #F0F0F0;
  border: 1.5px solid #D4D4D4;
  box-shadow: 6px 6px 0 #AAAAAA;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #D4D4D4;
}

.dialog-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: 0.1em;
  margin: 0;
}

.dialog-close {
  background: none;
  border: none;
  color: #888888;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}

.dialog-close:hover { color: #121212; }

.dialog-body { padding: 1.5rem; }

.dialog-desc {
  font-family: 'Inter', system-ui, sans-serif;
  font-style: italic;
  color: #666666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.dialog-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.dialog-list li {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  color: #121212;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #D4D4D4;
}

.btn-ink {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  letter-spacing: 0.15em;
  color: #F5F5F5;
  background: #121212;
  border: 1.5px solid #121212;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 3px 3px 0 #AAAAAA;
}

.btn-ink:hover {
  background: #2B2B2B;
  transform: translateY(-1px);
  box-shadow: 4px 4px 0 #AAAAAA;
}

.btn-ghost {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  letter-spacing: 0.15em;
  color: #666666;
  background: transparent;
  border: 1.5px solid #D4D4D4;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: border-color 0.3s, color 0.3s;
}

.btn-ghost:hover { border-color: #888888; color: #121212; }
</style>
