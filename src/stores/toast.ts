import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
  duration?: number
  actions?: Array<{
    text: string
    action: () => void
  }>
  persistent?: boolean
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])
  const maxToasts = 3 // Maximum number of toasts shown at once

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastMessage = {
      id,
      duration: toast.duration ?? getDefaultDuration(toast.type),
      ...toast,
    }

    toasts.value.unshift(newToast)

    // Keep only maximum number of toasts
    if (toasts.value.length > maxToasts) {
      toasts.value = toasts.value.slice(0, maxToasts)
    }

    // Auto remove toast after duration (unless persistent)
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  const getDefaultDuration = (type: ToastType): number => {
    switch (type) {
      case 'success':
        return 4000
      case 'info':
        return 5000
      case 'warning':
        return 6000
      case 'error':
        return 8000 // Longer for errors
      default:
        return 5000
    }
  }

  // Convenience methods for common toast types
  const showSuccess = (
    message: string,
    options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>,
  ) => {
    return addToast({ message, type: 'success', ...options })
  }

  const showError = (
    message: string,
    options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>,
  ) => {
    return addToast({ message, type: 'error', ...options })
  }

  const showWarning = (
    message: string,
    options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>,
  ) => {
    return addToast({ message, type: 'warning', ...options })
  }

  const showInfo = (
    message: string,
    options?: Partial<Omit<ToastMessage, 'id' | 'type' | 'message'>>,
  ) => {
    return addToast({ message, type: 'info', ...options })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
})
