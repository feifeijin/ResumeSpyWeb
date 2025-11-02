<template>
  <!-- 抽屉菜单 (在移动端显示) -->
  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list>
      <v-list-item v-for="item in menu" :key="item.name" @click="onClick(item)">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- 顶部应用栏 -->
  <v-app-bar app>
    <template #title>
      <div
        @click="router.push('/')"
        class="cursor-pointer d-inline-flex align-center text-h4 font-weight-bold my-5 text-primary"
      >
        <v-icon icon="$vuetify" start />
        ResumeSpy
      </div>
    </template>

    <!-- PC 端显示按钮 -->
    <template v-if="$vuetify.display.mdAndUp" #append>
      <div class="hidden-sm-and-down d-flex align-center">
        <v-btn
          v-for="item in menu"
          :key="item.name"
          class="text-body-1 blue-grey-darken-4"
          variant="text"
          @click="onClick(item)"
        >
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.name }}
        </v-btn>
        <!-- Language Selector -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              size="small"
              prepend-icon="mdi-translate"
              class="ml-2"
            >
              {{ currentLanguage }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="language in languages"
              :key="language.code"
              @click="changeLanguage(language.code)"
            >
              {{ language.name }}
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>

    <!-- 移动端显示抽屉触发按钮 -->
    <template v-if="$vuetify.display.smAndDown">
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { changeLanguage as setLanguage } from '@/i18n'

const router = useRouter()
const drawer = ref(false)
const { t, locale } = useI18n()

const menu = computed(() => [
  { name: t('navigation.create'), link: '/create', icon: 'mdi-note-plus' },
  {
    name: 'GitHub',
    link: 'https://github.com/feifeijin/ResumeSpyWeb',
    icon: 'mdi-github',
  },
  { name: t('navigation.mySpy'), link: '/myspy', icon: 'mdi-account' },
])

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
]

const currentLanguage = computed(() => {
  const current = languages.find((lang) => lang.code === locale.value)
  return current?.name || 'EN'
})

const changeLanguage = (langCode: string) => {
  setLanguage(langCode)
}

const onClick = (item: { name: string; link: string }) => {
  if (item.name === 'GitHub') {
    window.open(item.link, '_blank') // 打开外部链接
  } else {
    router.push(item.link) // 进行 Vue Router 路由跳转
  }
}
</script>

<style scoped>
.hidden-sm-and-down {
  display: block;
}
</style>
