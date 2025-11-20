<script setup lang="ts">
import ResumeGuide from '@/components/ResumeGuide.vue'
import WhatWeOffer from '@/components/WhatWeOffer.vue'
import ResumeTemplates from '@/components/ResumeTemplates.vue'
import KnowledgeBase from '@/components/KnowledgeBase.vue'
import { useToast } from '@/composables/useToast'

// Temporary test for language-specific toast
const toast = useToast()
const testLanguageToast = () => {
  toast.success('toast.success.resumeLanguageAdded', undefined, { language: 'English' })
  setTimeout(
    () => toast.success('toast.success.resumeLanguageAdded', undefined, { language: 'Japanese' }),
    1000,
  )
  setTimeout(
    () => toast.success('toast.success.resumeLanguageAdded', undefined, { language: 'Chinese' }),
    2000,
  )
}
</script>
<template>
  <!-- Temporary test button -->
  <v-container class="text-center py-4">
    <v-btn color="primary" @click="testLanguageToast" class="mb-4"> Test Language Toast </v-btn>
  </v-container>

  <resume-guide />
  <what-we-offer />
  <resume-templates />
  <knowledge-base />
</template>
