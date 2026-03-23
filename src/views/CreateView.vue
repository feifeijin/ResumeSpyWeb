<!-- filepath: /Users/ws/Documents/DotCore/ResumeSpyWeb/src/views/CreateView.vue -->
<template>
  <v-container fluid>
    <!-- Toolbar Row: Tabs + Actions -->
    <v-row align="center" class="mb-4" no-gutters>
      <!-- Tabs -->
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
                >{{ tab }}</span>
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
            <!-- Star icon for default tab -->
            <v-icon
              v-if="!isEditingTab(index) && resumeDetails[index]?.isDefault"
              size="x-small"
              icon="mdi-star"
              color="amber"
              class="ms-1"
            ></v-icon>
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

      <!-- Action Buttons -->
      <v-col cols="auto" style="flex-shrink: 0" class="d-flex align-center flex-wrap gap-1">
        <!-- Add Language -->
        <v-btn
          prepend-icon="mdi-file-account"
          :text="$t('createView.selectLanguage')"
          variant="outlined"
          @click="handleLanguageDialogOpen"
          size="small"
        ></v-btn>

        <!-- Sync -->
        <v-btn color="secondary" size="small" @click="openSyncDialog" style="white-space: nowrap">
          {{ $t('common.sync') }}
        </v-btn>

        <!-- Preview -->
        <v-btn
          color="info"
          size="small"
          prepend-icon="mdi-eye"
          variant="tonal"
          @click="openPreview"
        >
          {{ $t('createView.preview') }}
        </v-btn>

        <!-- Tailor for JD -->
        <v-btn
          color="purple"
          size="small"
          prepend-icon="mdi-magic-staff"
          variant="tonal"
          @click="openTailorDialog"
        >
          {{ $t('createView.tailorForJD') }}
        </v-btn>

        <!-- More Actions Menu -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small"></v-btn>
          </template>
          <v-list density="compact">
            <v-list-item
              prepend-icon="mdi-file-pdf-box"
              :title="$t('createView.exportPdf')"
              @click="exportCurrentTabAsPdf"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-star-outline"
              :title="$t('createView.setDefault')"
              @click="setCurrentTabAsDefault"
              :disabled="!currentDetailId || resumeDetails[activeTab]?.isDefault"
            ></v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <!-- Editor -->
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

    <!-- ── Language Selection Dialog ── -->
    <v-dialog v-model="isDialogActive" max-width="500px" persistent>
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
                    <v-icon v-else class="me-4" color="primary" size="large">mdi-earth</v-icon>
                    <div class="d-flex flex-column">
                      <span class="text-subtitle-1 font-weight-medium">{{ country.label }}</span>
                      <span class="text-caption text-medium-emphasis">{{ country.value }}</span>
                    </div>
                  </div>
                </template>
              </v-radio>
            </template>
          </v-radio-group>

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
          <v-btn variant="text" @click="isDialogActive = false" class="me-2" :disabled="isGlobalLoading">
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
    </v-dialog>

    <!-- ── Delete Tab Dialog ── -->
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

    <!-- ── Sync Dialog ── -->
    <v-dialog v-model="isSyncDialogActive" width="auto">
      <v-card>
        <v-card-title class="headline">{{ $t('createView.confirmSync') }}</v-card-title>
        <v-card-text>{{ $t('createView.currentTabTitle', { title: tabs[activeTab] }) }}</v-card-text>
        <v-card-actions>
          <v-btn :text="$t('common.cancel')" @click="isSyncDialogActive = false"></v-btn>
          <v-btn color="primary" :text="$t('common.sync')" @click="syncTab"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Preview Dialog ── -->
    <v-dialog v-model="isPreviewActive" max-width="860px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <v-icon class="me-2" color="info">mdi-eye</v-icon>
          <span>{{ $t('createView.previewTitle') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="isPreviewActive = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 75vh; overflow-y: auto">
          <v-md-preview :text="editors[activeTab] || ''" />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            prepend-icon="mdi-file-pdf-box"
            variant="tonal"
            @click="() => { isPreviewActive = false; exportCurrentTabAsPdf() }"
          >
            {{ $t('createView.exportPdf') }}
          </v-btn>
          <v-btn variant="text" @click="isPreviewActive = false" class="ms-2">
            {{ $t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── JD Tailoring Dialog ── -->
    <v-dialog v-model="isTailorDialogActive" max-width="680px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center pa-5">
          <v-icon class="me-2" color="purple">mdi-magic-staff</v-icon>
          <span>{{ $t('createView.tailorDialogTitle') }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-5">
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ $t('createView.tailorDialogHint') }}
          </p>
          <v-textarea
            v-model="jobDescription"
            :label="$t('createView.tailorJobDescriptionLabel')"
            :placeholder="$t('createView.tailorJobDescriptionPlaceholder')"
            variant="outlined"
            rows="10"
            auto-grow
            :disabled="isGlobalLoading"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="isTailorDialogActive = false" :disabled="isGlobalLoading">
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="purple"
            variant="elevated"
            prepend-icon="mdi-magic-staff"
            @click="runTailor"
            :disabled="!jobDescription.trim() || isGlobalLoading"
            :loading="isGlobalLoading"
          >
            {{ $t('createView.tailorConfirm') }}
          </v-btn>
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
import type { ResumeDetail } from '@/models/resume-detail.type'
import ResumeDetailService from '@/api/resume-detail-api'
import { useGuestStore } from '@/stores/guest'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const { withLoading, commonMessages, isGlobalLoading } = useLoading()
const toast = useToast()

const resumeDetailService = new ResumeDetailService()
const route = useRoute()
const router = useRouter()
const guestStore = useGuestStore()
const authStore = useAuthStore()

const dialog = ref('')
const currentResumeId = ref<string | null>(null)

const resumeDetails = ref<ResumeDetail[]>([])
const tabs = ref(resumeDetails.value.map((detail) => detail.name))
const activeTab = ref(0)
const editors = ref(resumeDetails.value.map((detail) => detail.content))

// Derived helper
const currentDetailId = computed(() => resumeDetails.value[activeTab.value]?.id || '')

const countries = computed(() => [
  { flag: 'us', label: t('languages.english'), value: 'EN' },
  { flag: 'jp', label: t('languages.japanese'), value: 'JA' },
  { flag: 'cn', label: t('languages.chinese'), value: 'ZH' },
  { flag: null, label: t('languages.other'), value: 'OTHER', isOther: true },
])

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

// Dialog state
const isDialogActive = ref(false)
const isDeleteDialogActive = ref(false)
const tabIndexToDelete = ref(-1)
const isSyncDialogActive = ref(false)
const isPreviewActive = ref(false)
const isTailorDialogActive = ref(false)
const editingTabIndex = ref<number | null>(null)
const editingTabName = ref('')
const selectedOtherLanguage = ref('')
const jobDescription = ref('')

const isOtherSelected = computed(() => dialog.value === 'OTHER')

const isAddDisabled = computed(() => {
  if (isGlobalLoading) return true
  if (!dialog.value) return true
  if (dialog.value === 'OTHER' && !selectedOtherLanguage.value) return true
  return false
})

// ─── Load resume details ───────────────────────────────────────────────────────

const loadResumeDetails = async (resumeId: string) => {
  currentResumeId.value = resumeId
  await withLoading(
    async () => {
      resumeDetails.value = await resumeDetailService.fetchResumeDetailsByResumeId(resumeId)
      tabs.value = resumeDetails.value.map((detail) => detail.name)
      editors.value = resumeDetails.value.map((detail) => detail.content)
    },
    { id: 'load-resume-details', message: commonMessages.loading },
  )
}

onMounted(() => {
  const resumeId = route.query.resumeId
  if (typeof resumeId === 'string' && resumeId) {
    loadResumeDetails(resumeId)
  } else {
    const newResumeTitle = t('createView.newResume')
    tabs.value = [newResumeTitle]
    editors.value = ['']
    resumeDetails.value = [
      {
        id: '',
        resumeId: '',
        name: newResumeTitle,
        language: '',
        content: '',
        isDefault: true,
        createTime: '',
        lastModifyTime: '',
      },
    ]
  }
})

// ─── Language helpers ──────────────────────────────────────────────────────────

const getLanguageDisplayName = (languageCode: string): string => {
  const mainLanguage = countries.value.find((country) => country.value === languageCode)
  if (mainLanguage && !mainLanguage.isOther) return mainLanguage.label
  const otherLanguage = otherLanguages.find((lang) => lang.code === languageCode)
  if (otherLanguage) return otherLanguage.name
  return languageCode
}

const handleLanguageDialogOpen = () => {
  const currentContent = editors.value[activeTab.value] ?? ''
  if (!currentContent || currentContent.trim().length === 0) {
    toast.error(t('createView.emptyContentError'))
    return
  }
  dialog.value = ''
  selectedOtherLanguage.value = ''
  isDialogActive.value = true
}

// ─── Add language version ──────────────────────────────────────────────────────

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

      let cleanName = originalName
      const postfixPatterns = [
        / - EN$/i, / - JA$/i, / - ZH$/i, / - ES$/i, / - FR$/i, / - DE$/i,
        / - IT$/i, / - PT$/i, / - RU$/i, / - KO$/i, / - TH$/i, / - VI$/i,
        / - AR$/i, / - HI$/i, / - TR$/i,
        / \(EN\)$/i, / \(JA\)$/i, / \(ZH\)$/i, / \(ES\)$/i, / \(FR\)$/i,
        / \(DE\)$/i, / \(IT\)$/i, / \(PT\)$/i, / \(RU\)$/i, / \(KO\)$/i,
        / \(TH\)$/i, / \(VI\)$/i, / \(AR\)$/i, / \(HI\)$/i, / \(TR\)$/i,
      ]
      postfixPatterns.forEach((pattern) => { cleanName = cleanName.replace(pattern, '') })

      const nameWithLanguage = `${cleanName} - ${language}`
      newDetail.name = nameWithLanguage

      if (newDetail.id) {
        await resumeDetailService.updateResumeDetailName(newDetail.id, nameWithLanguage)
      }

      resumeDetails.value.push(newDetail)
      tabs.value.push(newDetail.name)
      editors.value.push(newDetail.content)
      if (newDetail.resumeId) currentResumeId.value = newDetail.resumeId

      dialog.value = ''
      selectedOtherLanguage.value = ''
      isDialogActive.value = false
      activeTab.value = tabs.value.length - 1

      const languageDisplayName = getLanguageDisplayName(language)
      toast.success('toast.success.resumeLanguageAdded', undefined, { language: languageDisplayName })
    },
    { id: 'create-language-version', message: commonMessages.creating },
  )
}

// ─── Save ─────────────────────────────────────────────────────────────────────

const onSave = async (index: number) => {
  await withLoading(
    async () => {
      const content = editors.value[index]
      const detail = resumeDetails.value[index]
      if (detail.id) {
        await resumeDetailService.updateResumeDetailContent(detail.id, content)
        detail.content = content
        if (detail.resumeId) currentResumeId.value = detail.resumeId
      } else {
        if (!authStore.isAuthenticated) {
          await guestStore.checkResumeQuota()
          if (guestStore.hasReachedLimit) {
            toast.error(t('errors.guestLimitReached'))
            return
          }
        }
        const newDetail = await resumeDetailService.createResumeDetail({
          ...detail,
          content,
          name: tabs.value[index],
        })
        resumeDetails.value[index] = newDetail
        if (newDetail.resumeId) {
          currentResumeId.value = newDetail.resumeId
          router.replace({ query: { ...route.query, resumeId: newDetail.resumeId } })
          if (!authStore.isAuthenticated) {
            await guestStore.checkResumeQuota()
            guestStore.notifyQuotaChanged()
          }
        }
      }
      toast.success('toast.success.resumeSaveSuccess')
    },
    { id: 'save-resume', message: commonMessages.saving },
  )
}

// ─── Delete tab ────────────────────────────────────────────────────────────────

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
        cancelEdit()
        if (currentResumeId.value) await loadResumeDetails(currentResumeId.value)
        isDeleteDialogActive.value = false
        tabIndexToDelete.value = -1
      },
      { id: 'delete-tab', message: commonMessages.deleting },
    )
  }
}

// ─── Sync translations ─────────────────────────────────────────────────────────

const openSyncDialog = () => {
  if (!currentResumeId.value) {
    console.warn('No resume ID available to sync. Save your resume before syncing.')
    return
  }
  isSyncDialogActive.value = true
}

const syncTab = async () => {
  if (!currentResumeId.value) return

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
      toast.success('toast.success.resumeSyncSuccess')
    },
    { id: 'sync-translations', message: commonMessages.syncing },
  )
}

// ─── Tab name editing ──────────────────────────────────────────────────────────

const editTabName = (index: number) => {
  editingTabIndex.value = index
  editingTabName.value = tabs.value[index]
}

const isEditingTab = (index: number) => editingTabIndex.value === index

const cancelEdit = () => {
  editingTabIndex.value = null
  editingTabName.value = ''
}

const saveTabName = async (index: number) => {
  const newName = editingTabName.value.trim()
  if (!newName) { cancelEdit(); return }

  const detail = resumeDetails.value[index]
  if (detail.id && newName !== detail.name) {
    await withLoading(
      async () => {
        await resumeDetailService.updateResumeDetailName(detail.id, newName)
        detail.name = newName
        tabs.value[index] = newName
        toast.success('toast.success.tabRenameSuccess')
        editingTabIndex.value = null
        editingTabName.value = ''
      },
      { id: 'update-tab-name', message: commonMessages.updating },
    )
  } else if (!detail.id) {
    tabs.value[index] = newName
    detail.name = newName
    editingTabIndex.value = null
    editingTabName.value = ''
  } else {
    editingTabIndex.value = null
    editingTabName.value = ''
  }
}

// ─── Preview ───────────────────────────────────────────────────────────────────

const openPreview = () => {
  isPreviewActive.value = true
}

// ─── JD Tailoring ──────────────────────────────────────────────────────────────

const openTailorDialog = () => {
  if (!currentDetailId.value) {
    toast.warning(t('createView.unsavedBeforeAction'))
    return
  }
  jobDescription.value = ''
  isTailorDialogActive.value = true
}

const runTailor = async () => {
  if (!jobDescription.value.trim()) {
    toast.error(t('createView.tailorEmptyError'))
    return
  }

  isTailorDialogActive.value = false

  await withLoading(
    async () => {
      const tailoredContent = await resumeDetailService.tailorResume(
        currentDetailId.value,
        jobDescription.value,
      )
      editors.value[activeTab.value] = tailoredContent
      toast.success(t('createView.tailorSuccess'))
    },
    { id: 'tailor-resume', message: commonMessages.processing },
  )
}

// ─── Export PDF ────────────────────────────────────────────────────────────────

const exportCurrentTabAsPdf = async () => {
  if (!currentDetailId.value) {
    toast.warning(t('createView.unsavedBeforeAction'))
    return
  }

  await withLoading(
    async () => {
      const blob = await resumeDetailService.exportPdf(currentDetailId.value)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tabs.value[activeTab.value]}_${new Date().toISOString().slice(0, 10)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    },
    { id: 'export-pdf', message: commonMessages.downloading },
  )
}

// ─── Set Default ───────────────────────────────────────────────────────────────

const setCurrentTabAsDefault = async () => {
  if (!currentDetailId.value) {
    toast.warning(t('createView.unsavedBeforeAction'))
    return
  }

  await withLoading(
    async () => {
      await resumeDetailService.setDefault(currentDetailId.value)
      // Refresh to update isDefault flags across all tabs
      if (currentResumeId.value) await loadResumeDetails(currentResumeId.value)
      toast.success(t('createView.setDefaultSuccess'))
    },
    { id: 'set-default', message: commonMessages.updating },
  )
}
</script>

<style scoped>
.tab-editing {
  padding: 0 !important;
}

.tab-text {
  cursor: pointer;
  min-width: 0;
  max-width: 150px;
}

.v-row {
  flex-wrap: nowrap !important;
}

.v-tabs {
  overflow-x: auto;
  flex-shrink: 1;
}

.gap-1 {
  gap: 4px;
}
</style>
