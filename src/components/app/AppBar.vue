<template>
  <!-- 抽屉菜单 (在移动端显示) -->
  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list>
      <v-list-item v-for="item in menu" :key="item.name" :href="`#${item.link}`">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.name }}
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- 顶部应用栏 -->
  <v-app-bar app>
    <template #title>
      <div class="d-inline-flex align-center text-h4 font-weight-bold my-5 text-primary">
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
          :href="`#${item.link}`"
          variant="text"
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

const drawer = ref(false)
const menu = [
  { name: 'Create', link: 'create', icon: 'mdi-note-plus' },
  { name: 'GitHub', link: 'github', icon: 'mdi-github' },
  { name: 'MySpy', link: 'myspy', icon: 'mdi-account' },
]
</script>

<style scoped>
.hidden-sm-and-down {
  display: block;
}
</style>
