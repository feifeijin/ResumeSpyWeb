<template>
  <div v-if="showGuestBanner" class="guest-banner">
    <span class="banner-glyph">◈</span>
    <span class="banner-text">
      Browsing as a guest — {{ guestStore.resumeCount }}/{{ guestStore.maxResumeCount }} dossiers on file
    </span>
    <div class="banner-actions">
      <button
        v-if="!guestStore.hasReachedLimit"
        class="banner-btn"
        @click="showUpgradeDialog = true"
      >
        Create Account
      </button>
      <button
        v-else
        class="banner-btn banner-btn--warn"
        @click="showUpgradeDialog = true"
      >
        Sign In to Continue
      </button>
      <button class="banner-close" @click="dismissGuestBanner">✕</button>
    </div>
  </div>

  <!-- Upgrade Dialog -->
  <v-dialog v-model="showUpgradeDialog" max-width="460">
    <div class="noir-dialog">
      <div class="dialog-header">
        <h3 class="dialog-title">Open a Permanent File</h3>
        <button class="dialog-close" @click="showUpgradeDialog = false">✕</button>
      </div>
      <div class="dialog-body">
        <p class="dialog-desc">
          You've reached your guest limit. Create a free account to unlock:
        </p>
        <ul class="dialog-list">
          <li>✦ &nbsp;Unlimited dossiers</li>
          <li>✦ &nbsp;Secure, permanent storage</li>
          <li>✦ &nbsp;AI tailoring & translation</li>
          <li>✦ &nbsp;PDF export</li>
        </ul>
      </div>
      <div class="dialog-footer">
        <button class="btn-ghost" @click="showUpgradeDialog = false">Continue as Guest</button>
        <button class="btn-ink" @click="goToSignup">Sign Up Now</button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGuestStore } from '@/stores/guest'

const router = useRouter()
const guestStore = useGuestStore()

const showGuestBanner = ref(false)
const showUpgradeDialog = ref(false)
const bannerDismissed = ref(false)

onMounted(async () => {
  await guestStore.initializeGuestSession()
  if (guestStore.isGuest && !bannerDismissed.value) {
    showGuestBanner.value = true
  }
  if (guestStore.hasReachedLimit) {
    showUpgradeDialog.value = true
  }
})

const dismissGuestBanner = () => {
  bannerDismissed.value = true
  showGuestBanner.value = false
}

const goToSignup = () => {
  router.push('/auth/register')
}
</script>

<style scoped>
/* ── Banner ──────────────────────────────────────────────── */
.guest-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #0f0d0b;
  border-bottom: 1px solid #2e2620;
  padding: 0.6rem 1.5rem;
  font-family: 'Special Elite', cursive;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  position: relative;
  z-index: 40;
}

.banner-glyph {
  color: #7a5f22;
  flex-shrink: 0;
}

.banner-text {
  color: #6a5f52;
  flex: 1;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.banner-btn {
  font-family: 'Special Elite', cursive;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: #c49a38;
  background: none;
  border: 1px solid #7a5f22;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.banner-btn:hover { color: #d4a940; border-color: #c49a38; }

.banner-btn--warn { color: #8b3a3a; border-color: #5a2020; }
.banner-btn--warn:hover { color: #c05050; border-color: #8b3a3a; }

.banner-close {
  background: none;
  border: none;
  color: #3e352a;
  cursor: pointer;
  font-size: 0.75rem;
  transition: color 0.2s;
  padding: 0 0.25rem;
}

.banner-close:hover { color: #6a5f52; }

/* ── Dialog ──────────────────────────────────────────────── */
.noir-dialog {
  background: #0f0d0b;
  border: 1px solid #2e2620;
  box-shadow: 6px 6px 0 #090807, 12px 12px 0 rgba(0,0,0,0.3);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #2e2620;
}

.dialog-title {
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: 700;
  color: #e2d5bc;
  letter-spacing: 0.1em;
  margin: 0;
}

.dialog-close {
  background: none;
  border: none;
  color: #6a5f52;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}

.dialog-close:hover { color: #e2d5bc; }

.dialog-body { padding: 1.5rem; }

.dialog-desc {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  color: #6a5f52;
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
  font-family: 'Special Elite', cursive;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  color: #c49a38;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #2e2620;
}

.btn-ink {
  font-family: 'Special Elite', cursive;
  font-size: 0.82rem;
  letter-spacing: 0.15em;
  color: #090807;
  background: #c49a38;
  border: none;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.3s;
}

.btn-ink:hover { background: #d4a940; }

.btn-ghost {
  font-family: 'Special Elite', cursive;
  font-size: 0.82rem;
  letter-spacing: 0.15em;
  color: #6a5f52;
  background: transparent;
  border: 1px solid #2e2620;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: border-color 0.3s, color 0.3s;
}

.btn-ghost:hover { border-color: #7a5f22; color: #e2d5bc; }
</style>
