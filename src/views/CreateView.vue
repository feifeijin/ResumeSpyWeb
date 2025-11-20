<!-- filepath: /Users/ws/Documents/DotCore/ResumeSpyWeb/src/views/CreateView.vue -->
<template>
  <v-container fluid>
    <v-row align-items="center" class="mb-4" no-gutters>
      <v-col cols="auto" style="min-width: 0; flex-shrink: 1">
        <v-tabs v-model="activeTab" background-color="primary" dark style="min-width: 0">
          <v-tab
            v-for="(tab, index) in tabs"
            :key="`tab-${index}`"
            :class="['d-flex align-center', { 'tab-editing': isEditingTab(index) }]"
          >
            <v-tooltip location="bottom" v-if="!isEditingTab(index)">
              <template v-slot:activator="{ props }">
                <span
                  @dblclick="editTabName(index)"
                  class="text-truncate flex-grow-1 tab-text"
                  v-bind="props"
                  >{{ tab }}</span
                >
              </template>
              <span>{{ tab }}</span>
            </v-tooltip>
            <v-text-field
              v-else
              v-model="editingTabName"
              @blur="saveTabName(index)"
              @keydown.enter="saveTabName(index)"
              @keydown.esc="cancelEdit"
              single-line
              dense
              hide-details
              autofocus
              style="width: 200px"
              ref="tabEditor"
            ></v-text-field>
            <v-icon
              v-if="index > 0 && !isEditingTab(index)"
              size="small"
              icon="mdi-close"
              color="red"
              style="transform: translate(50%, -50%)"
              @click.stop="openDeleteDialog(index)"
            ></v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-divider vertical class="mx-2"></v-divider>
      <v-col cols="auto" style="flex-shrink: 0">
        <v-dialog v-model="isDialogActive" max-width="500px" persistent>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              prepend-icon="mdi-file-account"
              :text="$t('createView.selectLanguage')"
              variant="outlined"
              v-bind="activatorProps"
            ></v-btn>
          </template>

          <template v-slot:default>
            <v-card>
              <v-card-title class="d-flex align-center pa-6">
                <v-icon class="me-3" color="primary">mdi-translate</v-icon>
                <span class="text-h5">{{ $t('createView.selectLanguage') }}</span>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text class="pa-6">
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ $t('createView.selectLanguageHint') }}
                </p>
                <v-radio-group v-model="dialog" class="mt-2">
                  <template v-for="country in countries" :key="country.value">
                    <v-radio :value="country.value" class="mb-3">
                      <template v-slot:label>
                        <div class="d-flex align-center">
                          <country-flag
                            v-if="country.flag"
                            :country="country.flag"
                            size="normal"
                            class="me-4"
                          />
                          <v-icon v-else class="me-4" color="primary" size="large">
                            mdi-earth
                          </v-icon>
                          <div class="d-flex flex-column">
                            <span class="text-subtitle-1 font-weight-medium">{{
                              country.label
                            }}</span>
                            <span class="text-caption text-medium-emphasis">{{
                              country.value
                            }}</span>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                  </template>
                </v-radio-group>

                <!-- Other Language Selection -->
                <v-expand-transition>
                  <div v-if="isOtherSelected" class="mt-4 pa-4 bg-grey-lighten-4 rounded">
                    <p class="text-body-2 mb-3">{{ $t('createView.selectOtherLanguage') }}:</p>
                    <v-select
                      v-model="selectedOtherLanguage"
                      :items="otherLanguages"
                      item-title="name"
                      item-value="code"
                      :label="$t('createView.chooseLanguage')"
                      variant="outlined"
                      density="comfortable"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" class="d-flex align-center">
                          <template v-slot:prepend>
                            <country-flag :country="item.raw.flag" size="small" class="me-3" />
                          </template>
                          <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                          <v-list-item-subtitle>{{ item.raw.code }}</v-list-item-subtitle>
                        </v-list-item>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div class="d-flex align-center">
                          <country-flag :country="item.raw.flag" size="small" class="me-2" />
                          <span>{{ item.raw.name }}</span>
                        </div>
                      </template>
                    </v-select>
                  </div>
                </v-expand-transition>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  variant="text"
                  @click="isDialogActive = false"
                  class="me-2"
                  :disabled="isGlobalLoading"
                >
                  {{ $t('common.cancel') }}
                </v-btn>
                <v-btn
                  color="primary"
                  variant="elevated"
                  @click="onAdd"
                  :disabled="isAddDisabled"
                  :loading="isGlobalLoading"
                >
                  {{ $t('common.add') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-btn color="secondary" class="ml-2" @click="openSyncDialog" style="white-space: nowrap">{{
          $t('common.sync')
        }}</v-btn>
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
        <v-card-title class="headline">{{ $t('createView.confirmDelete') }}</v-card-title>
        <v-card-text>{{ $t('createView.deleteConfirm') }}</v-card-text>
        <v-card-actions>
          <v-btn :text="$t('common.cancel')" @click="isDeleteDialogActive = false"></v-btn>
          <v-btn color="red" :text="$t('common.delete')" @click="deleteTab"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Sync Confirmation Dialog -->
    <v-dialog v-model="isSyncDialogActive" width="auto">
      <v-card>
        <v-card-title class="headline">{{ $t('createView.confirmSync') }}</v-card-title>
        <v-card-text>{{
          $t('createView.currentTabTitle', { title: tabs[activeTab] })
        }}</v-card-text>
        <v-card-actions>
          <v-btn :text="$t('common.cancel')" @click="isSyncDialogActive = false"></v-btn>
          <v-btn color="primary" :text="$t('common.sync')" @click="syncTab"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Indicator -->
    <v-dialog v-model="isGlobalLoading" hide-overlay persistent width="300">
      <v-card class="d-flex justify-center align-center" height="100">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from '@/composables/useLoading'
import { useToast } from '@/composables/useToast'
import { ResumeDetail } from '@/models/resume-detail.type'
import ResumeDetailService from '@/api/resume-detail-api'

const { t } = useI18n()
const { withLoading, commonMessages, isGlobalLoading } = useLoading()
const toast = useToast()

const resumeDetailService = new ResumeDetailService()
const route = useRoute()
const router = useRouter()

const dialog = ref('')
const currentResumeId = ref<string | null>(null)

const resumeDetails = ref<ResumeDetail[]>([])
const tabs = ref(resumeDetails.value.map((detail) => detail.name))
const activeTab = ref(0)
const editors = ref(resumeDetails.value.map((detail) => detail.content)) // Initialize an array with empty strings for each tab

const countries = computed(() => [
  { flag: 'us', label: t('languages.english'), value: 'EN' },
  { flag: 'jp', label: t('languages.japanese'), value: 'JA' },
  { flag: 'cn', label: t('languages.chinese'), value: 'ZH' },
  { flag: null, label: t('languages.other'), value: 'OTHER', isOther: true },
])

// Additional language options for "Other" selection
const otherLanguages = [
  { code: 'ES', name: 'Español', flag: 'es' },
  { code: 'FR', name: 'Français', flag: 'fr' },
  { code: 'DE', name: 'Deutsch', flag: 'de' },
  { code: 'IT', name: 'Italiano', flag: 'it' },
  { code: 'PT', name: 'Português', flag: 'pt' },
  { code: 'RU', name: 'Русский', flag: 'ru' },
  { code: 'KO', name: '한국어', flag: 'kr' },
  { code: 'TH', name: 'ไทย', flag: 'th' },
  { code: 'VI', name: 'Tiếng Việt', flag: 'vn' },
  { code: 'AR', name: 'العربية', flag: 'sa' },
  { code: 'HI', name: 'हिन्दी', flag: 'in' },
  { code: 'TR', name: 'Türkçe', flag: 'tr' },
]

const isDialogActive = ref(false)
const isDeleteDialogActive = ref(false)
const tabIndexToDelete = ref(-1)
const isSyncDialogActive = ref(false)
const editingTabIndex = ref<number | null>(null)
const editingTabName = ref('')
const selectedOtherLanguage = ref('')
const isOtherSelected = computed(() => dialog.value === 'OTHER')

const isAddDisabled = computed(() => {
  if (isGlobalLoading) return true
  if (!dialog.value) return true
  if (dialog.value === 'OTHER') return !selectedOtherLanguage.value
  return false
})

const loadResumeDetails = async (resumeId: string) => {
  currentResumeId.value = resumeId
  await withLoading(
    async () => {
      resumeDetails.value = await resumeDetailService.fetchResumeDetailsByResumeId(resumeId)
      tabs.value = resumeDetails.value.map((detail) => detail.name)
      editors.value = resumeDetails.value.map((detail) => detail.content)
    },
    {
      id: 'load-resume-details',
      message: commonMessages.loading,
    },
  )
}

onMounted(() => {
  const resumeId = route.query.resumeId
  if (typeof resumeId === 'string' && resumeId) {
    loadResumeDetails(resumeId)
  } else {
    // Initialize with a default tab for a new resume
    const newResumeTitle = t('createView.newResume')
    tabs.value = [newResumeTitle]
    editors.value = ['']
    resumeDetails.value = [new ResumeDetail('', '', newResumeTitle, '', '', true, '', '')]
  }
})

const onAdd = async () => {
  const language =
    dialog.value === 'OTHER' && selectedOtherLanguage.value
      ? selectedOtherLanguage.value
      : dialog.value

  const existingResumeDetailId = resumeDetails.value[activeTab.value].id
  const originalName = resumeDetails.value[activeTab.value].name

  await withLoading(
    async () => {
      const newDetail = await resumeDetailService.createResumeDetailFromExisting(
        existingResumeDetailId,
        language,
      )

      // Create a clean name by removing any existing language postfix from original name
      let cleanName = originalName

      // Remove common language postfixes if they exist
      const postfixPatterns = [
        / - EN$/i,
        / - JA$/i,
        / - ZH$/i,
        / - ES$/i,
        / - FR$/i,
        / - DE$/i,
        / - IT$/i,
        / - PT$/i,
        / - RU$/i,
        / - KO$/i,
        / - TH$/i,
        / - VI$/i,
        / - AR$/i,
        / - HI$/i,
        / - TR$/i,
        / \(EN\)$/i,
        / \(JA\)$/i,
        / \(ZH\)$/i,
        / \(ES\)$/i,
        / \(FR\)$/i,
        / \(DE\)$/i,
        / \(IT\)$/i,
        / \(PT\)$/i,
        / \(RU\)$/i,
        / \(KO\)$/i,
        / \(TH\)$/i,
        / \(VI\)$/i,
        / \(AR\)$/i,
        / \(HI\)$/i,
        / \(TR\)$/i,
      ]

      postfixPatterns.forEach((pattern) => {
        cleanName = cleanName.replace(pattern, '')
      })

      // Add the language postfix to the clean name
      const nameWithLanguage = `${cleanName} - ${language}`

      // Use the name with language postfix for the new detail
      newDetail.name = nameWithLanguage

      // Update the backend with the new name if it was changed
      if (newDetail.id) {
        await resumeDetailService.updateResumeDetailName(newDetail.id, nameWithLanguage)
      }

      resumeDetails.value.push(newDetail)
      tabs.value.push(newDetail.name)
      editors.value.push(newDetail.content)
      if (newDetail.resumeId) {
        currentResumeId.value = newDetail.resumeId
      }
      dialog.value = ''
      selectedOtherLanguage.value = ''
      isDialogActive.value = false
      toast.success('toast.success.createSuccess')
    },
    {
      id: 'create-language-version',
      message: commonMessages.creating,
    },
  )
}

const onSave = async (index: number) => {
  await withLoading(
    async () => {
      const content = editors.value[index]
      const detail = resumeDetails.value[index]
      if (detail.id) {
        // Update existing resume detail
        await resumeDetailService.updateResumeDetailContent(detail.id, content)
        detail.content = content
        if (detail.resumeId) {
          currentResumeId.value = detail.resumeId
        }
      } else {
        // Create new resume detail
        const newDetail = await resumeDetailService.createResumeDetail({
          ...detail,
          content,
          name: tabs.value[index], // Ensure name is passed
        })
        resumeDetails.value[index] = newDetail
        // Update the URL with the new resumeId
        if (newDetail.resumeId) {
          currentResumeId.value = newDetail.resumeId
          router.replace({ query: { ...route.query, resumeId: newDetail.resumeId } })
        }
      }
      toast.success('toast.success.saveSuccess')
    },
    {
      id: 'save-resume',
      message: commonMessages.saving,
    },
  )
}

const openDeleteDialog = (index: number) => {
  tabIndexToDelete.value = index
  isDeleteDialogActive.value = true
}

const deleteTab = async () => {
  if (tabIndexToDelete.value > -1) {
    await withLoading(
      async () => {
        const detailId = resumeDetails.value[tabIndexToDelete.value].id
        await resumeDetailService.deleteResumeDetail(detailId)

        // Clear editing state if needed
        cancelEdit()

        // Reload all data to ensure consistency
        if (currentResumeId.value) {
          await loadResumeDetails(currentResumeId.value)
        }

        isDeleteDialogActive.value = false
        tabIndexToDelete.value = -1
      },
      {
        id: 'delete-tab',
        message: commonMessages.deleting,
      },
    )
  }
}

const openSyncDialog = () => {
  if (!currentResumeId.value) {
    console.warn('No resume ID available to sync. Save your resume before syncing.')
    return
  }
  isSyncDialogActive.value = true
}

const syncTab = async () => {
  if (!currentResumeId.value) {
    console.warn('No resume ID available to sync. Save your resume before syncing.')
    return
  }

  const activeResumeDetailID = resumeDetails.value[activeTab.value].id
  if (!activeResumeDetailID) {
    console.error('Sync aborted: resume detail ID is missing.')
    return
  }

  isSyncDialogActive.value = false

  await withLoading(
    async () => {
      await resumeDetailService.syncTranslations(activeResumeDetailID)
      await loadResumeDetails(currentResumeId.value!)
      toast.success('toast.success.syncSuccess')
    },
    {
      id: 'sync-translations',
      message: commonMessages.syncing,
    },
  )
}

const editTabName = (index: number) => {
  editingTabIndex.value = index
  editingTabName.value = tabs.value[index]
}

const isEditingTab = (index: number) => {
  return editingTabIndex.value === index
}

const cancelEdit = () => {
  editingTabIndex.value = null
  editingTabName.value = ''
}

const saveTabName = async (index: number) => {
  const newName = editingTabName.value.trim()
  if (!newName) {
    cancelEdit()
    return
  }

  const detail = resumeDetails.value[index]
  if (detail.id && newName !== detail.name) {
    await withLoading(
      async () => {
        await resumeDetailService.updateResumeDetailName(detail.id, newName)
        detail.name = newName
        tabs.value[index] = newName
        toast.success('toast.success.renameSuccess')
        editingTabIndex.value = null
        editingTabName.value = ''
      },
      {
        id: 'update-tab-name',
        message: commonMessages.updating,
      },
    )
  } else if (!detail.id) {
    // For new tabs that haven't been saved yet
    tabs.value[index] = newName
    detail.name = newName
    editingTabIndex.value = null
    editingTabName.value = ''
  } else {
    editingTabIndex.value = null
    editingTabName.value = ''
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}

.tab-editing {
  padding: 0 !important;
}

.tab-text {
  cursor: pointer;
  min-width: 0;
  max-width: 150px;
}

/* Ensure the row doesn't wrap */
.v-row {
  flex-wrap: nowrap !important;
}

/* Make tabs container responsive */
.v-tabs {
  overflow-x: auto;
  flex-shrink: 1;
}

/* Language selection dialog improvements */
.v-dialog .v-card {
  overflow: visible;
}

.v-radio-group .v-radio {
  margin-bottom: 8px;
}

.v-radio-group .v-radio:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  border-radius: 8px;
  transition: background-color 0.3s ease;
}
</style>
