<script setup lang="ts">
import AppBar from './components/app/AppBar.vue'
import ResumeGuide from './components/ResumeGuide.vue'
import WhatWeOffer from './components/WhatWeOffer.vue'
import ResumeTemplates from './components/ResumeTemplates.vue'
import KnowledgeBase from './components/KnowledgeBase.vue'
import AppFooter from './components/app/AppFooter.vue'
</script>

<template>
  <v-app>
    <app-bar />
    <v-main>
      <resume-guide />
      <what-we-offer />
      <resume-templates />
      <knowledge-base />
    </v-main>
    <app-footer />
  </v-app>
</template>
