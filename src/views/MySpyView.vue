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
        <button class="btn-ink" @click="createNew">+ {{ $t('common.create') }}</button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="resumes.length === 0" class="empty-state">
      <div class="empty-icon">◫</div>
      <p class="empty-title">{{ $t('mySpyView.empty.title') }}</p>
      <p class="empty-desc">{{ $t('mySpyView.empty.description') }}</p>
      <button class="btn-ink" @click="createNew">{{ $t('common.create') }}</button>
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
        <p class="dossier-date">{{ $t('mySpyView.card.filed') }} {{ resume.lastModifyTime }}</p>

        <!-- Thumbnail -->
        <div class="dossier-thumb" @click="openEditPage(resume.id)">
          <img
            v-if="resume.resumeImgPath"
            :src="resume.resumeImgPath"
            class="dossier-img"
            alt="Resume preview"
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLoading } from '@/composables/useLoading'
import { useToast } from '@/composables/useToast'
import type { Resume } from '@/models/resume.type'
import ResumeService from '@/api/resume-api'
import { useGuestStore } from '@/stores/guest'
import { useAuthStore } from '@/stores/auth'

const resumeService = new ResumeService()
const { t } = useI18n()
const { withLoading, commonMessages } = useLoading()
const toast = useToast()

const router = useRouter()
const guestStore = useGuestStore()
const authStore = useAuthStore()

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
  if (resume.id && resume.title !== '') {
    await withLoading(
      async () => {
        await resumeService.updateResumeName(resume.id, resume.title)
        resume.isEditing = false
        toast.success('toast.success.resumeRenameSuccess')
      },
      { id: 'rename-resume', message: commonMessages.updating },
    )
  } else {
    resume.isEditing = false
  }
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
    { id: 'clone-resume', message: 'Cloning resume...' },
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
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(250, 250, 250, 0.95);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
  padding: 1.5rem 2.5rem;
}

.archives-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.header-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--gold-dim);
  letter-spacing: 0.25em;
  margin-bottom: 0.25rem;
}

.header-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text);
  margin: 0;
}

.btn-ink {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
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

/* ── Empty State ─────────────────────────────────────────── */
.empty-state {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: var(--border);
  line-height: 1;
}

.empty-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.2rem;
  color: var(--muted);
  letter-spacing: 0.15em;
  margin: 0;
}

.empty-desc {
  font-style: italic;
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0;
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
