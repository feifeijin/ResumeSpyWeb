# Global Loading System

This global loading system provides a centralized, reusable solution for managing loading states across your entire Vue 3 + TypeScript application.

## 🚀 Features

- **Global State Management**: Single loading overlay for the entire app
- **Multiple Operation Support**: Handle concurrent operations with queue display
- **Progress Tracking**: Support for progress indicators (0-100%)
- **Custom Messages**: Localized loading messages
- **Auto Error Handling**: Automatic cleanup even if operations fail
- **TypeScript Support**: Fully typed for better development experience
- **Vuetify Integration**: Beautiful Material Design loading overlay

## 📁 Architecture

```
src/
├── stores/loading.ts              # Pinia store for global loading state
├── components/GlobalLoadingOverlay.vue  # Global loading overlay component
├── composables/
│   ├── useLoading.ts             # Main loading composable
│   └── useApiService.ts          # Service wrapper utilities
└── App.vue                       # GlobalLoadingOverlay integrated here
```

## 🔧 Setup

The system is already integrated in your `App.vue`:

```vue
<template>
  <v-app>
    <app-bar />
    <v-main>
      <router-view />
    </v-main>
    <app-footer />

    <!-- Global Loading Overlay -->
    <GlobalLoadingOverlay />
  </v-app>
</template>
```

## 📖 Usage Examples

### Method 1: Simple API Calls

```typescript
import { useLoading } from '@/composables/useLoading'

const { withLoading } = useLoading()

// Basic usage
const saveData = async () => {
  await withLoading(
    async () => {
      const result = await api.save(data)
      return result
    },
    { message: 'Saving data...' },
  )
}
```

### Method 2: Using Service Helpers

```typescript
import { useApiService } from '@/composables/useApiService'

const { createWithLoading, updateWithLoading, deleteWithLoading } = useApiService()

// CRUD operations
const resumeService = {
  async createResume(data) {
    return createWithLoading(() => resumeDetailService.create(data), 'Creating resume...')
  },

  async updateResume(id, data) {
    return updateWithLoading(() => resumeDetailService.update(id, data), 'Updating resume...')
  },

  async deleteResume(id) {
    return deleteWithLoading(() => resumeDetailService.delete(id), 'Deleting resume...')
  },
}
```

### Method 3: In Vue Components

```vue
<script setup lang="ts">
import { useLoading } from '@/composables/useLoading'

const { withLoading, isGlobalLoading } = useLoading()

// Use in component methods
const handleSubmit = async () => {
  await withLoading(
    async () => {
      await submitForm()
    },
    { message: 'Submitting form...' },
  )
}

// Disable buttons during any global loading
const isDisabled = computed(() => isGlobalLoading)
</script>

<template>
  <v-btn :disabled="isDisabled" :loading="isGlobalLoading" @click="handleSubmit"> Submit </v-btn>
</template>
```

### Method 4: Progress Tracking

```typescript
const uploadFile = async (file: File) => {
  const { updateLoading } = useLoading()

  return await withLoading(
    async () => {
      return new Promise((resolve) => {
        const formData = new FormData()
        formData.append('file', file)

        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            updateLoading('upload-file', `Uploading... ${Math.round(progress)}%`, progress)
          }
        }

        xhr.onload = () => resolve(JSON.parse(xhr.responseText))
        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      })
    },
    {
      id: 'upload-file',
      message: 'Starting upload...',
      progress: 0,
    },
  )
}
```

### Method 5: Multiple Concurrent Operations

```typescript
const handleBatchOperations = async () => {
  // These operations will show in the loading queue
  const operations = [
    withLoading(() => operation1(), { message: 'Processing batch 1...' }),
    withLoading(() => operation2(), { message: 'Processing batch 2...' }),
    withLoading(() => operation3(), { message: 'Processing batch 3...' }),
  ]

  await Promise.all(operations)
}
```

### Method 6: Manual Control (Advanced)

```typescript
const { startLoading, updateLoading, stopLoading } = useLoading()

const complexOperation = async () => {
  const loadingId = 'complex-operation'

  try {
    startLoading(loadingId, 'Initializing...')
    await step1()

    updateLoading(loadingId, 'Processing data...', 33)
    await step2()

    updateLoading(loadingId, 'Finalizing...', 66)
    await step3()

    updateLoading(loadingId, 'Complete!', 100)
  } finally {
    stopLoading(loadingId)
  }
}
```

## 🌐 Localization

Loading messages are automatically localized. Add translations in your locale files:

```json
// src/locales/en.json
{
  "loading": {
    "creating": "Creating...",
    "updating": "Updating...",
    "deleting": "Deleting...",
    "saving": "Saving...",
    "syncing": "Syncing...",
    "processing": "Processing...",
    "uploading": "Uploading...",
    "downloading": "Downloading..."
  }
}
```

## 🎨 Customization

Customize the loading overlay by passing props to `GlobalLoadingOverlay`:

```vue
<!-- In App.vue -->
<GlobalLoadingOverlay :card-width="400" :progress-size="80" :show-details="false" />
```

## ✅ Migration from Local Loading

**BEFORE** (Local loading):

```typescript
const isLoading = ref(false)

const saveData = async () => {
  isLoading.value = true
  try {
    await api.save(data)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
```

**AFTER** (Global loading):

```typescript
const { withLoading } = useLoading()

const saveData = async () => {
  await withLoading(() => api.save(data), { message: 'Saving data...' })
}
```

## 🔍 Benefits

1. **Consistency**: Same loading UX across entire app
2. **Simplicity**: No more local loading state management
3. **Error Handling**: Automatic cleanup with try/finally
4. **User Experience**: Professional loading indicators with messages
5. **Developer Experience**: Simple, reusable API
6. **Performance**: Centralized state management
7. **Accessibility**: Built-in screen reader support
8. **Internationalization**: Automatic translation support

Start using this system for all your API calls to provide a consistent, professional user experience throughout your application!
