<template>
  <v-container class="px-sm-12">
    <v-row>
      <!-- 标题栏 -->
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h2 class="font-weight-bold">MySpy</h2>
        <v-btn color="primary" class="px-5" @click="createNew">Create</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <!-- "Create" 按钮卡片 -->
      <v-col cols="12" sm="6" md="4" class="d-flex" v-if="resumes.length === 0">
        <v-card class="pa-4 ma-4 d-flex flex-column align-center justify-center flex-grow-1">
          <v-card-title class="text-h6 font-weight-bold">&nbsp;</v-card-title>
          <v-card-subtitle>&nbsp;</v-card-subtitle>
          <v-card-text>
            <v-sheet class="d-flex align-center justify-center">
              <img src="@/assets/discover_bg.png" />
            </v-sheet>
          </v-card-text>
          <v-btn color="primary" class="mt-3" @click="createNew">Create</v-btn>
        </v-card>
      </v-col>

      <!-- 生成卡片 -->
      <v-col v-for="(resume, index) in resumes" :key="index" cols="12" sm="6" md="4">
        <v-card class="pa-4 ma-4">
          <v-row class="align-center">
            <v-text-field
              v-if="resume.isEditing"
              v-model="resume.title"
              class="editable-title"
              single-line
              dense
              hide-details
              autofocus
              @blur="resume.isEditing = false"
              @keydown.enter="resume.isEditing = false"
            />
            <span
              v-else
              @click="resume.isEditing = true"
              class="editable-title text-truncate ma-4"
              style="max-width: 80%"
            >
              {{ resume.title }}
            </span>
            <v-spacer></v-spacer>
            <v-card-actions>
              <!-- 菜单按钮 -->
              <v-menu
                v-model="menu[index]"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <!-- 菜单内容 -->
                <v-list>
                  <v-list-item @click="onRename(resume)">
                    <v-list-item-title>Rename</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="onClone(resume)">
                    <v-list-item-title>Clone</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="onDelete(resume)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-row>
          <v-row class="mb-3">
            <v-card-subtitle>{{ resume.lastModifyTime }}</v-card-subtitle>
          </v-row>
          <v-card-text>
            <v-sheet class="d-flex align-center justify-center">
              <img
                v-if="resume.preview"
                src="@/assets/discover_bg.png"
                @click="createNew"
                style="max-width: 115%"
              />
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Resume {
  title: string
  lastModifyTime: string
  preview: boolean
  isEditing?: boolean
}

const resumes = ref<Resume[]>([
  { title: 'Resume 1', lastModifyTime: '2025-02-26', preview: true },
  { title: 'Resume 2', lastModifyTime: '2025-02-25', preview: true },
  { title: 'Resume 3', lastModifyTime: '2025-02-24', preview: true },
])

const menu = ref(resumes.value.map(() => false)) // 用于控制每个菜单的显示和隐藏

const createNew = () => {
  router.push('/create') // 进行 Vue Router 路由跳转
}

const onRename = (resume: Resume) => {
  resume.isEditing = true
  const index = resumes.value.indexOf(resume)
  menu.value[index] = false
}

const onClone = (resume: Resume) => {
  console.log(`Clone resume:`, resume)
  const index = resumes.value.indexOf(resume)
  menu.value[index] = false
  if (index > -1) {
    resumes.value.unshift({ ...resume, title: `${resume.title} Copy` }) // Add to the first element
    menu.value.unshift(false) // Add corresponding menu state to the first element
  }
}

const onDelete = (resume: Resume) => {
  console.log(`Deleting resume:`, resume)
  const index = resumes.value.indexOf(resume)
  if (index > -1) {
    resumes.value.splice(index, 1) // 删除指定的简历
    menu.value.splice(index, 1) // 删除对应的菜单状态
  }
}
</script>

<style scoped>
/* 你可以在这里添加样式 */
</style>
