<!-- filepath: /Users/ws/Documents/DotCore/ResumeSpyWeb/src/views/CreateView.vue -->
<template>
  <div class="noir-create">
    <div class="film-grain" aria-hidden="true" />

    <!-- ── Toolbar ─────────────────────────────────────────── -->
    <div class="desk-toolbar">
      <!-- Tabs row -->
      <div class="tabs-row">
        <div class="tabs-strip">
          <v-tabs v-model="activeTab" class="noir-tabs">
            <v-tab
              v-for="(tab, index) in tabs"
              :key="`tab-${index}`"
              class="noir-tab"
              :class="{ 'tab-editing': isEditingTab(index) }"
            >
              <v-tooltip location="bottom" v-if="!isEditingTab(index)">
                <template v-slot:activator="{ props }">
                  <span class="tab-label" v-bind="props" @dblclick="editTabName(index)">
                    {{ tab }}
                  </span>
                </template>
                <span>{{ tab }}</span>
              </v-tooltip>
              <v-text-field
                v-else
                v-model="editingTabName"
                @blur="saveTabName(index)"
                @keydown.enter="saveTabName(index)"
                @keydown.esc="cancelEdit"
                single-line dense hide-details autofocus
                variant="plain"
                class="tab-editor"
                ref="tabEditor"
              />
              <v-icon
                v-if="!isEditingTab(index) && resumeDetails[index]?.isDefault"
                size="x-small" icon="mdi-star" class="tab-star ms-1"
              />
              <v-icon
                v-if="index > 0 && !isEditingTab(index)"
                size="small" icon="mdi-close" class="tab-close"
                @click.stop="openDeleteDialog(index)"
              />
            </v-tab>
          </v-tabs>
        </div>

        <!-- Action stamps -->
        <div class="action-stamps">
          <button class="stamp" @click="handleLanguageDialogOpen" title="Add Language">
            <v-icon size="14">mdi-file-account</v-icon>
            <span>{{ $t('createView.selectLanguage') }}</span>
          </button>

          <button class="stamp" @click="openSyncDialog" title="Sync">
            <v-icon size="14">mdi-translate</v-icon>
            <span>{{ $t('common.sync') }}</span>
          </button>

          <button class="stamp stamp--blue" @click="openPreview" title="Preview">
            <v-icon size="14">mdi-eye</v-icon>
            <span>{{ $t('createView.preview') }}</span>
          </button>

          <button class="stamp stamp--gold" @click="openTailorDialog" title="AI Tailor">
            <v-icon size="14">mdi-magic-staff</v-icon>
            <span>{{ $t('createView.tailorForJD') }}</span>
          </button>

          <v-menu>
            <template v-slot:activator="{ props }">
              <button class="stamp stamp--icon" v-bind="props">
                <v-icon size="16">mdi-dots-vertical</v-icon>
              </button>
            </template>
            <div class="noir-menu">
              <button class="noir-menu-item" @click="exportCurrentTabAsPdf">
                <v-icon size="14" class="me-2">mdi-file-pdf-box</v-icon>
                {{ $t('createView.exportPdf') }}
              </button>
              <button
                class="noir-menu-item"
                @click="setCurrentTabAsDefault"
                :disabled="!currentDetailId || resumeDetails[activeTab]?.isDefault"
              >
                <v-icon size="14" class="me-2">mdi-star-outline</v-icon>
                {{ $t('createView.setDefault') }}
              </button>
            </div>
          </v-menu>
        </div>
      </div>
    </div>

    <!-- ── Editor ─────────────────────────────────────────── -->
    <div class="editor-wrap">
      <v-tabs-window v-model="activeTab" class="noir-editor-window">
        <v-tabs-window-item v-for="(tab, index) in tabs" :key="tab">
          <v-md-editor
            v-model="editors[index]"
            @save="onSave(index)"
            height="calc(100vh - 110px)"
          >{{ tab }}</v-md-editor>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>

    <!-- ── Language Dialog ────────────────────────────────── -->
    <v-dialog v-model="isDialogActive" max-width="500px" persistent>
      <div class="noir-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ $t('createView.selectLanguage') }}</h3>
          <button class="dialog-close" @click="isDialogActive = false">✕</button>
        </div>
        <div class="dialog-body">
          <p class="dialog-hint">{{ $t('createView.selectLanguageHint') }}</p>
          <v-radio-group v-model="dialog" class="noir-radio-group">
            <template v-for="country in countries" :key="country.value">
              <v-radio :value="country.value" class="noir-radio">
                <template v-slot:label>
                  <div class="radio-label">
                    <country-flag v-if="country.flag" :country="country.flag" size="normal" class="me-3" />
                    <v-icon v-else class="me-3" size="large">mdi-earth</v-icon>
                    <span class="radio-text">{{ country.label }}</span>
                  </div>
                </template>
              </v-radio>
            </template>
          </v-radio-group>

          <v-expand-transition>
            <div v-if="isOtherSelected" class="other-lang-select">
              <p class="dialog-hint mb-2">{{ $t('createView.selectOtherLanguage') }}:</p>
              <v-select
                v-model="selectedOtherLanguage"
                :items="otherLanguages"
                item-title="name"
                item-value="code"
                :label="$t('createView.chooseLanguage')"
                variant="outlined"
                density="comfortable"
                class="noir-select"
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
        </div>
        <div class="dialog-footer">
          <button class="stamp" @click="isDialogActive = false" :disabled="isGlobalLoading">
            {{ $t('common.cancel') }}
          </button>
          <button
            class="stamp stamp--gold"
            @click="onAdd"
            :disabled="isAddDisabled"
          >
            {{ $t('common.add') }}
          </button>
        </div>
      </div>
    </v-dialog>

    <!-- ── Delete Tab Dialog ──────────────────────────────── -->
    <v-dialog v-model="isDeleteDialogActive" width="auto">
      <div class="noir-dialog noir-dialog--sm">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ $t('createView.confirmDelete') }}</h3>
        </div>
        <div class="dialog-body">
          <p class="dialog-hint">{{ $t('createView.deleteConfirm') }}</p>
        </div>
        <div class="dialog-footer">
          <button class="stamp" @click="isDeleteDialogActive = false">{{ $t('common.cancel') }}</button>
          <button class="stamp stamp--danger" @click="deleteTab">{{ $t('common.delete') }}</button>
        </div>
      </div>
    </v-dialog>

    <!-- ── Sync Dialog ────────────────────────────────────── -->
    <v-dialog v-model="isSyncDialogActive" width="auto">
      <div class="noir-dialog noir-dialog--sm">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ $t('createView.confirmSync') }}</h3>
        </div>
        <div class="dialog-body">
          <p class="dialog-hint">{{ $t('createView.currentTabTitle', { title: tabs[activeTab] }) }}</p>
        </div>
        <div class="dialog-footer">
          <button class="stamp" @click="isSyncDialogActive = false">{{ $t('common.cancel') }}</button>
          <button class="stamp stamp--gold" @click="syncTab">{{ $t('common.sync') }}</button>
        </div>
      </div>
    </v-dialog>

    <!-- ── Preview Dialog ─────────────────────────────────── -->
    <v-dialog v-model="isPreviewActive" max-width="860px" scrollable>
      <div class="noir-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ $t('createView.previewTitle') }}</h3>
          <button class="dialog-close" @click="isPreviewActive = false">✕</button>
        </div>
        <div class="dialog-body preview-body">
          <v-md-preview :text="editors[activeTab] || ''" class="noir-preview" />
        </div>
        <div class="dialog-footer">
          <button class="stamp stamp--blue" @click="() => { isPreviewActive = false; exportCurrentTabAsPdf() }">
            <v-icon size="14" class="me-1">mdi-file-pdf-box</v-icon>
            {{ $t('createView.exportPdf') }}
          </button>
          <button class="stamp" @click="isPreviewActive = false">{{ $t('common.close') }}</button>
        </div>
      </div>
    </v-dialog>

    <!-- ── Tailor Dialog ──────────────────────────────────── -->
    <v-dialog v-model="isTailorDialogActive" max-width="680px" persistent>
      <div class="noir-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">✦ {{ $t('createView.tailorDialogTitle') }}</h3>
          <button class="dialog-close" @click="isTailorDialogActive = false" :disabled="isGlobalLoading">✕</button>
        </div>
        <div class="dialog-body">
          <p class="dialog-hint">{{ $t('createView.tailorDialogHint') }}</p>
          <v-textarea
            v-model="jobDescription"
            :label="$t('createView.tailorJobDescriptionLabel')"
            :placeholder="$t('createView.tailorJobDescriptionPlaceholder')"
            variant="outlined"
            rows="10"
            auto-grow
            :disabled="isGlobalLoading"
            class="noir-textarea"
          />
        </div>
        <div class="dialog-footer">
          <button class="stamp" @click="isTailorDialogActive = false" :disabled="isGlobalLoading">
            {{ $t('common.cancel') }}
          </button>
          <button
            class="stamp stamp--gold"
            @click="runTailor"
            :disabled="!jobDescription.trim() || isGlobalLoading"
          >
            <v-icon size="14" class="me-1">mdi-magic-staff</v-icon>
            {{ $t('createView.tailorConfirm') }}
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
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
      { id: '', resumeId: '', name: newResumeTitle, language: '', content: '', isDefault: true, createTime: '', lastModifyTime: '' },
    ]
  }
})

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

const onAdd = async () => {
  const language =
    dialog.value === 'OTHER' && selectedOtherLanguage.value
      ? selectedOtherLanguage.value
      : dialog.value

  const existingResumeDetailId = resumeDetails.value[activeTab.value].id
  const originalName = resumeDetails.value[activeTab.value].name

  await withLoading(
    async () => {
      const newDetail = await resumeDetailService.createResumeDetailFromExisting(existingResumeDetailId, language)

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
        const newDetail = await resumeDetailService.createResumeDetail({ ...detail, content, name: tabs.value[index] })
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

const openSyncDialog = () => {
  if (!currentResumeId.value) return
  isSyncDialogActive.value = true
}

const syncTab = async () => {
  if (!currentResumeId.value) return
  const activeResumeDetailID = resumeDetails.value[activeTab.value].id
  if (!activeResumeDetailID) return
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

const openPreview = () => { isPreviewActive.value = true }

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
      const tailoredContent = await resumeDetailService.tailorResume(currentDetailId.value, jobDescription.value)
      editors.value[activeTab.value] = tailoredContent
      toast.success(t('createView.tailorSuccess'))
    },
    { id: 'tailor-resume', message: commonMessages.processing },
  )
}

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

const setCurrentTabAsDefault = async () => {
  if (!currentDetailId.value) {
    toast.warning(t('createView.unsavedBeforeAction'))
    return
  }
  await withLoading(
    async () => {
      await resumeDetailService.setDefault(currentDetailId.value)
      if (currentResumeId.value) await loadResumeDetails(currentResumeId.value)
      toast.success(t('createView.setDefaultSuccess'))
    },
    { id: 'set-default', message: commonMessages.updating },
  )
}
</script>

<style scoped>
.noir-create {
  --bg:       #FAFAFA;
  --surface:  #F0F0F0;
  --border:   #D4D4D4;
  --text:     #121212;
  --muted:    #666666;
  --gold:     #121212;
  --gold-dim: #888888;
  --ink:      #FFFFFF;
  --blue:     #1e4a6e;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
}

.film-grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.4;
  mix-blend-mode: overlay;
}

/* ── Toolbar ─────────────────────────────────────────────── */
.desk-toolbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(250, 250, 250, 0.97);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
}

.tabs-row {
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 48px;
  overflow-x: auto;
}

.tabs-strip {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* ── Noir Tabs ───────────────────────────────────────────── */
:deep(.noir-tabs) {
  background: transparent !important;
  border-bottom: none !important;
  height: 48px !important;
}

:deep(.v-tab) {
  font-family: 'IBM Plex Mono', monospace !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.12em !important;
  color: var(--muted) !important;
  text-transform: none !important;
  border-right: 1px solid var(--border) !important;
  border-bottom: none !important;
  min-width: 80px !important;
  padding: 0 12px !important;
  height: 48px !important;
  opacity: 1 !important;
  transition: color 0.2s, background 0.2s !important;
}

:deep(.v-tab--selected) {
  color: var(--text) !important;
  background: rgba(245, 245, 245, 0.05) !important;
  border-bottom: 2px solid var(--gold) !important;
}

:deep(.v-tabs__slider) { display: none !important; }

.tab-label {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.tab-editor {
  width: 140px;
}

:deep(.tab-editor .v-field__input) {
  font-family: 'IBM Plex Mono', monospace !important;
  font-size: 0.75rem !important;
  color: var(--text) !important;
  padding: 0 !important;
}

.tab-star { color: var(--gold) !important; }

.tab-close {
  color: #444444 !important;
  transition: color 0.2s !important;
  position: static !important;
  transform: none !important;
  margin-left: 4px !important;
}

.tab-close:hover { color: #888888 !important; }

/* ── Action Stamps ───────────────────────────────────────── */
.action-stamps {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 8px;
  border-left: 1px solid var(--border);
  flex-shrink: 0;
}

.stamp {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  background: transparent;
  border: 1px solid transparent;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: 32px;
}

.stamp:hover {
  color: var(--text);
  border-color: var(--border);
  background: rgba(255,255,255,0.03);
}

.stamp--gold { color: var(--gold-dim); }
.stamp--gold:hover { color: var(--gold); border-color: var(--gold-dim); }

.stamp--blue { color: #4a7fa5; }
.stamp--blue:hover { color: #6aa5cc; border-color: var(--blue); }

.stamp--danger { color: #888888; }
.stamp--danger:hover { color: #F5F5F5; border-color: #666666; }

.stamp--icon { padding: 0.35rem; }

.stamp:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Editor ──────────────────────────────────────────────── */
.editor-wrap { position: relative; z-index: 10; }

:deep(.noir-editor-window) { background: var(--bg) !important; }

/* Override v-md-editor to light theme */
:deep(.v-md-editor) {
  background: #FAFAFA !important;
  border: none !important;
  border-radius: 0 !important;
}

:deep(.v-md-editor__toolbar) {
  background: #F0F0F0 !important;
  border-bottom: 1px solid var(--border) !important;
}

:deep(.v-md-editor__toolbar-item) {
  color: var(--muted) !important;
}

:deep(.v-md-editor__toolbar-item:hover) {
  color: var(--text) !important;
  background: rgba(0,0,0,0.04) !important;
}

:deep(.v-md-editor__editor-wrapper) {
  background: #FAFAFA !important;
}

:deep(.codemirror-wrapper) {
  background: #FAFAFA !important;
}

:deep(.CodeMirror) {
  background: #FAFAFA !important;
  color: #121212 !important;
  font-family: 'IBM Plex Mono', monospace !important;
  font-size: 14px !important;
  line-height: 1.8 !important;
}

:deep(.CodeMirror-gutters) {
  background: #F0F0F0 !important;
  border-right: 1px solid var(--border) !important;
}

:deep(.CodeMirror-linenumber) { color: var(--muted) !important; }

:deep(.v-md-editor__preview-wrapper) {
  background: #F5F5F5 !important;
  border-left: 1px solid var(--border) !important;
}

/* ── Dialogs ─────────────────────────────────────────────── */
.noir-dialog {
  background: #F0F0F0;
  border: 1.5px solid var(--border);
  box-shadow: 6px 6px 0 #AAAAAA;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.noir-dialog--sm { max-width: 400px; }

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.dialog-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.1em;
  margin: 0;
}

.dialog-close {
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
  padding: 0;
}

.dialog-close:hover { color: var(--text); }
.dialog-close:disabled { opacity: 0.4; }

.dialog-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.dialog-hint {
  font-style: italic;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.preview-body {
  max-height: 65vh;
}

/* Noir radio group */
:deep(.noir-radio-group .v-radio) {
  border-bottom: 1px solid var(--border);
  padding: 0.6rem 0;
}

:deep(.v-selection-control__input > .v-icon) {
  color: var(--gold-dim) !important;
}

.radio-label {
  display: flex;
  align-items: center;
}

.radio-text {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  color: var(--text);
  letter-spacing: 0.08em;
}

.other-lang-select {
  border: 1px solid var(--border);
  padding: 1rem;
  background: rgba(0,0,0,0.2);
}

/* Noir select */
:deep(.noir-select .v-field) {
  background: var(--ink) !important;
  border-radius: 0 !important;
}

:deep(.noir-select .v-field__outline) { color: var(--border) !important; }

:deep(.noir-textarea .v-field) {
  background: var(--ink) !important;
  border-radius: 0 !important;
  font-family: 'IBM Plex Mono', monospace !important;
}

:deep(.noir-textarea .v-field__outline) { color: var(--border) !important; }
:deep(.noir-textarea .v-field--focused .v-field__outline) { color: var(--gold-dim) !important; }
:deep(.noir-textarea textarea) { color: var(--text) !important; line-height: 1.7 !important; }

/* Noir menu */
.noir-menu {
  background: #F0F0F0;
  border: 1.5px solid var(--border);
  min-width: 160px;
  box-shadow: 4px 4px 0 #AAAAAA;
}

.noir-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  padding: 0.65rem 1rem;
  text-align: left;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  border-bottom: 1px solid var(--border);
}

.noir-menu-item:last-child { border-bottom: none; }
.noir-menu-item:hover:not(:disabled) { color: var(--text); background: rgba(0,0,0,0.04); }
.noir-menu-item:disabled { opacity: 0.35; cursor: not-allowed; }

/* Noir preview */
:deep(.noir-preview) {
  background: #F5F5F5 !important;
  color: var(--text) !important;
  font-family: 'Inter', system-ui, sans-serif !important;
}
</style>
