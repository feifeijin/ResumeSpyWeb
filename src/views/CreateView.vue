<!-- filepath: /Users/ws/Documents/DotCore/ResumeSpyWeb/src/views/CreateView.vue -->
<template>
  <div class="noir-create" ref="createContainerRef">
    <div class="film-grain" aria-hidden="true" />

    <!-- ── Toolbar ─────────────────────────────────────────── -->
    <div class="desk-toolbar" ref="toolbarRef">
      <!-- Tabs row -->
      <div class="tabs-row">
        <div class="tabs-strip">
          <div class="custom-tabs">
            <div
              v-for="(tab, index) in tabs"
              :key="`tab-${index}`"
              class="custom-tab"
              :class="{
                'custom-tab--active': activeTab === index,
                'tab-editing': isEditingTab(index),
                'tab--dragging': dragIndex === index,
                'tab--drag-over': dragOverIndex === index && dragOverIndex !== dragIndex,
              }"
              draggable="true"
              @click="activeTab = index"
              @dragstart="onTabDragStart(index, $event)"
              @dragover.prevent="onTabDragOver(index)"
              @drop.prevent="onTabDrop(index)"
              @dragend="onTabDragEnd"
            >
              <v-icon
                v-if="!isEditingTab(index)"
                size="x-small"
                icon="mdi-drag-horizontal-variant"
                class="tab-drag-handle"
              />
              <v-tooltip location="bottom" v-if="!isEditingTab(index)">
                <template v-slot:activator="{ props }">
                  <span class="tab-label" v-bind="props" @dblclick.stop="editTabName(index)">
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
                single-line
                dense
                hide-details
                autofocus
                variant="plain"
                class="tab-editor"
                ref="tabEditor"
              />
              <v-icon
                v-if="!isEditingTab(index) && resumeDetails[index]?.isDefault"
                size="x-small"
                icon="mdi-star"
                class="tab-star ms-1"
              />
              <v-icon
                v-if="index > 0 && !isEditingTab(index)"
                size="small"
                icon="mdi-close"
                class="tab-close"
                @click.stop="openDeleteDialog(index)"
              />
            </div>
          </div>
        </div>

        <!-- Action stamps -->
        <div class="action-stamps">
          <v-tooltip location="bottom" :text="$t('createView.selectLanguage')">
            <template #activator="{ props }">
              <button class="stamp" v-bind="props" @click="handleLanguageDialogOpen">
                <v-icon size="15">mdi-file-account</v-icon>
                <span>{{ $t('createView.selectLanguage') }}</span>
              </button>
            </template>
          </v-tooltip>
          <v-tooltip location="bottom" :text="$t('version.history')">
            <template #activator="{ props }">
              <button class="stamp" v-bind="props" @click="openHistoryPanel">
                <v-icon size="15">mdi-history</v-icon>
                <span>{{ $t('version.history') }}</span>
              </button>
            </template>
          </v-tooltip>
          <div class="stamp-divider" />
          <v-tooltip location="bottom" text="How to use ResumeSpy">
            <template #activator="{ props }">
              <button class="stamp stamp--help" v-bind="props" @click="isGuideDialogOpen = true">
                <v-icon size="15">mdi-help-circle-outline</v-icon>
              </button>
            </template>
          </v-tooltip>
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
            :height="editorHeight"
            :toolbar="starToolbar"
            left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save set-default | sync export-pdf"
            right-toolbar="toc sync-scroll fullscreen"
            >{{ tab }}</v-md-editor
          >
        </v-tabs-window-item>
      </v-tabs-window>
    </div>

    <!-- ── Status Bar ────────────────────────────────────── -->
    <div class="editor-statusbar">
      <div class="status-left">
        <span
          class="status-indicator"
          :class="{
            'status-unsaved': saveStatus === 'unsaved',
            'status-saving': saveStatus === 'saving',
            'status-saved': saveStatus === 'saved',
          }"
        >
          <template v-if="saveStatus === 'saving'">
            <v-icon size="11" class="status-spin">mdi-loading</v-icon>
            {{ $t('createView.statusBar.saving') }}
          </template>
          <template v-else-if="saveStatus === 'saved'">
            <v-icon size="11">mdi-check</v-icon>
            {{ $t('createView.statusBar.saved') }}
          </template>
          <template v-else-if="saveStatus === 'unsaved'">
            <v-icon size="11">mdi-circle-small</v-icon>
            {{ $t('createView.statusBar.unsaved') }}
          </template>
        </span>
      </div>
      <div class="status-right">
        <span class="status-stat">{{
          $t('createView.statusBar.words', { count: wordCount })
        }}</span>
        <span class="status-sep">·</span>
        <span class="status-stat">{{
          $t('createView.statusBar.chars', { count: charCount })
        }}</span>
        <span class="status-sep">·</span>
        <span class="status-stat status-hint">{{ $t('createView.statusBar.shortcutHint') }}</span>
      </div>
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
                    <country-flag
                      v-if="country.flag"
                      :country="country.flag"
                      size="normal"
                      class="me-3"
                    />
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
                  <v-list-item v-bind="props" :title="undefined" :subtitle="undefined">
                    <div class="lang-option-row">
                      <country-flag :country="item.raw.flag" size="small" class="lang-flag" />
                      <span class="lang-name">{{ item.raw.name }}</span>
                      <span class="lang-code">{{ item.raw.code }}</span>
                    </div>
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
          <button class="stamp stamp--gold" @click="onAdd" :disabled="isAddDisabled">
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
          <button class="stamp" @click="isDeleteDialogActive = false">
            {{ $t('common.cancel') }}
          </button>
          <button class="stamp stamp--danger" @click="deleteTab">{{ $t('common.delete') }}</button>
        </div>
      </div>
    </v-dialog>

    <!-- ── Sync Dialog ────────────────────────────────────── -->
    <v-dialog v-model="isSyncDialogActive" width="360">
      <div class="noir-dialog sync-dialog">
        <!-- Detective illustration -->
        <div class="sync-detective">
          <svg
            viewBox="0 0 160 130"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            class="sync-svg"
          >
            <!-- Hat crown -->
            <rect x="52" y="8" width="42" height="32" rx="5" fill="#111" />
            <rect x="42" y="37" width="62" height="8" rx="4" fill="#1a1a1a" />
            <rect x="52" y="32" width="42" height="7" fill="#0c0c0c" />
            <!-- Head -->
            <ellipse cx="73" cy="57" rx="22" ry="23" fill="#2c2c2c" />
            <ellipse cx="73" cy="66" rx="16" ry="12" fill="#222" />
            <!-- Eyes -->
            <ellipse cx="64" cy="53" rx="4" ry="3" fill="#0e0e0e" />
            <ellipse cx="83" cy="53" rx="4" ry="3" fill="#0e0e0e" />
            <circle cx="65" cy="53" r="1.8" fill="#080808" />
            <circle cx="84" cy="53" r="1.8" fill="#080808" />
            <circle cx="65" cy="52" r="0.7" fill="#ccc" opacity="0.5" />
            <circle cx="84" cy="52" r="0.7" fill="#ccc" opacity="0.5" />
            <!-- Satisfied smirk -->
            <path
              d="M65 67 Q73 72 81 67"
              stroke="#111"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
            />
            <!-- Neck -->
            <rect x="66" y="79" width="13" height="10" rx="2" fill="#2a2a2a" />
            <!-- Coat -->
            <path d="M40 90 L32 130 L114 130 L106 90 Z" fill="#1a1a1a" />
            <path d="M73 100 L52 90 L58 118 Z" fill="#111" />
            <path d="M73 100 L94 90 L88 118 Z" fill="#111" />
            <path d="M52 90 L62 80 L73 100 Z" fill="#1c1c1c" />
            <path d="M94 90 L84 80 L73 100 Z" fill="#1c1c1c" />
            <!-- Left arm — pointing at document -->
            <path d="M40 90 L20 108 L27 112 L47 96 Z" fill="#141414" />
            <ellipse cx="22" cy="111" rx="6" ry="4" fill="#2a2a2a" />
            <!-- Finger pointing -->
            <line
              x1="18"
              y1="110"
              x2="10"
              y2="107"
              stroke="#2a2a2a"
              stroke-width="3"
              stroke-linecap="round"
            />
            <!-- Document / case file -->
            <rect x="0" y="95" width="14" height="18" rx="1" fill="#e8e0d0" opacity="0.9" />
            <line x1="2" y1="100" x2="12" y2="100" stroke="#bbb" stroke-width="1" />
            <line x1="2" y1="103" x2="12" y2="103" stroke="#bbb" stroke-width="1" />
            <line x1="2" y1="106" x2="9" y2="106" stroke="#bbb" stroke-width="1" />
            <!-- Check mark on document -->
            <path
              d="M3 109 L6 112 L12 107"
              stroke="#2a7a2a"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="check-mark"
            />
            <!-- Right arm relaxed -->
            <path d="M106 90 L120 108 L113 112 L99 96 Z" fill="#141414" />
            <ellipse cx="117" cy="111" rx="6" ry="4" fill="#2a2a2a" />
            <!-- Cigarette -->
            <rect x="118" y="109" width="13" height="2.5" rx="1" fill="#d4c9a8" />
            <circle cx="119" cy="110" r="2" class="cig-ember" fill="#cc4400" />
            <!-- Smoke -->
            <circle cx="119" cy="104" r="1.8" class="det-smoke s1" fill="#888" />
            <circle cx="117" cy="98" r="1.4" class="det-smoke s2" fill="#777" />
            <circle cx="120" cy="92" r="0.9" class="det-smoke s3" fill="#666" />
          </svg>
        </div>

        <!-- Message -->
        <div class="sync-body">
          <p class="sync-title">Translate to all languages</p>
          <p class="sync-msg">{{ $t('createView.syncHint') }}</p>
          <div class="sync-info-row">
            <div class="sync-info-item">
              <v-icon size="14" class="me-1">mdi-translate</v-icon>
              <span>AI translation</span>
            </div>
            <div class="sync-info-item">
              <v-icon size="14" class="me-1">mdi-lightning-bolt</v-icon>
              <span>All tabs updated</span>
            </div>
            <div class="sync-info-item">
              <v-icon size="14" class="me-1">mdi-lock-outline</v-icon>
              <span>Original preserved</span>
            </div>
          </div>
        </div>

        <div class="sync-footer">
          <button class="stamp" @click="isSyncDialogActive = false">
            {{ $t('common.cancel') }}
          </button>
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
          <button
            class="stamp stamp--blue"
            @click="
              () => {
                isPreviewActive = false
                exportCurrentTabAsPdf()
              }
            "
          >
            <v-icon size="14" class="me-1">mdi-file-pdf-box</v-icon>
            {{ $t('createView.exportPdf') }}
          </button>
          <button class="stamp" @click="isPreviewActive = false">{{ $t('common.close') }}</button>
        </div>
      </div>
    </v-dialog>

    <!-- ── Version History Panel ─────────────────────────── -->
    <VersionHistoryPanel
      :open="isHistoryPanelOpen"
      :versions="versions"
      @close="isHistoryPanelOpen = false"
      @restore="onRestoreVersion"
      @delete="onDeleteVersion"
    />

    <!-- ── User Guide Dialog ────────────────────────────── -->
    <v-dialog v-model="isGuideDialogOpen" max-width="560px" scrollable>
      <div class="noir-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">◈ How to use ResumeSpy</h3>
          <button class="dialog-close" @click="isGuideDialogOpen = false">✕</button>
        </div>
        <div class="dialog-body guide-body">
          <div class="guide-section">
            <div class="guide-step">
              <div class="guide-step-icon">01</div>
              <div class="guide-step-content">
                <div class="guide-step-title">Create Your Resume</div>
                <div class="guide-step-desc">
                  Write in <strong>Markdown</strong> — clean, portable, and version-controlled. Use the toolbar for headings, bold, lists, and links. Press <kbd>Cmd+S</kbd> to save anytime.
                </div>
              </div>
            </div>
            <div class="guide-step">
              <div class="guide-step-icon">02</div>
              <div class="guide-step-content">
                <div class="guide-step-title">Add Language Versions</div>
                <div class="guide-step-desc">
                  Click <strong>Select Language</strong> to create a new language tab (English, Japanese, Chinese…). Each version is stored independently so you can tailor tone and vocabulary per market.
                </div>
              </div>
            </div>
            <div class="guide-step">
              <div class="guide-step-icon">03</div>
              <div class="guide-step-content">
                <div class="guide-step-title">Sync Across Languages</div>
                <div class="guide-step-desc">
                  After editing the primary version, click <strong>Sync</strong> (↔ in the editor toolbar) to automatically translate and propagate your changes to all other language tabs. No manual re-typing.
                </div>
              </div>
            </div>
            <div class="guide-step">
              <div class="guide-step-icon">04</div>
              <div class="guide-step-content">
                <div class="guide-step-title">Build from Scratch with the Detective</div>
                <div class="guide-step-desc">
                  New to resumes? Click the <strong>detective icon</strong> (bottom right) to open the AI chat. Answer a few questions and hit <strong>Generate</strong> — the Detective writes your full resume from the conversation.
                </div>
              </div>
            </div>
            <div class="guide-step">
              <div class="guide-step-icon">05</div>
              <div class="guide-step-content">
                <div class="guide-step-title">Export as PDF</div>
                <div class="guide-step-desc">
                  Click <strong>Export PDF</strong> in the editor toolbar to download a ready-to-send PDF. The layout is clean and ATS-friendly — no bloated design, no gimmicks.
                </div>
              </div>
            </div>
            <div class="guide-step">
              <div class="guide-step-icon">06</div>
              <div class="guide-step-content">
                <div class="guide-step-title">Version History</div>
                <div class="guide-step-desc">
                  Click <strong>History</strong> to see all saved versions. Restore any previous version with one click. Every save is automatically snapshotted.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="stamp stamp--gold" @click="isGuideDialogOpen = false">Got it ✓</button>
        </div>
      </div>
    </v-dialog>

    <!-- ── Detective Chat Widget ─────────────────────────── -->
    <DetectiveChatWidget
      :current-content="editors[activeTab] || ''"
      :language="resumeDetails[activeTab]?.language ?? undefined"
      @apply-proposal="onApplyProposal"
    />

    <!-- ── Tailor Dialog ──────────────────────────────────── -->
    <v-dialog v-model="isTailorDialogActive" max-width="680px" persistent>
      <div class="noir-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">✦ {{ $t('createView.tailorDialogTitle') }}</h3>
          <button
            class="dialog-close"
            @click="isTailorDialogActive = false"
            :disabled="isGlobalLoading"
          >
            ✕
          </button>
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
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from '@/composables/useLoading'
import { useToast } from '@/composables/useToast'
import { useVersion } from '@/composables/useVersion'
import type { ResumeDetail } from '@/models/resume-detail.type'
import ResumeDetailService from '@/api/resume-detail-api'
import { useGuestStore } from '@/stores/guest'
import { useAuthStore } from '@/stores/auth'
import VersionHistoryPanel from '@/components/version/VersionHistoryPanel.vue'
import DetectiveChatWidget from '@/components/DetectiveChatWidget.vue'

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

// ── Version control ───────────────────────────────────────────
const isHistoryPanelOpen = ref(false)
const { versions, loadVersions, snapshot, removeVersion } = useVersion(() => currentDetailId.value)

watch(currentDetailId, (id) => {
  if (id) loadVersions()
})

// Refs for ResizeObserver-based height calculation
const createContainerRef = ref<HTMLElement | null>(null)
const toolbarRef = ref<HTMLElement | null>(null)
const editorHeight = ref('600px')

const recalcEditorHeight = () => {
  const container = createContainerRef.value
  const toolbar = toolbarRef.value
  if (!container || !toolbar) return
  const h = container.clientHeight - toolbar.clientHeight
  editorHeight.value = `${Math.max(200, h)}px`
}

let _ro: ResizeObserver | null = null

const countries = computed(() => [
  { flag: 'us', label: t('languages.english'), value: 'EN' },
  { flag: 'jp', label: t('languages.japanese'), value: 'JA' },
  { flag: 'cn', label: t('languages.chinese'), value: 'ZH' },
  { flag: null, label: t('languages.other'), value: 'OTHER', isOther: true },
])

const availableOtherLanguages = [
  { code: 'ES', flag: 'es', nameKey: 'languages.es' },
  { code: 'FR', flag: 'fr', nameKey: 'languages.fr' },
  { code: 'DE', flag: 'de', nameKey: 'languages.de' },
  { code: 'IT', flag: 'it', nameKey: 'languages.it' },
  { code: 'PT', flag: 'pt', nameKey: 'languages.pt' },
  { code: 'RU', flag: 'ru', nameKey: 'languages.ru' },
  { code: 'KO', flag: 'kr', nameKey: 'languages.ko' },
  { code: 'TH', flag: 'th', nameKey: 'languages.th' },
  { code: 'VI', flag: 'vn', nameKey: 'languages.vi' },
  { code: 'AR', flag: 'sa', nameKey: 'languages.ar' },
  { code: 'HI', flag: 'in', nameKey: 'languages.hi' },
  { code: 'TR', flag: 'tr', nameKey: 'languages.tr' },
]

const otherLanguages = computed(() =>
  availableOtherLanguages.map((lang) => ({
    code: lang.code,
    flag: lang.flag,
    name: t(lang.nameKey),
  })),
)

const isDialogActive = ref(false)
const isDeleteDialogActive = ref(false)
const tabIndexToDelete = ref(-1)
const isSyncDialogActive = ref(false)
const isPreviewActive = ref(false)
const isTailorDialogActive = ref(false)
const isGuideDialogOpen = ref(false)
const editingTabIndex = ref<number | null>(null)
const editingTabName = ref('')
const selectedOtherLanguage = ref('')
const jobDescription = ref('')

const isOtherSelected = computed(() => dialog.value === 'OTHER')

// ── Save status ───────────────────────────────────────────────
type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved'
const saveStatus = ref<SaveStatus>('idle')
const savedContent = ref<string[]>([])
let savedStatusTimer: ReturnType<typeof setTimeout> | null = null

const wordCount = computed(() => {
  const text = (editors.value[activeTab.value] || '').replace(/```[\s\S]*?```|`[^`]*`/g, '')
  const words = text.replace(/[#*_[\]()\-+>]/g, ' ').trim()
  return words ? words.split(/\s+/).filter(Boolean).length : 0
})

const charCount = computed(() => (editors.value[activeTab.value] || '').length)

const hasUnsavedChanges = computed(() =>
  editors.value.some((content, i) => content !== (savedContent.value[i] ?? '')),
)

watch(
  () => editors.value[activeTab.value],
  (newVal, oldVal) => {
    if (newVal === undefined || newVal === oldVal) return
    const saved = savedContent.value[activeTab.value] ?? ''
    saveStatus.value = newVal === saved ? 'saved' : 'unsaved'
  },
)

// Cmd+S / Ctrl+S is handled by v-md-editor's built-in @save event.
// A separate window keydown listener would fire onSave twice — do not add one.

// Block navigation when unsaved
onBeforeRouteLeave((_to, _from, next) => {
  if (hasUnsavedChanges.value) {
    const confirmed = window.confirm(t('createView.unsavedLeaveWarning'))
    if (!confirmed) {
      next(false)
      return
    }
  }
  next()
})

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
      savedContent.value = resumeDetails.value.map((detail) => detail.content)
      saveStatus.value = 'idle'
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
    savedContent.value = ['']
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

  nextTick(() => {
    recalcEditorHeight()
    _ro = new ResizeObserver(recalcEditorHeight)
    if (createContainerRef.value) _ro.observe(createContainerRef.value)
    if (toolbarRef.value) _ro.observe(toolbarRef.value)
  })
})

onUnmounted(() => {
  if (savedStatusTimer) clearTimeout(savedStatusTimer)
  _ro?.disconnect()
})

const getLanguageDisplayName = (languageCode: string): string => {
  const mainLanguage = countries.value.find((country) => country.value === languageCode)
  if (mainLanguage && !mainLanguage.isOther) return mainLanguage.label
  const otherLanguage = otherLanguages.value.find((lang) => lang.code === languageCode)
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
      const newDetail = await resumeDetailService.createResumeDetailFromExisting(
        existingResumeDetailId,
        language,
      )

      let cleanName = originalName
      const codes = [
        'EN',
        'JA',
        'ZH',
        'ES',
        'FR',
        'DE',
        'IT',
        'PT',
        'RU',
        'KO',
        'TH',
        'VI',
        'AR',
        'HI',
        'TR',
      ]
      codes.forEach((code) => {
        const patternDash = new RegExp(` - ${code}$`, 'i')
        const patternParen = new RegExp(` \\(${code}\\)$`, 'i')
        cleanName = cleanName.replace(patternDash, '').replace(patternParen, '')
      })

      const nameWithLanguage = `${cleanName} - ${language}`
      newDetail.name = nameWithLanguage

      if (newDetail.id) {
        await resumeDetailService.updateResumeDetailName(newDetail.id, nameWithLanguage)
      }

      resumeDetails.value.push(newDetail)
      tabs.value.push(newDetail.name)
      editors.value.push(newDetail.content)
      savedContent.value.push(newDetail.content)
      if (newDetail.resumeId) currentResumeId.value = newDetail.resumeId

      dialog.value = ''
      selectedOtherLanguage.value = ''
      isDialogActive.value = false
      activeTab.value = tabs.value.length - 1

      const languageDisplayName = getLanguageDisplayName(language)
      toast.success('toast.success.resumeLanguageAdded', undefined, {
        language: languageDisplayName,
      })
    },
    { id: 'create-language-version', message: commonMessages.creating },
  )
}

const onSave = async (index: number) => {
  saveStatus.value = 'saving'
  await withLoading(
    async () => {
      const content = editors.value[index]
      const detail = resumeDetails.value[index]
      if (detail.id) {
        await resumeDetailService.updateResumeDetailContent(detail.id, content)
        detail.content = content
        savedContent.value[index] = content
        if (detail.resumeId) currentResumeId.value = detail.resumeId
      } else {
        if (!authStore.isAuthenticated) {
          await guestStore.checkResumeQuota()
          if (guestStore.hasReachedLimit) {
            toast.error(t('errors.guestLimitReached'))
            saveStatus.value = 'unsaved'
            return
          }
        }
        const newDetail = await resumeDetailService.createResumeDetail({
          ...detail,
          content,
          name: tabs.value[index],
        })
        resumeDetails.value[index] = newDetail
        savedContent.value[index] = content
        if (newDetail.resumeId) {
          currentResumeId.value = newDetail.resumeId
          router.replace({ query: { ...route.query, resumeId: newDetail.resumeId } })
          if (!authStore.isAuthenticated) {
            await guestStore.checkResumeQuota()
            guestStore.notifyQuotaChanged()
          }
        }
      }
      saveStatus.value = 'saved'
      if (savedStatusTimer) clearTimeout(savedStatusTimer)
      savedStatusTimer = setTimeout(() => {
        saveStatus.value = 'idle'
      }, 3000)
      toast.success('toast.success.resumeSaveSuccess')
      // Background snapshot — fire-and-forget, no loading overlay
      snapshot(content)
    },
    { id: 'save-resume', message: commonMessages.saving },
  )
}

// ── Drag-to-reorder tabs ──────────────────────────────────────
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function onTabDragStart(index: number, event: DragEvent) {
  dragIndex.value = index
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onTabDragOver(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) return
  dragOverIndex.value = index
}

function onTabDrop(toIndex: number) {
  const fromIndex = dragIndex.value
  if (fromIndex === null || fromIndex === toIndex) {
    dragIndex.value = null
    dragOverIndex.value = null
    return
  }

  const move = <T>(arr: T[]): T[] => {
    const result = [...arr]
    const [item] = result.splice(fromIndex, 1)
    result.splice(toIndex, 0, item)
    return result
  }

  tabs.value = move(tabs.value)
  editors.value = move(editors.value)
  savedContent.value = move(savedContent.value)
  resumeDetails.value = move(resumeDetails.value)

  // Keep the active tab tracking the same item
  if (activeTab.value === fromIndex) {
    activeTab.value = toIndex
  } else if (activeTab.value > fromIndex && activeTab.value <= toIndex) {
    activeTab.value--
  } else if (activeTab.value < fromIndex && activeTab.value >= toIndex) {
    activeTab.value++
  }

  dragIndex.value = null
  dragOverIndex.value = null

  // Persist order — fire and forget
  if (currentResumeId.value) {
    const orderedIds = resumeDetails.value.map((d) => d.id).filter(Boolean)
    resumeDetailService.reorderDetails(currentResumeId.value, orderedIds).catch(() => {})
  }
}

function onTabDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
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
      // Save current editor content first so backend reads the latest version
      await onSave(activeTab.value)
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

const starToolbar = {
  'set-default': {
    title: () => t('createView.setDefault'),
    text: '★',
    active: () => resumeDetails.value[activeTab.value]?.isDefault === true,
    action: () => setCurrentTabAsDefault(),
  },
  sync: {
    title: () => t('common.sync'),
    icon: 'mdi mdi-translate',
    action: () => openSyncDialog(),
  },
  'export-pdf': {
    title: () => t('createView.exportPdf'),
    icon: 'mdi mdi-file-pdf-box',
    action: () => exportCurrentTabAsPdf(),
  },
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

const openHistoryPanel = () => {
  if (!currentDetailId.value) {
    toast.warning(t('createView.unsavedBeforeAction'))
    return
  }
  loadVersions()
  isHistoryPanelOpen.value = true
}

const onRestoreVersion = (content: string) => {
  editors.value[activeTab.value] = content
  isHistoryPanelOpen.value = false
  saveStatus.value = 'unsaved'
  toast.success('version.restoreSuccess')
}

const onDeleteVersion = async (id: string) => {
  await removeVersion(id)
}

const onApplyProposal = async (content: string) => {
  editors.value[activeTab.value] = content
  saveStatus.value = 'unsaved'
  await onSave(activeTab.value)
}
</script>

<style scoped>
.noir-create {
  --bg: #fafafa;
  --surface: #f0f0f0;
  --border: #d4d4d4;
  --text: #121212;
  --muted: #666666;
  --gold: #121212;
  --gold-dim: #888888;
  --ink: #ffffff;
  --blue: #1e4a6e;

  position: fixed;
  top: var(--v-layout-top);
  left: 0;
  right: 0;
  bottom: 26px; /* height of .editor-statusbar */
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  flex-shrink: 0;
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

/* ── Custom Draggable Tabs ───────────────────────────────── */
.custom-tabs {
  display: flex;
  align-items: stretch;
  height: 48px;
  overflow-x: auto;
  overflow-y: hidden;
}

.custom-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  text-transform: none;
  border-right: 1px solid var(--border);
  min-width: 80px;
  padding: 0 10px;
  height: 48px;
  cursor: pointer;
  user-select: none;
  transition:
    color 0.2s,
    background 0.2s;
  box-sizing: border-box;
  flex-shrink: 0;
}

.custom-tab:hover {
  color: var(--text);
  background: rgba(245, 245, 245, 0.03);
}

.custom-tab--active {
  color: var(--text) !important;
  background: rgba(245, 245, 245, 0.05) !important;
  border-bottom: 2px solid var(--gold) !important;
}

.tab-drag-handle {
  color: var(--muted) !important;
  opacity: 0;
  transition: opacity 0.15s;
  cursor: grab;
  flex-shrink: 0;
}

.custom-tab:hover .tab-drag-handle {
  opacity: 0.5;
}

.tab--dragging {
  opacity: 0.4;
}

.tab--drag-over {
  border-left: 2px solid var(--gold) !important;
  background: rgba(245, 245, 245, 0.06) !important;
}

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

.tab-star {
  color: var(--gold) !important;
}

.tab-close {
  color: #444444 !important;
  transition: color 0.2s !important;
  position: static !important;
  transform: none !important;
  margin-left: 4px !important;
}

.tab-close:hover {
  color: #888888 !important;
}

/* ── Action Stamps ───────────────────────────────────────── */
.action-stamps {
  display: flex;
  align-items: center;
  gap: 1px;
  padding: 0 10px;
  border-left: 1px solid var(--border);
  flex-shrink: 0;
}

.stamp {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0 10px;
  cursor: pointer;
  transition:
    color 0.15s,
    background 0.15s,
    border-color 0.15s;
  white-space: nowrap;
  height: 30px;
}

.stamp:hover {
  color: var(--text);
  background: rgba(0, 0, 0, 0.05);
  border-color: var(--border);
}

.stamp--gold {
  color: var(--gold-dim);
}
.stamp--gold:hover {
  color: var(--gold);
  border-color: var(--gold-dim);
}

.stamp--blue {
  color: #4a7fa5;
}
.stamp--blue:hover {
  color: #6aa5cc;
  border-color: var(--blue);
}

.stamp--danger {
  color: #888888;
}
.stamp--danger:hover {
  color: #f5f5f5;
  border-color: #666666;
}

.stamp--icon {
  padding: 0.35rem;
}

.stamp:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ── Editor ──────────────────────────────────────────────── */
.editor-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

:deep(.noir-editor-window) {
  background: var(--bg) !important;
}

/* Fullscreen: raise above AppBar (Vuetify AppBar z-index ~1004) */
:deep(.v-md-editor--fullscreen) {
  z-index: 2000 !important;
}

/* Override v-md-editor to light theme */
:deep(.v-md-editor) {
  background: #fafafa !important;
  border: none !important;
  border-radius: 0 !important;
}

:deep(.v-md-editor__toolbar) {
  background: #f0f0f0 !important;
  border-bottom: 1px solid var(--border) !important;
}

:deep(.v-md-editor__toolbar-item) {
  color: var(--muted) !important;
}

:deep(.v-md-editor__toolbar-item:hover) {
  color: var(--text) !important;
  background: rgba(0, 0, 0, 0.04) !important;
}

/* ── Set-as-default star button ─────────────────────────── */
:deep(.v-md-editor__toolbar-item-set-default) {
  font-size: 15px;
  line-height: 28px;
  color: var(--muted) !important;
  transition:
    color 0.2s,
    background 0.2s;
}

:deep(.v-md-editor__toolbar-item-set-default.v-md-editor__toolbar-item--active) {
  color: #c8962a !important;
  background: transparent !important;
}

:deep(.v-md-editor__toolbar-item-set-default:hover) {
  color: var(--text) !important;
}

/* Sync + Export PDF toolbar buttons */
:deep(.v-md-editor__toolbar-item-sync .mdi),
:deep(.v-md-editor__toolbar-item-export-pdf .mdi) {
  font-size: 16px;
  line-height: 1;
}

:deep(.v-md-editor__toolbar-item-export-pdf .mdi) {
  color: inherit;
}

:deep(.v-md-editor__editor-wrapper) {
  background: #fafafa !important;
}

:deep(.codemirror-wrapper) {
  background: #fafafa !important;
}

:deep(.CodeMirror) {
  background: #fafafa !important;
  color: #121212 !important;
  font-family: 'IBM Plex Mono', monospace !important;
  font-size: 14px !important;
  line-height: 1.8 !important;
}

:deep(.CodeMirror-gutters) {
  background: #f0f0f0 !important;
  border-right: 1px solid var(--border) !important;
}

:deep(.CodeMirror-linenumber) {
  color: var(--muted) !important;
}

:deep(.v-md-editor__preview-wrapper) {
  background: #f5f5f5 !important;
  border-left: 1px solid var(--border) !important;
}

/* ── Dialogs ─────────────────────────────────────────────── */
/* Kill Vuetify's default white overlay background */
:deep(.v-overlay__content) {
  background: transparent !important;
  box-shadow: none !important;
}

.noir-dialog {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 2px 2px 0 #d8d8d8;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
}

.noir-dialog--sm {
  max-width: 400px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.dialog-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0;
}

.dialog-close {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.15s;
  padding: 0;
  line-height: 1;
}

.dialog-close:hover {
  color: #333;
}
.dialog-close:disabled {
  opacity: 0.4;
}

.dialog-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  background: #ffffff;
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
  padding: 12px 20px;
  border-top: 1px solid #e8e8e8;
  background: #f5f5f5;
  flex-shrink: 0;
}

/* ── Sync dialog ─────────────────────────────────────────── */
.sync-detective {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: center;
  padding: 1rem 0 0.5rem;
}

.sync-svg {
  width: 160px;
  height: auto;
}

/* check mark draw-on animation */
.check-mark {
  stroke-dasharray: 14;
  stroke-dashoffset: 14;
  animation: draw-check 0.5s ease-out 0.3s forwards;
}
@keyframes draw-check {
  to {
    stroke-dashoffset: 0;
  }
}

/* cigarette ember */
.cig-ember {
  animation: ember 2.5s ease-in-out infinite alternate;
}
@keyframes ember {
  from {
    fill: #cc4400;
  }
  to {
    fill: #ff6622;
    opacity: 0.7;
  }
}

/* smoke */
.det-smoke {
  animation: det-drift 3s ease-out infinite;
}
.s1 {
  animation-delay: 0s;
  opacity: 0.55;
}
.s2 {
  animation-delay: 0.7s;
  opacity: 0.4;
}
.s3 {
  animation-delay: 1.4s;
  opacity: 0.25;
}
@keyframes det-drift {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: inherit;
  }
  100% {
    transform: translate(-3px, -20px) scale(2);
    opacity: 0;
  }
}

.sync-body {
  padding: 1.25rem 1.5rem 0.75rem;
  text-align: center;
}

.sync-msg {
  font-style: italic;
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

.sync-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem 1.25rem;
}


.preview-body {
  max-height: 65vh;
}

/* ── Guide dialog ─────────────────────────────────────────── */
.guide-body {
  padding: 0;
}

.guide-section {
  display: flex;
  flex-direction: column;
}

.guide-step {
  display: flex;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.15s;
}

.guide-step:last-child {
  border-bottom: none;
}

.guide-step:hover {
  background: rgba(0, 0, 0, 0.02);
}

.guide-step-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: #f5f5f5;
  color: #888;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  margin-top: 1px;
}

.guide-step-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.06em;
  margin-bottom: 0.35rem;
}

.guide-step-desc {
  font-size: 0.83rem;
  color: #555;
  line-height: 1.6;
}

.guide-step-desc strong {
  color: #1a1a1a;
  font-weight: 600;
}

kbd {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  background: #e8e8e8;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 1px 5px;
  color: #333;
}

/* ── Stamp divider & help button ─────────────────────────── */
.stamp-divider {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 4px;
  flex-shrink: 0;
}

.stamp--help {
  padding: 0 8px;
  color: #999;
}

.stamp--help:hover {
  color: #1a1a1a;
}

/* ── Sync dialog extras ───────────────────────────────────── */
.sync-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text);
  margin: 0 0 0.4rem;
}

.sync-info-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.sync-info-item {
  display: flex;
  align-items: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--muted);
  gap: 2px;
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
  background: rgba(0, 0, 0, 0.03);
}

.lang-option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  width: 100%;
}

.lang-flag {
  flex-shrink: 0;
}

.lang-name {
  flex: 1;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lang-code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: #999;
  flex-shrink: 0;
}

/* Noir select */
:deep(.noir-select .v-field) {
  background: var(--ink) !important;
  border-radius: 0 !important;
}

:deep(.noir-select .v-field__outline) {
  color: var(--border) !important;
}

:deep(.noir-textarea .v-field) {
  background: var(--ink) !important;
  border-radius: 0 !important;
  font-family: 'IBM Plex Mono', monospace !important;
}

:deep(.noir-textarea .v-field__outline) {
  color: var(--border) !important;
}
:deep(.noir-textarea .v-field--focused .v-field__outline) {
  color: var(--gold-dim) !important;
}
:deep(.noir-textarea textarea) {
  color: var(--text) !important;
  line-height: 1.7 !important;
}

/* Noir menu */
.noir-menu {
  background: #f0f0f0;
  border: 1.5px solid var(--border);
  min-width: 160px;
  box-shadow: 4px 4px 0 #aaaaaa;
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
  transition:
    color 0.2s,
    background 0.2s;
  border-bottom: 1px solid var(--border);
}

.noir-menu-item:last-child {
  border-bottom: none;
}
.noir-menu-item:hover:not(:disabled) {
  color: var(--text);
  background: rgba(0, 0, 0, 0.04);
}
.noir-menu-item:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Noir preview */
:deep(.noir-preview) {
  background: #f5f5f5 !important;
  color: var(--text) !important;
  font-family: 'Inter', system-ui, sans-serif !important;
}

/* ── Status Bar ──────────────────────────────────────────────── */
.editor-statusbar {
  /* Fixed at bottom: always visible even when editor is in fullscreen (z-2000) */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2001;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 26px;
  background: rgba(240, 240, 240, 0.97);
  border-top: 1px solid var(--border);
  backdrop-filter: blur(8px);
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  transition: color 0.3s;
}

.status-unsaved {
  color: #c07a00;
}
.status-saving {
  color: #4a7fa5;
}
.status-saved {
  color: #4a8a5a;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.status-spin {
  animation: spin 0.8s linear infinite;
}

.status-stat {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: var(--gold-dim);
}

.status-sep {
  color: var(--border);
  font-size: 0.7rem;
}

.status-hint {
  opacity: 0.55;
}
</style>
