<template>
  <div v-if="showGuestBanner" class="guest-banner">
    <div class="guest-banner-content">
      <div class="guest-info">
        <v-icon icon="mdi-account-circle-outline"></v-icon>
        <span class="guest-text">
          You're browsing as a guest ({{ guestStore.resumeCount }}/{{
            guestStore.maxResumeCount
          }}
          resumes)
        </span>
      </div>
      <div class="guest-actions">
        <v-btn
          v-if="!guestStore.hasReachedLimit"
          size="small"
          variant="text"
          color="primary"
          @click="showUpgradeDialog = true"
        >
          Create Account
        </v-btn>
        <v-btn v-else size="small" variant="text" color="error" @click="showUpgradeDialog = true">
          Upgrade to Create More
        </v-btn>
        <v-btn size="small" variant="text" icon="mdi-close" @click="dismissGuestBanner"></v-btn>
      </div>
    </div>
  </div>

  <!-- Registration Prompt Dialog -->
  <v-dialog v-model="showUpgradeDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6 text-center mb-4">
        <v-icon icon="mdi-alert-circle" color="warning" size="large" class="mr-2"></v-icon>
        Create an Account to Continue
      </v-card-title>
      <v-card-text>
        <p class="mb-4">
          <strong>You've reached your guest resume limit!</strong>
        </p>
        <p class="mb-6">Create a free account to:</p>
        <ul class="features-list">
          <li>Create unlimited resumes</li>
          <li>Save your work securely</li>
          <li>Access all premium features</li>
          <li>Download and share your resumes</li>
        </ul>
      </v-card-text>
      <v-card-actions class="justify-end pa-6">
        <v-btn variant="text" @click="showUpgradeDialog = false"> Continue as Guest </v-btn>
        <v-btn color="primary" variant="elevated" @click="goToSignup"> Sign Up Now </v-btn>
      </v-card-actions>
    </v-card>
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
  // Initialize guest session if one exists
  const hasExistingSession = await guestStore.initializeGuestSession()

  // Check if guest should be shown the banner
  if (guestStore.isGuest && !bannerDismissed.value) {
    showGuestBanner.value = true
  }

  // Show upgrade dialog if guest has reached limit
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
.guest-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.guest-banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.guest-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.guest-text {
  font-size: 14px;
  font-weight: 500;
}

.guest-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.features-list {
  padding-left: 24px;
  margin: 0;
}

.features-list li {
  margin-bottom: 8px;
  font-size: 14px;
}
</style>
