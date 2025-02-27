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
      <div class="hidden-sm-and-down">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(false)
const menu = [
  { name: 'Create', link: '/create', icon: 'mdi-note-plus' },
  {
    name: 'GitHub',
    link: 'https://github.com/feifeijin/ResumeSpyWeb',
    icon: 'mdi-github',
  },
  { name: 'MySpy', link: '/myspy', icon: 'mdi-account' },
]

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
