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
              :ref="(el) => (titleInputRefs[index] = el)"
              v-model="resume.title"
              class="editable-title"
              single-line
              dense
              hide-details
              autofocus
              @blur="onRename(resume)"
              @keydown.enter="onRename(resume)"
            />
            <v-tooltip location="bottom" v-else>
              <template v-slot:activator="{ props }">
                <span
                  @dblclick="startEditing(resume, index)"
                  class="editable-title text-truncate ma-4"
                  style="max-width: 65%"
                  v-bind="props"
                >
                  {{ resume.title }}
                </span>
              </template>
              <span>{{ resume.title }}</span>
            </v-tooltip>
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
                  <v-list-item @click="startEditing(resume, index)">
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
                :src="resume.resumeImgPath"
                @click="openEditPage(resume.id)"
                style="max-width: 115%; cursor: pointer"
              />
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Resume } from '@/models/resume.type'
import ResumeService from '@/api/resume-api'

const resumeService = new ResumeService()

const router = useRouter()

const resumes = ref<Resume[]>([])
const menu = ref<boolean[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titleInputRefs = ref<any[]>([])

const startEditing = async (resume: Resume, index: number) => {
  resume.isEditing = true
  await nextTick()
  const inputComponent = titleInputRefs.value[index]
  if (inputComponent) {
    const inputElement = inputComponent.$el.querySelector('input')
    if (inputElement) {
      inputElement.select()
    }
  }
}

const loadResumes = async () => {
  try {
    resumes.value = await resumeService.fetchResumes()
    menu.value = resumes.value.map(() => false)
  } catch (error) {
    console.error('Failed to load resumes:', error)
  }
}

onMounted(() => {
  loadResumes()
})

const openEditPage = (id: string) => {
  router.push({ name: 'create', query: { resumeId: id } })
}
const createNew = () => {
  router.push('/create') // 进行 Vue Router 路由跳转
}

const onRename = async (resume: Resume) => {
  try {
    if (resume.id && resume.title !== '') {
      await resumeService.updateResumeName(resume.id, resume.title)
      resume.isEditing = false
      console.log('Resume renamed successfully:', resume.title)
    }
  } catch (error) {
    console.error('Failed to rename resume:', error)
  }
}

const onClone = async (resume: Resume) => {
  try {
    const index = resumes.value.indexOf(resume)
    menu.value[index] = false

    const newResume = await resumeService.cloneResume(resume.id)
    resumes.value.unshift(newResume)
    menu.value.unshift(false)
    console.log('Resume cloned successfully:', newResume.title)
  } catch (error) {
    console.error('Failed to clone resume:', error)
  }
}

const onDelete = async (resume: Resume) => {
  try {
    if (resume.id) {
      await resumeService.deleteResume(resume.id)
      const index = resumes.value.indexOf(resume)
      if (index > -1) {
        resumes.value.splice(index, 1)
        menu.value.splice(index, 1)
      }
      console.log('Resume deleted successfully:', resume.title)
    }
  } catch (error) {
    console.error('Failed to delete resume:', error)
  }
}
</script>

<style scoped>
.editable-title {
  cursor: pointer;
}
</style>
