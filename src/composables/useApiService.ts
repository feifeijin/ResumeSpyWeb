import { useLoading } from '@/composables/useLoading'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'

/**
 * Service wrapper utility for common API operations with global loading and toast notifications
 * Use this utility in your service files or components for consistent loading and feedback behavior
 */

export const useApiService = () => {
  const { withLoading, commonMessages } = useLoading()
  const { t } = useI18n()
  const toast = useToast()

  /**
   * Wrapper for CREATE operations with automatic success toast
   */
  const createWithLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
    showSuccessToast: boolean = true,
  ): Promise<T> => {
    const result = await withLoading(operation, {
      id: `create-${Date.now()}`,
      message: message || commonMessages.creating,
    })

    if (showSuccessToast) {
      toast.success('toast.success.createSuccess')
    }

    return result
  }

  /**
   * Wrapper for UPDATE operations with automatic success toast
   */
  const updateWithLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
    showSuccessToast: boolean = true,
  ): Promise<T> => {
    const result = await withLoading(operation, {
      id: `update-${Date.now()}`,
      message: message || commonMessages.updating,
    })

    if (showSuccessToast) {
      toast.success('toast.success.updateSuccess')
    }

    return result
  }

  /**
   * Wrapper for DELETE operations with automatic success toast
   */
  const deleteWithLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
    showSuccessToast: boolean = true,
  ): Promise<T> => {
    const result = await withLoading(operation, {
      id: `delete-${Date.now()}`,
      message: message || commonMessages.deleting,
    })

    if (showSuccessToast) {
      toast.success('toast.success.deleteSuccess')
    }

    return result
  }

  /**
   * Wrapper for SAVE operations with automatic success toast
   */
  const saveWithLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
    showSuccessToast: boolean = true,
  ): Promise<T> => {
    const result = await withLoading(operation, {
      id: `save-${Date.now()}`,
      message: message || commonMessages.saving,
    })

    if (showSuccessToast) {
      toast.success('toast.success.saveSuccess')
    }

    return result
  }

  /**
   * Wrapper for SYNC operations with automatic success toast
   */
  const syncWithLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
    showSuccessToast: boolean = true,
  ): Promise<T> => {
    const result = await withLoading(operation, {
      id: `sync-${Date.now()}`,
      message: message || commonMessages.syncing,
    })

    if (showSuccessToast) {
      toast.success('toast.success.syncSuccess')
    }

    return result
  }

  /**
   * Wrapper for generic operations with custom messages and optional toast
   */
  const customLoadingOperation = async <T>(
    operation: () => Promise<T>,
    options: {
      message?: string
      progress?: number
      operationType?: string
      showSuccessToast?: boolean
      successMessage?: string
    },
  ): Promise<T> => {
    const result = await withLoading(operation, {
      id: `${options.operationType || 'operation'}-${Date.now()}`,
      message: options.message || t('common.loading'),
      progress: options.progress,
    })

    if (options.showSuccessToast) {
      toast.success(options.successMessage || 'toast.success.operationCompleted')
    }

    return result
  }

  return {
    createWithLoading,
    updateWithLoading,
    deleteWithLoading,
    saveWithLoading,
    syncWithLoading,
    customLoadingOperation,

    // Direct access to composables for advanced usage
    withLoading,
    commonMessages,
    toast,
  }
}
