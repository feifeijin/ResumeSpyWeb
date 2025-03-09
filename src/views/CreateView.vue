<!-- filepath: /Users/ws/Documents/DotCore/ResumeSpyWeb/src/views/CreateView.vue -->
<template>
  <v-container>
    <v-tabs v-model="activeTab" background-color="primary" dark>
      <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <v-tabs-window-item v-for="(tab, index) in tabs" :key="tab">
        <v-md-editor v-model="editors[index]" height="800px">{{ tab }}</v-md-editor>
      </v-tabs-window-item>
    </v-tabs-window>
    <!-- <v-tabs-items v-model="activeTab">
      <v-tab-item v-for="(tab, index) in tabs" :key="tab">
      </v-tab-item>
    </v-tabs-items> -->
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabs = ['ENG', 'JPN', 'CN']
const activeTab = ref(0)
const editors = ['ENG', 'JPN', 'CN'] // Initialize an array with empty strings for each tab
</script>
