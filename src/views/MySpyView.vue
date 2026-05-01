<template>
  <div class="noir-archives">
    <div class="film-grain" aria-hidden="true" />

    <!-- Header -->
    <div class="archives-header">
      <div class="archives-header-inner">
        <div>
          <p class="header-overline">{{ $t('mySpyView.caseFilesLabel') }}</p>
          <h1 class="header-title">{{ $t('mySpyView.title') }}</h1>
        </div>
        <div class="header-actions">
          <button class="btn-ghost" :disabled="isImporting" @click="triggerFileInput">
            <span v-if="isImporting">{{ $t('mySpyView.importing') }}</span>
            <span v-else>↑ {{ $t('mySpyView.importFile') }}</span>
          </button>
          <button class="btn-ink" @click="createNew">+ {{ $t('common.create') }}</button>
          <input
            ref="fileInputRef"
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            class="sr-only"
            @change="onFileSelected"
          />
        </div>
      </div>
    </div>

    <!-- Floating Action Button (Noir Style) — desktop scroll shortcut -->
    <Transition name="fade">
      <button
        v-if="showFab"
        class="noir-fab"
        @click="createNew"
        :title="$t('common.create')"
      >
        <span class="fab-icon">+</span>
      </button>
    </Transition>

    <!-- Speed-dial scrim (mobile only) -->
    <Transition name="sd-scrim">
      <div v-if="speedDialOpen" class="sd-scrim" @click="speedDialOpen = false" />
    </Transition>

    <!-- Mobile FAB Speed Dial -->
    <div class="mobile-speed-dial">
      <div class="sd-actions">
        <!-- Import action -->
        <Transition name="sd-item">
          <div v-if="speedDialOpen" class="sd-action-row">
            <span class="sd-label">{{ $t('mySpyView.importFile') }}</span>
            <button
              class="sd-action-btn"
              :disabled="isImporting"
              @click="triggerFileInput(); speedDialOpen = false"
            >
              <span v-if="isImporting">…</span>
              <span v-else>↑</span>
            </button>
          </div>
        </Transition>
        <!-- Create action -->
        <Transition name="sd-item">
          <div v-if="speedDialOpen" class="sd-action-row">
            <span class="sd-label">{{ $t('common.create') }}</span>
            <button class="sd-action-btn" @click="createNew(); speedDialOpen = false">+</button>
          </div>
        </Transition>
      </div>
      <!-- Main trigger -->
      <button
        class="sd-main-btn"
        :class="{ 'sd-main--open': speedDialOpen }"
        @click="speedDialOpen = !speedDialOpen"
        :aria-label="speedDialOpen ? $t('common.close') : $t('common.create')"
        :aria-expanded="speedDialOpen"
      >
        <span class="sd-main-icon">+</span>
      </button>
    </div>

    <!-- Empty State / Drop Zone -->
    <div v-if="resumes.length === 0" class="empty-state">
      <p class="empty-overline">{{ $t('mySpyView.empty.overline') }}</p>
      <h2 class="empty-title">{{ $t('mySpyView.empty.title') }}</h2>
      <p class="empty-desc">{{ $t('mySpyView.empty.description') }}</p>

      <div
        class="drop-zone"
        :class="{ 'drop-zone--active': isDragging, 'drop-zone--loading': isImporting }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
      >
        <div v-if="isImporting" class="drop-loading">
          <span class="drop-dots"><span /><span /><span /></span>
          <p class="drop-label">{{ $t('mySpyView.importing') }}</p>
        </div>
        <template v-else>
          <svg class="drop-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="4" width="26" height="36" rx="2" stroke="currentColor" stroke-width="2.5"/>
            <path d="M28 4v10h10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="15" y1="22" x2="33" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="15" y1="29" x2="28" y2="29" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p class="drop-label">↑ {{ $t('mySpyView.empty.dropLabel') }}</p>
          <p class="drop-hint">{{ $t('mySpyView.empty.dropHint') }}</p>
          <p class="drop-formats">PDF · DOCX · TXT</p>
        </template>
      </div>

      <div class="empty-divider"><span>{{ $t('mySpyView.empty.or') }}</span></div>
      <button class="btn-ink" @click="createNew">+ {{ $t('mySpyView.empty.createScratch') }}</button>
    </div>

    <!-- Resume Grid -->
    <div v-else class="archives-grid">
      <div
        v-for="(resume, index) in resumes"
        :key="index"
        class="dossier-card"
      >
        <!-- Card Header: Title + Menu -->
        <div class="dossier-header">
          <v-text-field
            v-if="resume.isEditing"
            :ref="(el) => (titleInputRefs[index] = el)"
            v-model="resume.title"
            class="dossier-title-input"
            single-line
            dense
            hide-details
            autofocus
            variant="plain"
            @blur="onRename(resume)"
            @keydown.enter="onRename(resume)"
          />
          <v-tooltip location="bottom" v-else>
            <template v-slot:activator="{ props }">
              <span
                class="dossier-title"
                v-bind="props"
                @dblclick="startEditing(resume, index)"
              >{{ resume.title }}</span>
            </template>
            <span>{{ resume.title }}</span>
          </v-tooltip>

          <v-menu
            v-model="menu[index]"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ props }">
              <button class="dossier-menu-btn" v-bind="props">⋮</button>
            </template>
            <div class="noir-menu">
              <button class="noir-menu-item" @click="startEditing(resume, index); menu[index] = false">
                {{ $t('mySpyView.rename') }}
              </button>
              <button class="noir-menu-item" @click="onClone(resume)">
                {{ $t('mySpyView.clone') }}
              </button>
              <button class="noir-menu-item noir-menu-item--danger" @click="onDelete(resume)">
                {{ $t('mySpyView.delete') }}
              </button>
            </div>
          </v-menu>
        </div>

        <!-- Date -->
        <p class="dossier-date">{{ $t('mySpyView.card.filed') }} {{ formatDate(resume.lastModifyTime) }}</p>

        <!-- Thumbnail -->
        <div class="dossier-thumb" @click="openEditPage(resume.id)">
          <img
            v-if="resume.resumeImgPath"
            :src="resume.resumeImgPath"
            class="dossier-img"
            :alt="$t('mySpyView.card.previewAlt')"
          />
          <div v-else class="dossier-img-placeholder">
            <span>◈</span>
            <span class="placeholder-text">{{ $t('mySpyView.card.openDossier') }}</span>
          </div>
          <div class="dossier-thumb-overlay">
            <span>{{ $t('mySpyView.card.open') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLoading } from '@/composables/useLoading'
import { useToast } from '@/composables/useToast'
import type { Resume } from '@/models/resume.type'
import ResumeService from '@/api/resume-api'
import { useGuestStore } from '@/stores/guest'
import { useAuthStore } from '@/stores/auth'
import ResumeDetailService from '@/api/resume-detail-api'

const resumeService = new ResumeService()
const resumeDetailService = new ResumeDetailService()
const { t } = useI18n()
const { withLoading, commonMessages } = useLoading()
const toast = useToast()

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const router = useRouter()
const guestStore = useGuestStore()
const authStore = useAuthStore()

const resumes = ref<Resume[]>([])
const menu = ref<boolean[]>([])
const showFab = ref(false)
const isImporting = ref(false)
const speedDialOpen = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titleInputRefs = ref<any[]>([])

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const onDrop = async (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  await processImport(file)
}

const onFileSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!fileInputRef.value) return
  fileInputRef.value.value = ''
  if (!file) return
  await processImport(file)
}

const processImport = async (file: File) => {

  if (!authStore.isAuthenticated) {
    const quota = await guestStore.checkResumeQuota()
    if (quota && guestStore.hasReachedLimit) {
      toast.error(t('mySpyView.quota.limitReached'))
      return
    }
  }

  isImporting.value = true
  try {
    const resumeId = await withLoading(
      async () => {
        const { markdown, suggestedTitle } = await resumeService.importFile(file)
        const detail = await resumeDetailService.createResumeDetail({
          id: '',
          resumeId: '',
          name: 'Default',
          language: '',
          content: markdown,
          isDefault: true,
          createTime: '',
          lastModifyTime: '',
        })
        if (detail.resumeId) {
          await resumeService.updateResumeName(detail.resumeId, suggestedTitle)
        }
        if (!authStore.isAuthenticated) {
          await guestStore.checkResumeQuota()
          guestStore.notifyQuotaChanged()
        }
        return detail.resumeId
      },
      { id: 'import-file', message: t('mySpyView.importing'), showErrorToast: false },
    )
    toast.success(t('mySpyView.importSuccess'))
    router.push({ name: 'create', query: { resumeId } })
  } catch {
    toast.error(t('mySpyView.importError'))
  } finally {
    isImporting.value = false
  }
}

const handleScroll = () => {
  showFab.value = window.scrollY > 200
}

const originalTitles = ref<Record<string, string>>({})

const startEditing = async (resume: Resume, index: number) => {
  originalTitles.value[resume.id] = resume.title
  resume.isEditing = true
  await nextTick()
  const inputComponent = titleInputRefs.value[index]
  if (inputComponent) {
    const inputElement = inputComponent.$el.querySelector('input')
    if (inputElement) inputElement.select()
  }
}

const loadResumes = async () => {
  await withLoading(
    async () => {
      resumes.value = await resumeService.fetchResumes()
      menu.value = resumes.value.map(() => false)
    },
    { id: 'load-resumes', message: commonMessages.loading },
  )
}

onMounted(() => {
  loadResumes()
  if (!authStore.isAuthenticated) guestStore.checkResumeQuota()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const openEditPage = (id: string) => {
  router.push({ name: 'create', query: { resumeId: id } })
}

const createNew = async () => {
  if (!authStore.isAuthenticated) {
    const quota = await guestStore.checkResumeQuota()
    if (quota && guestStore.hasReachedLimit) {
      toast.error(t('mySpyView.quota.limitReached'))
      return
    }
  }
  router.push('/create')
}

const onRename = async (resume: Resume) => {
  const original = originalTitles.value[resume.id] ?? ''
  delete originalTitles.value[resume.id]

  const newTitle = resume.title.trim()

  if (!newTitle) {
    // Restore original if user cleared the field
    resume.title = original
    resume.isEditing = false
    return
  }

  if (newTitle === original) {
    // Nothing changed — skip the API call
    resume.isEditing = false
    return
  }

  resume.title = newTitle
  await withLoading(
    async () => {
      await resumeService.updateResumeName(resume.id, newTitle)
      resume.isEditing = false
      toast.success('toast.success.resumeRenameSuccess')
    },
    { id: 'rename-resume', message: commonMessages.updating },
  )
}

const onClone = async (resume: Resume) => {
  const index = resumes.value.indexOf(resume)
  menu.value[index] = false

  if (!authStore.isAuthenticated) {
    const quota = await guestStore.checkResumeQuota()
    if (quota && guestStore.hasReachedLimit) {
      toast.error(t('mySpyView.quota.cloneLimited'))
      return
    }
  }

  await withLoading(
    async () => {
      const newResume = await resumeService.cloneResume(resume.id)
      resumes.value.unshift(newResume)
      menu.value.unshift(false)
      if (!authStore.isAuthenticated) {
        await guestStore.checkResumeQuota()
        guestStore.notifyQuotaChanged()
      }
      toast.success('toast.success.resumeCloneSuccess')
    },
    { id: 'clone-resume', message: commonMessages.cloning },
  )
}

const onDelete = async (resume: Resume) => {
  if (resume.id) {
    await withLoading(
      async () => {
        await resumeService.deleteResume(resume.id)
        const index = resumes.value.indexOf(resume)
        if (index > -1) {
          resumes.value.splice(index, 1)
          menu.value.splice(index, 1)
        }
        if (!authStore.isAuthenticated) {
          const quota = await guestStore.checkResumeQuota()
          if (!quota) guestStore.decrementResumeCount()
          guestStore.notifyQuotaChanged()
        }
        toast.success('toast.success.resumeDeleteSuccess')
      },
      { id: 'delete-resume', message: commonMessages.deleting },
    )
  }
}
</script>

<style scoped>
.noir-archives {
  --bg:       #FAFAFA;
  --surface:  #F0F0F0;
  --border:   #D4D4D4;
  --text:     #121212;
  --muted:    #666666;
  --gold:     #121212;
  --gold-dim: #888888;
  --red:      #8b2020;
  --ink:      #FFFFFF;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
  padding-bottom: 4rem;
  overflow-x: hidden;
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

/* ── Header ─────────────────────────────────────────────── */
.archives-header {
  position: relative;
  z-index: 50;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  padding: 0 2.5rem;
}

.archives-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 72px;
}

@media (max-width: 600px) {
  .archives-header {
    padding: 0 1.5rem;
  }
}

.header-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: var(--gold-dim);
  letter-spacing: 0.2em;
  margin-bottom: 0.1rem;
}

.header-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* Speed dial takes over on mobile — hide the header buttons */
@media (max-width: 600px) {
  .header-actions {
    display: none;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.btn-ghost {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  background: transparent;
  border: 1.5px solid var(--border);
  padding: 0.7rem 1.4rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: border-color 0.2s, color 0.2s;
  white-space: nowrap;
}

.btn-ghost:hover:not(:disabled) {
  border-color: #888888;
  color: var(--text);
}

.btn-ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ink {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: #F5F5F5;
  background: #121212;
  border: 1.5px solid #121212;
  padding: 0.7rem 1.6rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  white-space: nowrap;
  box-shadow: 3px 3px 0 #AAAAAA;
}

.btn-ink:hover {
  background: #2B2B2B;
  transform: translateY(-2px);
  box-shadow: 5px 5px 0 #AAAAAA;
}

/* ── Floating Action Button ──────────────────────────────── */
.noir-fab {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 100;
  width: 56px;
  height: 56px;
  background: #121212;
  border: 2px solid #121212;
  color: #F5F5F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0 #AAAAAA;
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  /* Noir signature shape */
  clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
}

.noir-fab:hover {
  background: #2B2B2B;
  transform: scale(1.1) translateY(-2px);
  box-shadow: 6px 6px 0 #AAAAAA;
}

.fab-icon {
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1;
}

@media (max-width: 600px) {
  /* Hide scroll-triggered FAB on mobile — speed dial replaces it */
  .noir-fab {
    display: none !important;
  }
}

@media (min-width: 601px) {
  .noir-fab {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 48px;
    height: 48px;
  }
}

/* ── Mobile FAB Speed Dial ───────────────────────────────── */
.mobile-speed-dial {
  /* Hidden on desktop — only shown on mobile */
  display: none;
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 200;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.65rem;
}

@media (max-width: 600px) {
  .mobile-speed-dial {
    display: flex;
  }
}

/* Scrim behind the speed dial when open */
.sd-scrim {
  position: fixed;
  inset: 0;
  z-index: 190;
  background: rgba(0, 0, 0, 0.18);
  /* Hidden on desktop — speed dial never opens there */
  display: none;
}

@media (max-width: 600px) {
  .sd-scrim {
    display: block;
  }
}

/* Stack of action rows above the main FAB */
.sd-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
}

.sd-action-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

/* Pill label (noir style) */
.sd-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 0.3rem 0.65rem;
  box-shadow: 2px 2px 0 #AAAAAA;
  white-space: nowrap;
}

/* Mini action button */
.sd-action-btn {
  width: 44px;
  height: 44px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 3px 3px 0 #AAAAAA;
  clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%);
  transition: transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}

.sd-action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 4px 4px 0 #AAAAAA;
}

.sd-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Main trigger FAB */
.sd-main-btn {
  width: 52px;
  height: 52px;
  background: #121212;
  border: 2px solid #121212;
  color: #F5F5F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0 #AAAAAA;
  clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}

.sd-main-btn:hover {
  background: #2B2B2B;
  transform: scale(1.05) translateY(-2px);
  box-shadow: 6px 6px 0 #AAAAAA;
}

.sd-main-icon {
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1;
  display: block;
  transition: transform 0.3s ease;
}

/* Rotate + → × when open */
.sd-main--open .sd-main-icon {
  transform: rotate(45deg);
}

/* ── Speed dial transitions ──────────────────────────────── */
.sd-scrim-enter-active,
.sd-scrim-leave-active {
  transition: opacity 0.2s ease;
}
.sd-scrim-enter-from,
.sd-scrim-leave-to {
  opacity: 0;
}

.sd-item-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.sd-item-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.sd-item-enter-from,
.sd-item-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.92);
}

/* ── Transitions ────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

/* ── Empty State ─────────────────────────────────────────── */
.empty-state {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 2rem 4rem;
  gap: 0.75rem;
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.empty-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--gold-dim);
  letter-spacing: 0.3em;
  margin: 0;
}

.empty-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.03em;
  margin: 0.25rem 0 0;
}

.empty-desc {
  font-style: italic;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 0.5rem;
  max-width: 480px;
}

/* ── Drop Zone ───────────────────────────────────────────── */
.drop-zone {
  width: 100%;
  border: 2px dashed var(--border);
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  user-select: none;
  margin-top: 0.5rem;
}

.drop-zone:hover,
.drop-zone--active {
  border-color: #888888;
  background: rgba(0,0,0,0.02);
}

.drop-zone--loading {
  cursor: default;
  pointer-events: none;
}

.drop-icon {
  width: 56px;
  height: 56px;
  color: var(--muted);
  margin-bottom: 0.25rem;
}

.drop-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text);
  margin: 0;
}

.drop-hint {
  font-size: 0.85rem;
  color: var(--muted);
  margin: 0;
}

.drop-formats {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: #AAAAAA;
  margin: 0;
}

.drop-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
}

.drop-dots {
  display: flex;
  gap: 6px;
  align-items: center;
}

.drop-dots span {
  width: 7px;
  height: 7px;
  background: var(--muted);
  border-radius: 50%;
  animation: dot-pulse 1.2s ease-in-out infinite;
}

.drop-dots span:nth-child(2) { animation-delay: 0.2s; }
.drop-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50%       { opacity: 1;   transform: scale(1); }
}

.empty-divider {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
  color: var(--muted);
  font-size: 0.8rem;
  font-style: italic;
  margin: 0.5rem 0;
}

.empty-divider::before,
.empty-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* ── Grid ────────────────────────────────────────────────── */
.archives-grid {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem;
}

/* ── Dossier Card ────────────────────────────────────────── */
.dossier-card {
  position: relative;
  background: var(--surface);
  border: 1.5px solid var(--border);
  padding: 1.5rem;
  box-shadow: 4px 4px 0 #AAAAAA;
  transition: box-shadow 0.3s, transform 0.3s;
}

.dossier-card:hover {
  box-shadow: 6px 6px 0 #AAAAAA;
  transform: translateY(-2px);
}

.dossier-card::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid var(--border);
  pointer-events: none;
  opacity: 0.3;
}

.dossier-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.dossier-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.05em;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.dossier-title:hover { color: var(--gold); }

:deep(.dossier-title-input .v-field__input) {
  font-family: 'Inter', system-ui, sans-serif !important;
  font-size: 0.95rem !important;
  color: var(--text) !important;
  padding: 0 !important;
}

:deep(.dossier-title-input .v-field) {
  background: transparent !important;
  box-shadow: none !important;
}

.dossier-menu-btn {
  font-size: 1.2rem;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
  transition: color 0.2s;
  flex-shrink: 0;
}

.dossier-menu-btn:hover { color: var(--text); }

.dossier-date {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--muted);
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

/* ── Thumbnail ───────────────────────────────────────────── */
.dossier-thumb {
  position: relative;
  background: var(--ink);
  border: 1px solid var(--border);
  aspect-ratio: 3/4;
  overflow: hidden;
  cursor: pointer;
}

.dossier-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
  filter: grayscale(10%) contrast(1.02);
}

.dossier-thumb:hover .dossier-img { transform: scale(1.03); }

.dossier-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--border);
  font-size: 2rem;
}

.placeholder-text {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--muted);
}

.dossier-thumb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: var(--gold);
}

.dossier-thumb:hover .dossier-thumb-overlay { opacity: 1; }

/* ── Noir Menu ───────────────────────────────────────────── */
.noir-menu {
  background: #F0F0F0;
  border: 1.5px solid var(--border);
  min-width: 140px;
  box-shadow: 4px 4px 0 #AAAAAA;
}

.noir-menu-item {
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 0.65rem 1rem;
  text-align: left;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  border-bottom: 1px solid var(--border);
}

.noir-menu-item:last-child { border-bottom: none; }

.noir-menu-item:hover { color: var(--text); background: rgba(255,255,255,0.03); }

.noir-menu-item--danger:hover { color: #c0392b; }
</style>
