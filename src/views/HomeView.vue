<script setup lang="ts">
import ResumeGuide from '@/components/ResumeGuide.vue'
import WhatWeOffer from '@/components/WhatWeOffer.vue'
import ResumeTemplates from '@/components/ResumeTemplates.vue'
import KnowledgeBase from '@/components/KnowledgeBase.vue'
import { useToast } from '@/composables/useToast'

// Temporary test for toast translation
const toast = useToast()
const testTranslation = () => {
  toast.success('toast.success.saveSuccess')
  setTimeout(() => toast.error('toast.error.networkError'), 1000)
}
</script>
<template>
  <!-- Temporary test button -->
  <v-container class="text-center py-4">
    <v-btn color="primary" @click="testTranslation" class="mb-4"> Test Translation </v-btn>
  </v-container>

  <resume-guide />
  <what-we-offer />
  <resume-templates />
  <knowledge-base />
</template>
