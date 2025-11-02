<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        size="small"
        :prepend-icon="currentFlag"
        class="language-selector"
      >
        {{ currentLanguage }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="language in languages"
        :key="language.code"
        @click="changeLanguage(language.code)"
        :class="{ 'v-list-item--active': currentLocale === language.code }"
      >
        <template v-slot:prepend>
          <country-flag :country="language.flag" size="small" class="me-2" />
        </template>
        <v-list-item-title>{{ language.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CountryFlag from 'vue-country-flag-next'
import { changeLanguage as setLanguage } from '@/i18n'

const { locale, t } = useI18n()

const languages = [
  { code: 'en', name: computed(() => t('languages.english')), flag: 'us' },
  { code: 'zh', name: computed(() => t('languages.chinese')), flag: 'cn' },
  { code: 'ja', name: computed(() => t('languages.japanese')), flag: 'jp' },
]

const currentLocale = computed(() => locale.value)

const currentLanguage = computed(() => {
  const current = languages.find((lang) => lang.code === locale.value)
  return current?.name.value || 'EN'
})

const currentFlag = computed(() => {
  const current = languages.find((lang) => lang.code === locale.value)
  return current ? `flag:${current.flag}` : 'flag:us'
})

const changeLanguage = (langCode: string) => {
  setLanguage(langCode)
}
</script>

<style scoped>
.language-selector {
  min-width: auto !important;
}
</style>
