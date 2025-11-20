import { useLoadingStore } from '@/stores/loading'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

export const useLoading = () => {
  const loadingStore = useLoadingStore()
  const { t } = useI18n()
  const toast = useToast()

  // Helper function to generate unique loading IDs
  const generateLoadingId = (prefix: string = 'operation') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Wrapper function for API calls with automatic loading management and error handling
  const withLoading = async <T>(
    operation: () => Promise<T>,
    options: {
      id?: string
      message?: string
      progress?: number
      onProgress?: (progress: number) => void
      showErrorToast?: boolean
      errorMessage?: string
    } = {},
  ): Promise<T> => {
    const loadingId = options.id || generateLoadingId()

    try {
      // Start loading
      loadingStore.startLoading(loadingId, options.message, options.progress)

      // Execute the operation
      const result = await operation()

      return result
    } catch (error) {
      // Show error toast if enabled (default: true)
      if (options.showErrorToast !== false) {
        const errorMsg = options.errorMessage || 'toast.error.operationFailed'
        toast.error(errorMsg)
      }

      // Re-throw the error so calling code can handle it if needed
      throw error
    } finally {
      // Always stop loading, even if operation fails
      loadingStore.stopLoading(loadingId)
    }
  }

  // Helper functions for common loading messages
  const withLoadingMessage = (key: string, params?: Record<string, unknown>) => {
    return params ? t(key, params) : t(key)
  }

  // Predefined loading messages for common operations
  const commonMessages = {
    creating: t('loading.creating'),
    updating: t('loading.updating'),
    deleting: t('loading.deleting'),
    saving: t('loading.saving'),
    loading: t('loading.loading'),
    syncing: t('loading.syncing'),
    processing: t('loading.processing'),
    uploading: t('loading.uploading'),
    downloading: t('loading.downloading'),
  }

  return {
    // Store access
    ...loadingStore,

    // Helper functions
    withLoading,
    withLoadingMessage,
    generateLoadingId,
    commonMessages,

    // Manual control (for complex scenarios)
    startLoading: loadingStore.startLoading,
    updateLoading: loadingStore.updateLoading,
    stopLoading: loadingStore.stopLoading,
    stopAllLoading: loadingStore.stopAllLoading,

    // Direct toast access for advanced usage
    toast,
  }
}
