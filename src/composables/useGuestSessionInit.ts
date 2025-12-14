import { onMounted } from 'vue'
import { useGuestStore } from '@/stores/guest'
import { useAuthStore } from '@/stores/auth'

/**
 * Composable to initialize guest session on app startup
 */
export function useGuestSessionInit() {
  const guestStore = useGuestStore()
  const authStore = useAuthStore()

  onMounted(async () => {
    // If user is not authenticated, try to restore guest session
    if (!authStore.isAuthenticated) {
      await guestStore.initializeGuestSession()
    }
  })

  return {
    guestStore,
    authStore,
  }
}
