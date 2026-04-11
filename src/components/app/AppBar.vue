<template>
  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list>
      <v-list-item v-for="item in menu" :key="item.name" @click="onClick(item)">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.name }}
      </v-list-item>
      <v-divider class="my-2" />
      <v-list-item v-if="isAuthenticated" @click="handleLogout">
        <v-icon>mdi-logout</v-icon>
        {{ t('navigation.logout') }}
      </v-list-item>
      <v-list-item v-else @click="navigateToAuth">
        <v-icon>mdi-login</v-icon>
        {{ t('navigation.login') }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- 顶部应用栏 -->
  <v-app-bar app class="noir-bar">
    <template #title>
      <div
        @click="router.push('/')"
        class="noir-logo"
      >
        RESUME<span class="noir-logo-accent">SPY</span>
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
        <template v-if="isAuthenticated">
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="ml-2" prepend-icon="mdi-account-circle">
                {{ accountLabel }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="goToMySpy">
                <v-list-item-title>{{ t('navigation.mySpy') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleLogout">
                <v-list-item-title>{{ t('navigation.logout') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-btn color="primary" class="ml-2" variant="flat" @click="navigateToAuth">
            {{ t('navigation.login') }}
          </v-btn>
        </template>
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
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { changeLanguage as setLanguage } from '@/i18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const drawer = ref(false)
const { t, locale } = useI18n()
const authStore = useAuthStore()
const toast = useToast()
const { isAuthenticated, displayName, email } = storeToRefs(authStore)

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

const accountLabel = computed(() => email.value || t('navigation.login'))

const changeLanguage = (langCode: string) => {
  setLanguage(langCode)
}

const onClick = (item: { name: string; link: string }) => {
  if (item.name === 'GitHub') {
    window.open(item.link, '_blank')
  } else {
    router.push(item.link)
  }
  drawer.value = false
}

const navigateToAuth = () => {
  drawer.value = false
  router.push({ name: 'auth' })
}

const goToMySpy = () => {
  drawer.value = false
  router.push({ name: 'myspy' })
}

const handleLogout = async () => {
  drawer.value = false
  await authStore.logout()
  toast.success(t('auth.logoutSuccess'))
  router.push('/')
}
</script>

<style scoped>
.hidden-sm-and-down {
  display: block;
}

/* ── Noir AppBar ─────────────────────────────────────────── */
:deep(.v-toolbar) {
  background: rgba(10, 8, 7, 0.92) !important;
  border-bottom: 1px solid #2e2620 !important;
  backdrop-filter: blur(10px);
  box-shadow: none !important;
}

.noir-logo {
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #e2d5bc;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.noir-logo:hover { color: #c49a38; }

.noir-logo-accent { color: #c49a38; }

:deep(.v-btn) {
  font-family: 'Special Elite', cursive !important;
  letter-spacing: 0.1em !important;
  font-size: 0.8rem !important;
  color: #6a5f52 !important;
  transition: color 0.25s !important;
}

:deep(.v-btn:hover) { color: #e2d5bc !important; }

:deep(.v-btn.v-btn--variant-flat) {
  background: #c49a38 !important;
  color: #090807 !important;
  font-family: 'Special Elite', cursive !important;
  border-radius: 0 !important;
  clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
}

:deep(.v-btn.v-btn--variant-flat:hover) {
  background: #d4a940 !important;
  color: #090807 !important;
}

:deep(.v-navigation-drawer) {
  background: #0f0d0b !important;
  border-right: 1px solid #2e2620 !important;
}

:deep(.v-list-item) {
  font-family: 'Special Elite', cursive !important;
  color: #6a5f52 !important;
  letter-spacing: 0.1em;
}

:deep(.v-list-item:hover) { color: #e2d5bc !important; }
</style>
