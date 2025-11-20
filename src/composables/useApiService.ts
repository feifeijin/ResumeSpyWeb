import { useLoading } from '@/composables/useLoading'
import { useI18n } from 'vue-i18n'

/**
 * Service wrapper utility for common API operations with global loading
 * Use this utility in your service files or components for consistent loading behavior
 */

export const useApiService = () => {
  const { withLoading, commonMessages } = useLoading()
  const { t } = useI18n()

  /**
   * Wrapper for CREATE operations
   */
  const createWithLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
  ): Promise<T> => {
    return withLoading(operation, {
      id: `create-${Date.now()}`,
      message: message || commonMessages.creating,
    })
  }

  /**
   * Wrapper for UPDATE operations
   */
  const updateWithLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
  ): Promise<T> => {
    return withLoading(operation, {
      id: `update-${Date.now()}`,
      message: message || commonMessages.updating,
    })
  }

  /**
   * Wrapper for DELETE operations
   */
  const deleteWithLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
  ): Promise<T> => {
    return withLoading(operation, {
      id: `delete-${Date.now()}`,
      message: message || commonMessages.deleting,
    })
  }

  /**
   * Wrapper for SAVE operations
   */
  const saveWithLoading = async <T>(operation: () => Promise<T>, message?: string): Promise<T> => {
    return withLoading(operation, {
      id: `save-${Date.now()}`,
      message: message || commonMessages.saving,
    })
  }

  /**
   * Wrapper for SYNC operations
   */
  const syncWithLoading = async <T>(operation: () => Promise<T>, message?: string): Promise<T> => {
    return withLoading(operation, {
      id: `sync-${Date.now()}`,
      message: message || commonMessages.syncing,
    })
  }

  /**
   * Wrapper for generic operations with custom messages
   */
  const customLoadingOperation = async <T>(
    operation: () => Promise<T>,
    options: {
      message?: string
      progress?: number
      operationType?: string
    },
  ): Promise<T> => {
    return withLoading(operation, {
      id: `${options.operationType || 'operation'}-${Date.now()}`,
      message: options.message || t('common.loading'),
      progress: options.progress,
    })
  }

  return {
    createWithLoading,
    updateWithLoading,
    deleteWithLoading,
    saveWithLoading,
    syncWithLoading,
    customLoadingOperation,

    // Direct access to the loading composable for advanced usage
    withLoading,
    commonMessages,
  }
}
