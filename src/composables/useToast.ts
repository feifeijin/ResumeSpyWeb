import { useToastStore, type ToastMessage } from '@/stores/toast'
import { useI18n } from 'vue-i18n'

export const useToast = () => {
  const toastStore = useToastStore()
  const { t } = useI18n()

  // Enhanced toast methods with common patterns
  const toast = {
    success: (
      message: string,
      options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>,
    ) => {
      const translatedMessage = message.includes('.') ? t(message) : message
      return toastStore.showSuccess(translatedMessage, options)
    },

    error: (message: string, options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>) => {
      const translatedMessage = message.includes('.') ? t(message) : message
      return toastStore.showError(translatedMessage, {
        persistent: false, // Allow manual dismissal
        ...options,
      })
    },

    warning: (
      message: string,
      options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>,
    ) => {
      const translatedMessage = message.includes('.') ? t(message) : message
      return toastStore.showWarning(translatedMessage, options)
    },

    info: (message: string, options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>) => {
      const translatedMessage = message.includes('.') ? t(message) : message
      return toastStore.showInfo(translatedMessage, options)
    },
  }

  // Common operation messages with i18n support
  const showOperationResult = (
    operation: string,
    success: boolean,
    customMessage?: string,
    options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>,
  ) => {
    if (success) {
      const message =
        customMessage ||
        t(`toast.${operation}.success`, { fallback: `${operation} completed successfully` })
      return toast.success(message, options)
    } else {
      const message =
        customMessage || t(`toast.${operation}.error`, { fallback: `${operation} failed` })
      return toast.error(message, options)
    }
  }

  // API operation wrappers
  const apiToast = {
    created: (itemName?: string) => {
      const message = itemName
        ? t('toast.created.withName', { name: itemName }, `${itemName} created successfully`)
        : t('toast.created.generic', 'Created successfully')
      return toast.success(message)
    },

    updated: (itemName?: string) => {
      const message = itemName
        ? t('toast.updated.withName', { name: itemName }, `${itemName} updated successfully`)
        : t('toast.updated.generic', 'Updated successfully')
      return toast.success(message)
    },

    deleted: (itemName?: string) => {
      const message = itemName
        ? t('toast.deleted.withName', { name: itemName }, `${itemName} deleted successfully`)
        : t('toast.deleted.generic', 'Deleted successfully')
      return toast.success(message)
    },

    saved: (itemName?: string) => {
      const message = itemName
        ? t('toast.saved.withName', { name: itemName }, `${itemName} saved successfully`)
        : t('toast.saved.generic', 'Saved successfully')
      return toast.success(message)
    },

    synced: (itemName?: string) => {
      const message = itemName
        ? t('toast.synced.withName', { name: itemName }, `${itemName} synchronized successfully`)
        : t('toast.synced.generic', 'Synchronized successfully')
      return toast.success(message)
    },

    cloned: (itemName?: string) => {
      const message = itemName
        ? t('toast.cloned.withName', { name: itemName }, `${itemName} cloned successfully`)
        : t('toast.cloned.generic', 'Cloned successfully')
      return toast.success(message)
    },

    // Error messages
    createFailed: (itemName?: string, error?: string) => {
      const message = itemName
        ? t('toast.createFailed.withName', { name: itemName }, `Failed to create ${itemName}`)
        : t('toast.createFailed.generic', 'Creation failed')
      return toast.error(error ? `${message}: ${error}` : message)
    },

    updateFailed: (itemName?: string, error?: string) => {
      const message = itemName
        ? t('toast.updateFailed.withName', { name: itemName }, `Failed to update ${itemName}`)
        : t('toast.updateFailed.generic', 'Update failed')
      return toast.error(error ? `${message}: ${error}` : message)
    },

    deleteFailed: (itemName?: string, error?: string) => {
      const message = itemName
        ? t('toast.deleteFailed.withName', { name: itemName }, `Failed to delete ${itemName}`)
        : t('toast.deleteFailed.generic', 'Deletion failed')
      return toast.error(error ? `${message}: ${error}` : message)
    },

    saveFailed: (itemName?: string, error?: string) => {
      const message = itemName
        ? t('toast.saveFailed.withName', { name: itemName }, `Failed to save ${itemName}`)
        : t('toast.saveFailed.generic', 'Save failed')
      return toast.error(error ? `${message}: ${error}` : message)
    },

    syncFailed: (itemName?: string, error?: string) => {
      const message = itemName
        ? t('toast.syncFailed.withName', { name: itemName }, `Failed to synchronize ${itemName}`)
        : t('toast.syncFailed.generic', 'Synchronization failed')
      return toast.error(error ? `${message}: ${error}` : message)
    },

    cloneFailed: (itemName?: string, error?: string) => {
      const message = itemName
        ? t('toast.cloneFailed.withName', { name: itemName }, `Failed to clone ${itemName}`)
        : t('toast.cloneFailed.generic', 'Clone failed')
      return toast.error(error ? `${message}: ${error}` : message)
    },
  }

  // Validation warnings
  const validationToast = {
    required: (fieldName: string) => {
      const message = t(
        'toast.validation.required',
        { field: fieldName },
        `${fieldName} is required`,
      )
      return toast.warning(message)
    },

    invalid: (fieldName: string) => {
      const message = t('toast.validation.invalid', { field: fieldName }, `${fieldName} is invalid`)
      return toast.warning(message)
    },

    tooLong: (fieldName: string, maxLength: number) => {
      const message = t(
        'toast.validation.tooLong',
        { field: fieldName, max: maxLength },
        `${fieldName} must be less than ${maxLength} characters`,
      )
      return toast.warning(message)
    },

    tooShort: (fieldName: string, minLength: number) => {
      const message = t(
        'toast.validation.tooShort',
        { field: fieldName, min: minLength },
        `${fieldName} must be at least ${minLength} characters`,
      )
      return toast.warning(message)
    },
  }

  return {
    // Basic toast methods
    ...toast,

    // Advanced methods
    showOperationResult,

    // Pre-configured API operation toasts
    api: apiToast,

    // Validation toasts
    validation: validationToast,

    // Store access for advanced usage
    store: toastStore,

    // Clear all toasts
    clear: toastStore.clearAllToasts,

    // Remove specific toast
    remove: toastStore.removeToast,
  }
}
