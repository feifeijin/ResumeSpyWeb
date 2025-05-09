<!-- filepath: /Users/ws/Documents/DotCore/ResumeSpyWeb/src/views/CreateView.vue -->
<template>
  <v-container fluid>
    <v-row align-items="center" class="mb-4">
      <v-col cols="auto">
        <v-tabs v-model="activeTab" background-color="primary" dark>
          <v-tab v-for="(tab, index) in tabs" :key="tab" class="d-flex align-center">
            <span @dblclick="editTabName(index)" v-if="!isEditingTab(index)">{{ tab }}</span>
            <v-text-field
              v-else
              v-model="tabs[index]"
              @blur="saveTabName(index)"
              @keydown.enter="saveTabName(index)"
              single-line
              dense
              hide-details
              autofocus
              style="width: 200px"
            ></v-text-field>
            <v-icon
              v-if="index > 0"
              size="small"
              icon="mdi-close"
              color="red"
              style="transform: translate(50%, -50%)"
              @click.stop="openDeleteDialog(index)"
            ></v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="auto">
        <v-dialog v-model="isDialogActive" width="auto" scrollable>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              prepend-icon="mdi-file-account"
              text="Select Language"
              variant="outlined"
              v-bind="activatorProps"
            ></v-btn>
          </template>

          <template v-slot:default>
            <v-card prepend-icon="mdi-file-account" title="Select Language">
              <v-divider class="mt-3"></v-divider>

              <v-card-text class="px-4">
                <v-radio-group v-model="dialog" class="full-width">
                  <v-row v-for="country in countries" :key="country.value" align-items="center">
                    <v-col>
                      <v-radio :value="country.value">
                        <template v-slot:label>
                          <country-flag :country="country.flag" size="small" class="me-2" />
                          {{ country.label }}
                        </template>
                      </v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn text="Close" @click="isDialogActive = false"></v-btn>

                <v-spacer></v-spacer>

                <v-btn color="surface-variant" text="ADD" variant="flat" @click="onAdd"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-btn color="secondary" class="ml-2" @click="openSyncDialog">Sync</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs-window v-model="activeTab">
          <v-tabs-window-item v-for="(tab, index) in tabs" :key="tab">
            <v-md-editor v-model="editors[index]" @save="onSave(index)" height="800px">{{
              tab
            }}</v-md-editor>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="isDeleteDialogActive" width="auto">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this tab?</v-card-text>
        <v-card-actions>
          <v-btn text="Cancel" @click="isDeleteDialogActive = false"></v-btn>
          <v-btn color="red" text="Delete" @click="deleteTab"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Sync Confirmation Dialog -->
    <v-dialog v-model="isSyncDialogActive" width="auto">
      <v-card>
        <v-card-title class="headline">Confirm SYNC</v-card-title>
        <v-card-text>Current tab title: {{ tabs[activeTab] }}</v-card-text>
        <v-card-actions>
          <v-btn text="Cancel" @click="isSyncDialogActive = false">Cancel</v-btn>
          <v-btn color="primary" text="Sync" @click="syncTab">Sync</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Indicator -->
    <v-dialog v-model="isLoading" hide-overlay persistent width="300">
      <v-card class="d-flex justify-center align-center" height="100">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { ResumeDetail } from '@/models/resume-detail.type'
import {
  fetchResumeDetailsByResumeId,
  createResumeDetailFromExisting,
  deleteResumeDetail,
  createResumeDetail,
  updateResumeDetailContent,
  updateResumeDetailName,
} from '@/api/resume-detail-api'

const dialog = ref('')

const resumeDetails = ref<ResumeDetail[]>([])
const tabs = ref(resumeDetails.value.map((detail) => detail.name))
const activeTab = ref(0)
const editors = ref(resumeDetails.value.map((detail) => detail.content)) // Initialize an array with empty strings for each tab

const countries = ref([
  { flag: 'us', label: 'English', value: 'EN' },
  { flag: 'jp', label: 'Japanese', value: 'JA' },
  { flag: 'cn', label: 'Chinese', value: 'ZH' },
])

const isDialogActive = ref(false)
const isDeleteDialogActive = ref(false)
const tabIndexToDelete = ref(-1)
const isSyncDialogActive = ref(false)
const isLoading = ref(false)
const editingTabIndex = ref<number | null>(null)

const loadResumeDetails = async (resumeId: string) => {
  try {
    resumeDetails.value = await fetchResumeDetailsByResumeId(resumeId)
    tabs.value = resumeDetails.value.map((detail) => detail.name)
    editors.value = resumeDetails.value.map((detail) => detail.content)
  } catch (error) {
    console.error('Failed to load resume details:', error)
  }
}

onMounted(() => {
  const router = useRoute()
  const resumeId = router.query.resumeId as string
  console.log('Resume ID:', resumeId)
  loadResumeDetails(resumeId)
})

const onAdd = async () => {
  try {
    const existingResumeDetailId = resumeDetails.value[activeTab.value].id
    const newDetail = await createResumeDetailFromExisting(existingResumeDetailId, dialog.value)
    resumeDetails.value.push(newDetail)
    tabs.value.push(newDetail.name)
    editors.value.push(newDetail.content)
    dialog.value = ''
    isDialogActive.value = false
  } catch (error) {
    console.error('Failed to add new resume detail:', error)
  }
}

const onSave = async (index: number) => {
  try {
    const content = editors.value[index]
    const detail = resumeDetails.value[index]
    if (detail.id) {
      // Update existing resume detail
      await updateResumeDetailContent(detail.id, content)
      detail.content = content
    } else {
      // Create new resume detail
      const newDetail = await createResumeDetail({
        ...detail,
        content,
      })
      resumeDetails.value[index] = newDetail
    }
    console.log('Save successful for tab:', tabs.value[index])
  } catch (error) {
    console.error('Failed to save resume detail:', error)
  }
}

const openDeleteDialog = (index: number) => {
  tabIndexToDelete.value = index
  isDeleteDialogActive.value = true
}

const deleteTab = async () => {
  if (tabIndexToDelete.value > -1) {
    try {
      const detailId = resumeDetails.value[tabIndexToDelete.value].id
      await deleteResumeDetail(detailId)
      const wasActiveTab = activeTab.value === tabIndexToDelete.value
      tabs.value.splice(tabIndexToDelete.value, 1)
      editors.value.splice(tabIndexToDelete.value, 1)
      if (tabs.value.length > 0) {
        if (wasActiveTab) {
          activeTab.value = 0
        } else if (activeTab.value > tabIndexToDelete.value) {
          activeTab.value -= 1
        }
      } else {
        activeTab.value = -1
      }
      isDeleteDialogActive.value = false
      tabIndexToDelete.value = -1
    } catch (error) {
      console.error('Failed to delete resume detail:', error)
    }
  }
}

const openSyncDialog = () => {
  isSyncDialogActive.value = true
}

const syncTab = async () => {
  isSyncDialogActive.value = false
  isLoading.value = true
  try {
    // Simulate a request to the server
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Sync completed for tab:', tabs.value[activeTab.value])
  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    isLoading.value = false
  }
}

const editTabName = (index: number) => {
  editingTabIndex.value = index
}

const isEditingTab = (index: number) => {
  return editingTabIndex.value === index
}

const saveTabName = async (index: number) => {
  try {
    const newName = tabs.value[index]
    const detail = resumeDetails.value[index]
    if (detail.id && newName !== detail.name) {
      await updateResumeDetailName(detail.id, newName)
      detail.name = newName
      console.log('Tab name updated successfully:', newName)
    }
    editingTabIndex.value = null
  } catch (error) {
    console.error('Failed to update tab name:', error)
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
