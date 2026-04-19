<template>
  <!-- ── Floating trigger ──────────────────────────────────── -->
  <button
    class="dc-trigger"
    :class="{ 'dc-trigger--open': isOpen }"
    :style="{ right: dragPos.right + 'px', bottom: dragPos.bottom + 'px' }"
    @mousedown="onTriggerMousedown"
    @touchstart.passive="onTriggerTouchstart"
    @click="toggleChat"
    :aria-label="isOpen ? 'Close Detective Assistant' : 'Open Detective Assistant'"
    :aria-expanded="isOpen"
    aria-haspopup="dialog"
  >
    <!-- Animated detective SVG (replace src with your GIF once chosen) -->
    <span class="dc-trigger-avatar" aria-hidden="true">
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="dc-avatar-svg">
        <!-- Hat -->
        <rect x="13" y="5" width="22" height="13" rx="3" fill="#2a2a2a" class="dc-hat"/>
        <rect x="9"  y="16" width="30" height="4"  rx="2" fill="#333"/>
        <!-- Head -->
        <ellipse cx="24" cy="27" rx="11" ry="11" fill="#444" class="dc-head"/>
        <!-- Eyes (blinking) -->
        <ellipse cx="20" cy="25" rx="2.5" ry="2" fill="#1a1a1a" class="dc-eye dc-eye-l"/>
        <ellipse cx="28" cy="25" rx="2.5" ry="2" fill="#1a1a1a" class="dc-eye dc-eye-r"/>
        <circle  cx="20.8" cy="24.4" r="0.9" fill="#fff" opacity="0.7"/>
        <circle  cx="28.8" cy="24.4" r="0.9" fill="#fff" opacity="0.7"/>
        <!-- Mouth -->
        <path d="M20 31 Q24 34 28 31" stroke="#222" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <!-- Magnifying glass (bobbing) -->
        <circle cx="37" cy="36" r="5"   stroke="#c8a951" stroke-width="1.8" fill="none" class="dc-glass"/>
        <line   x1="33"  y1="40"  x2="30" y2="43" stroke="#c8a951" stroke-width="2"   stroke-linecap="round" class="dc-glass"/>
        <!-- Notification dot -->
        <circle v-if="hasUnread" cx="40" cy="8" r="5" fill="#e05555"/>
        <text   v-if="hasUnread && unreadCount < 10" x="40" y="12" text-anchor="middle" font-size="6" fill="#fff" font-family="monospace">
          {{ unreadCount }}
        </text>
      </svg>
    </span>
    <span class="dc-trigger-label">{{ isOpen ? '✕' : t('chat.triggerLabel') }}</span>
  </button>

  <!-- ── Chat panel ────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="chat-pop">
      <div
        v-if="isOpen"
        class="dc-panel"
        :style="{ right: dragPos.right + 'px', bottom: dragPos.bottom + 'px' }"
        role="dialog"
        aria-label="Detective Assistant Chat"
        aria-modal="true"
      >
        <!-- Header -->
        <div class="dc-panel-header">
          <div class="dc-panel-identity">
            <svg viewBox="0 0 32 32" class="dc-panel-avatar" aria-hidden="true">
              <rect x="8"  y="3"  width="16" height="10" rx="2" fill="#2a2a2a"/>
              <rect x="5"  y="11" width="22" height="3"  rx="1.5" fill="#333"/>
              <ellipse cx="16" cy="20" rx="8" ry="8" fill="#444"/>
              <ellipse cx="13" cy="19" rx="2" ry="1.5" fill="#1a1a1a" class="dc-blink"/>
              <ellipse cx="19" cy="19" rx="2" ry="1.5" fill="#1a1a1a" class="dc-blink"/>
              <path d="M13 23 Q16 25.5 19 23" stroke="#222" stroke-width="1.2" fill="none" stroke-linecap="round"/>
            </svg>
            <div>
              <div class="dc-panel-name">Detective Assistant</div>
              <div class="dc-panel-status">
                <span class="dc-status-dot" :class="isThinking ? 'dc-status-dot--thinking' : 'dc-status-dot--online'"/>
                {{ isThinking ? t('chat.thinking') : t('chat.online') }}
              </div>
            </div>
          </div>
          <button class="dc-panel-close" @click="isOpen = false" :aria-label="t('common.close')">✕</button>
        </div>

        <!-- Messages -->
        <div class="dc-messages" ref="messagesEl" role="log" aria-live="polite" aria-label="Chat messages">
          <!-- Welcome message -->
          <div class="dc-msg dc-msg--bot dc-msg--welcome">
            <div class="dc-msg-bubble">
              {{ t('chat.welcome') }}
            </div>
            <div class="dc-msg-time">{{ t('chat.justNow') }}</div>
          </div>

          <template v-for="(msg, i) in messages" :key="i">
            <!-- Message bubble — inline [[chip]] tokens rendered as quick-reply buttons -->
            <div
              class="dc-msg"
              :class="msg.role === 'user' ? 'dc-msg--user' : 'dc-msg--bot'"
            >
              <div class="dc-msg-bubble">
                <template v-for="(part, pi) in parseMessageParts(msg.content)" :key="pi">
                  <span v-if="part.type === 'text'" v-html="renderMarkdown(part.content)" />
                  <button
                    v-else
                    class="dc-inline-chip"
                    :class="{ 'dc-inline-chip--sent': msg.submittedSelections?.includes(part.content) }"
                    :disabled="!!msg.submittedSelections || isThinking"
                    @click="quickReply(part.content, i)"
                  >{{ part.content }}</button>
                </template>
              </div>
              <div class="dc-msg-time">{{ msg.time }}</div>
            </div>

            <!-- Option card — multi-select (multiple: true) or full list for single-select -->
            <div v-if="msg.role === 'assistant' && msg.options && !resumeGenerated" class="dc-options-card"
                 :class="{ 'dc-options-card--single': !msg.options.multiple }">
              <div class="dc-options-label">{{ msg.options.label }}</div>
              <div class="dc-options-pills">
                <button
                  v-for="item in msg.options.items"
                  :key="item"
                  class="dc-pill"
                  :class="{
                    'dc-pill--selected':  msg.options.multiple && isActiveOptions(i) && pendingSelections.has(item),
                    'dc-pill--submitted': msg.submittedSelections?.includes(item),
                    'dc-pill--frozen':    !!msg.submittedSelections,
                  }"
                  :disabled="!!msg.submittedSelections || isThinking"
                  @click="msg.options!.multiple
                    ? (isActiveOptions(i) && toggleOption(item))
                    : quickReply(item, i)"
                >
                  {{ item }}
                </button>
              </div>
              <!-- Multi-select hint / frozen summary -->
              <div v-if="msg.options.multiple && isActiveOptions(i) && pendingSelections.size > 0"
                   class="dc-options-hint">
                {{ pendingSelections.size }} selected — press Send ↑
              </div>
              <div v-else-if="msg.submittedSelections?.length" class="dc-options-submitted">
                ✓ {{ msg.submittedSelections.join(' · ') }}
              </div>
            </div>

            <!-- Auto-detected quick replies (fallback when AI skips structured options) -->
            <template v-if="msg.role === 'assistant' && !msg.options && !resumeGenerated">
              <div
                v-if="detectOptionsFromText(msg.content)?.length"
                class="dc-options-card dc-options-card--auto"
              >
                <div class="dc-options-label">Quick replies <span class="dc-options-label-hint">— tap to add, send when ready</span></div>
                <div class="dc-options-pills">
                  <button
                    v-for="item in detectOptionsFromText(msg.content)"
                    :key="item"
                    class="dc-pill"
                    :class="{
                      'dc-pill--selected':  autoActiveIdx === i && pendingSelections.has(item),
                      'dc-pill--submitted': msg.submittedSelections?.includes(item),
                      'dc-pill--frozen':    !!msg.submittedSelections,
                    }"
                    :disabled="!!msg.submittedSelections || isThinking"
                    @click="toggleAutoReply(item, i)"
                  >{{ item }}</button>
                </div>
                <div v-if="autoActiveIdx === i && pendingSelections.size > 0 && !msg.submittedSelections"
                     class="dc-options-hint">
                  {{ pendingSelections.size }} selected — press Send ↑
                </div>
                <div v-else-if="msg.submittedSelections?.length" class="dc-options-submitted">
                  ✓ {{ msg.submittedSelections.join(' · ') }}
                </div>
              </div>
            </template>

            <!-- Proposal card -->
            <div v-if="msg.proposedContent" class="dc-proposal-card">
              <div class="dc-proposal-header">
                <span class="dc-proposal-overline">— {{ t('chat.proposalLabel') }} —</span>
              </div>
              <pre class="dc-proposal-preview">{{ truncateProposal(msg.proposedContent) }}</pre>
              <div class="dc-proposal-actions">
                <button
                  class="dc-btn dc-btn--accept"
                  @click="acceptProposal(msg.proposedContent!)"
                  :disabled="accepted"
                >
                  <span v-if="accepted">✓ {{ t('chat.accepted') }}</span>
                  <span v-else>{{ t('chat.acceptUpdate') }}</span>
                </button>
                <button class="dc-btn dc-btn--dismiss" @click="msg.proposedContent = null">
                  {{ t('chat.dismiss') }}
                </button>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="isThinking" class="dc-msg dc-msg--bot">
            <div class="dc-msg-bubble dc-typing">
              <span class="dc-dot"/>
              <span class="dc-dot"/>
              <span class="dc-dot"/>
            </div>
          </div>
        </div>

        <!-- Generate button -->
        <div class="dc-generate-bar">
          <button class="dc-generate-btn" @click="generateResume" :disabled="isThinking">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.4z" clip-rule="evenodd"/>
            </svg>
            Generate Resume
          </button>
        </div>

        <!-- Input -->
        <form class="dc-input-area" @submit.prevent="send" aria-label="Message input">
          <textarea
            ref="inputEl"
            v-model="draft"
            class="dc-input"
            :placeholder="pendingSelections.size > 0 ? `${pendingSelections.size} selected — add a note or send` : t('chat.placeholder')"
            :disabled="isThinking"
            rows="1"
            @keydown.enter.exact.prevent="send"
            @keydown.enter.shift.exact="draft += '\n'"
            @input="autoResize"
            :aria-label="t('chat.placeholder')"
          />
          <button
            type="submit"
            class="dc-send-btn"
            :disabled="(!draft.trim() && pendingSelections.size === 0) || isThinking"
            :aria-label="t('chat.send')"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.903 6.557H13.5a.75.75 0 010 1.5H4.182l-1.903 6.557a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z"/>
            </svg>
          </button>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from '@/composables/useLoading'
import ResumeChatService, { type ChatMessage, type OptionSet } from '@/api/resume-chat-api'

interface ChatEntry {
  role: 'user' | 'assistant'
  content: string
  proposedContent?: string | null
  options?: OptionSet | null
  submittedSelections?: string[]
  time: string
}

const props = defineProps<{
  currentContent: string
  language?: string
}>()

const emit = defineEmits<{
  applyProposal: [content: string]
}>()

const { t } = useI18n()
const { startLoading, stopLoading } = useLoading()
const api = new ResumeChatService()

const isOpen = ref(false)
const isThinking = ref(false)
const isGenerating = ref(false)   // true while the Generate button flow is in-flight
const resumeGenerated = ref(false) // true once a resume has been successfully generated
const draft = ref('')
const accepted = ref(false)
const messages = ref<ChatEntry[]>([])
const messagesEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)

const unreadCount = ref(0)
const hasUnread = computed(() => !isOpen.value && unreadCount.value > 0)

// ── Option selection state ────────────────────────────────────
const pendingSelections = ref(new Set<string>())
// Which auto-detected message's quick replies are currently being multi-selected
const autoActiveIdx = ref(-1)

// Index of the last assistant message with options that hasn't been submitted yet
const activeOptionMsgIdx = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const m = messages.value[i]
    if (m.role === 'assistant' && m.options && !m.submittedSelections) return i
  }
  return -1
})

function isActiveOptions(idx: number) {
  return idx === activeOptionMsgIdx.value
}

function toggleOption(item: string) {
  const s = new Set(pendingSelections.value)
  if (s.has(item)) s.delete(item)
  else s.add(item)
  pendingSelections.value = s
}

/** Toggle an auto-detected quick-reply chip — adds/removes from input draft */
function toggleAutoReply(item: string, msgIdx: number) {
  if (isThinking.value || messages.value[msgIdx]?.submittedSelections) return
  // Switching to a different message's chips — clear previous selections
  if (autoActiveIdx.value !== msgIdx) {
    pendingSelections.value = new Set()
    autoActiveIdx.value = msgIdx
  }
  toggleOption(item)
  // Keep draft in sync with selected chips
  draft.value = Array.from(pendingSelections.value).join(', ')
  nextTick(() => inputEl.value?.focus())
}

// ── Drag ──────────────────────────────────────────────────────
const dragPos = ref({ right: 20, bottom: 56 })
let _dragged = false
let _dragState: { startX: number; startY: number; right: number; bottom: number } | null = null

function startDrag(clientX: number, clientY: number) {
  _dragged = false
  _dragState = { startX: clientX, startY: clientY, right: dragPos.value.right, bottom: dragPos.value.bottom }
}

function onTriggerMousedown(e: MouseEvent) {
  startDrag(e.clientX, e.clientY)
  const onMove = (me: MouseEvent) => {
    if (!_dragState) return
    const dx = me.clientX - _dragState.startX
    const dy = me.clientY - _dragState.startY
    if (Math.abs(dx) + Math.abs(dy) > 5) _dragged = true
    if (_dragged) {
      dragPos.value = {
        right: Math.max(8, Math.min(window.innerWidth - 80, _dragState.right - dx)),
        bottom: Math.max(8, Math.min(window.innerHeight - 60, _dragState.bottom - dy)),
      }
    }
  }
  const onUp = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    _dragState = null
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

function onTriggerTouchstart(e: TouchEvent) {
  const t0 = e.touches[0]
  startDrag(t0.clientX, t0.clientY)
  const onMove = (te: TouchEvent) => {
    if (!_dragState) return
    const t1 = te.touches[0]
    const dx = t1.clientX - _dragState.startX
    const dy = t1.clientY - _dragState.startY
    if (Math.abs(dx) + Math.abs(dy) > 5) _dragged = true
    if (_dragged) {
      dragPos.value = {
        right: Math.max(8, Math.min(window.innerWidth - 80, _dragState.right - dx)),
        bottom: Math.max(8, Math.min(window.innerHeight - 60, _dragState.bottom - dy)),
      }
    }
  }
  const onEnd = () => {
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onEnd)
    _dragState = null
  }
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', onEnd)
}

function toggleChat() {
  if (_dragged) { _dragged = false; return }
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    accepted.value = false
    nextTick(() => inputEl.value?.focus())
  }
}

async function generateResume() {
  isGenerating.value = true
  draft.value = 'Generate my resume now. GENERATE — use placeholders for anything I have not provided yet.'
  await send()
}

function now(): string {
  return new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  })
}

// ── Resume keyword bank ───────────────────────────────────────
const KEYWORD_BANK: Record<string, string[]> = {
  role: [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer',
    'Data Engineer', 'Data Scientist', 'ML Engineer', 'AI Engineer',
    'Product Manager', 'Product Owner', 'Project Manager', 'Program Manager',
    'UX Designer', 'UI Designer', 'Product Designer',
    'Cloud Architect', 'Solution Architect', 'Enterprise Architect',
    'Tech Lead', 'Engineering Manager', 'VP of Engineering', 'CTO',
    'QA Engineer', 'Test Automation Engineer', 'Security Engineer',
    'Mobile Developer', 'iOS Developer', 'Android Developer',
    'Business Analyst', 'Scrum Master', 'Agile Coach',
    'Director of Engineering', 'Staff Engineer', 'Principal Engineer',
  ],
  industry: [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
    'Manufacturing', 'Consulting', 'Retail', 'Media & Entertainment',
    'Government', 'Startups', 'Fintech', 'Biotech', 'Logistics',
    'Real Estate', 'Insurance', 'Telecommunications', 'Energy',
    'Non-profit', 'Gaming', 'Automotive', 'Aerospace', 'Legal',
    'Food & Beverage', 'Travel & Hospitality', 'Cybersecurity',
  ],
  skill: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'Kotlin', 'Swift',
    'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
    'Node.js', 'Express', 'FastAPI', 'Django', 'Spring Boot', 'ASP.NET',
    'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Helm',
    'AWS', 'Azure', 'Google Cloud', 'Serverless',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'GraphQL', 'REST APIs', 'gRPC', 'Kafka', 'RabbitMQ',
    'Git', 'GitHub Actions', 'Jenkins', 'CircleCI', 'CI/CD',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'Agile', 'Scrum', 'Kanban', 'JIRA', 'SQL', 'Linux',
  ],
  softSkill: [
    'Leadership', 'Communication', 'Problem Solving', 'Critical Thinking',
    'Teamwork', 'Collaboration', 'Adaptability', 'Time Management',
    'Creativity', 'Attention to Detail', 'Mentoring', 'Coaching',
    'Presentation Skills', 'Stakeholder Management', 'Conflict Resolution',
    'Decision Making', 'Emotional Intelligence', 'Negotiation',
    'Strategic Thinking', 'Initiative', 'Project Ownership',
  ],
  certification: [
    'AWS Certified Solutions Architect', 'AWS Certified Developer',
    'Google Cloud Professional', 'Azure Solutions Architect',
    'Certified Kubernetes Administrator (CKA)', 'Terraform Associate',
    'PMP (Project Management)', 'Certified Scrum Master (CSM)',
    'CISSP', 'CompTIA Security+', 'CompTIA Cloud+',
    'Oracle Java Certified', 'Microsoft Certified', 'Docker Certified',
    'Salesforce Certified', 'ITIL Foundation', 'Six Sigma',
  ],
  experience: [
    '0-1 years', '1-2 years', '2-3 years', '3-5 years',
    '5-7 years', '7-10 years', '10+ years', '15+ years',
  ],
  education: [
    'High School Diploma', "Associate's Degree", "Bachelor's in Computer Science",
    "Bachelor's in Engineering", "Bachelor's in Business",
    "Master's in Computer Science", "Master's in Data Science",
    "Master's in Business (MBA)", 'PhD in Computer Science',
    'Coding Bootcamp', 'Self-taught / Online Courses',
    'Professional Certifications only',
  ],
  language: [
    'English', 'Spanish', 'French', 'German', 'Mandarin Chinese',
    'Japanese', 'Portuguese', 'Arabic', 'Korean', 'Hindi',
    'Italian', 'Russian', 'Dutch', 'Turkish', 'Polish',
  ],
  tone: [
    'Professional & Formal', 'Results-driven', 'Technical & Precise',
    'Leadership-focused', 'Creative', 'Concise & Direct',
    'Collaborative', 'Innovative', 'Data-driven',
  ],
  highlight: [
    'Led a team', 'Increased revenue', 'Reduced costs', 'Improved performance',
    'Built from scratch', 'Scaled infrastructure', 'Shipped major feature',
    'Mentored junior engineers', 'Won company award', 'Delivered ahead of schedule',
    'Migrated legacy system', 'Improved test coverage', 'Reduced tech debt',
    'Drove customer satisfaction', 'Managed cross-functional project',
  ],
}

/** Detect which resume category the AI message is about */
function detectCategory(text: string): string | null {
  const t = text.toLowerCase()
  if (/\b(role|title|position|job|career|profession)\b/.test(t)) return 'role'
  if (/\b(industry|sector|field|domain|market|vertical)\b/.test(t)) return 'industry'
  if (/\b(tech(nical)? skill|tool|framework|technology|programming|language|library|platform)\b/.test(t)) return 'skill'
  if (/\b(soft skill|interpersonal|quality|trait|strength|ability)\b/.test(t)) return 'softSkill'
  if (/\b(certif(icate|ication)|credential|license|accreditation)\b/.test(t)) return 'certification'
  if (/\b(experience|year|seniority|junior|senior|mid-level)\b/.test(t)) return 'experience'
  if (/\b(education|degree|study|university|college|school|academic)\b/.test(t)) return 'education'
  if (/\b(language|speak|fluent|native|bilingual)\b/.test(t)) return 'language'
  if (/\b(tone|style|approach|voice|format|presentation)\b/.test(t)) return 'tone'
  if (/\b(highlight|achievement|accomplishment|impact|result|success)\b/.test(t)) return 'highlight'
  return null
}

/**
 * Parse AI text for natural-language option lists when the model doesn't
 * return a structured `options` field. Merges parsed items with keyword bank.
 */
function detectOptionsFromText(text: string): string[] | null {
  // Skip if text already carries [[chip]] markers — those are rendered inline
  if (/\[\[/.test(text)) return null

  const STOP = /^(something|else|etc|other|more|anything|another|whatever|any|all|many|some)\b/i

  function split(raw: string): string[] {
    return raw
      .split(/,\s*|\s+or\s+|\s+and\s+/i)
      .map(s => s.replace(/^(?:a|an|the|or)\s+/i, '').replace(/[?.!'"]+$/, '').trim())
      .filter(s => s.length >= 2 && s.length <= 50 && !STOP.test(s))
  }

  const patterns: RegExp[] = [
    /\bsuch as\s+([^.?!\n]{4,100})/i,
    /\blike\s+([A-Z][^.?!\n]{4,100})/m,
    /\bfor example[,:]?\s+([^.?!\n]{4,100})/i,
    /\b(?:options?|choices?)[:\s]+([^.?!\n]{4,100})/i,
    /\b(?:choose|pick|select)[^:]*:\s*([^.?!\n]{4,100})/i,
    /:\s*([A-Z][^.?!\n]{4,100})/,
    /\b([A-Za-z][a-zA-Z-]{1,24}(?:,\s*[A-Za-z][a-zA-Z-]{1,24})+),?\s+or\s+something\b/i,
  ]

  let detected: string[] = []
  for (const re of patterns) {
    const m = text.match(re)
    if (m) {
      const items = split(m[1])
      if (items.length >= 2) { detected = items; break }
    }
  }

  // Augment with keyword bank based on detected category
  const category = detectCategory(text)
  const bankItems: string[] = category ? (KEYWORD_BANK[category] ?? []) : []

  // Merge: detected items first, then bank items (deduplicated, case-insensitive)
  const seen = new Set(detected.map(s => s.toLowerCase()))
  const merged = [...detected]
  for (const item of bankItems) {
    if (!seen.has(item.toLowerCase())) {
      merged.push(item)
      seen.add(item.toLowerCase())
    }
  }

  return merged.length >= 2 ? merged : null
}

/** Split message text on [[chip]] tokens into alternating text/chip segments */
function parseMessageParts(text: string): Array<{ type: 'text' | 'chip'; content: string }> {
  const parts: Array<{ type: 'text' | 'chip'; content: string }> = []
  const regex = /\[\[([^\]]+)\]\]/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', content: text.slice(last, m.index) })
    parts.push({ type: 'chip', content: m[1].trim() })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) })
  return parts
}

/** Single-click quick reply — marks options as submitted and sends immediately */
async function quickReply(item: string, msgIdx: number) {
  if (isThinking.value || messages.value[msgIdx]?.submittedSelections) return
  // Mark option set as submitted
  messages.value.splice(msgIdx, 1, { ...messages.value[msgIdx], submittedSelections: [item] })
  pendingSelections.value = new Set()
  // Push user message
  messages.value.push({ role: 'user', content: item, time: now() })
  scrollToBottom()
  await dispatchToAPI()
}

function renderMarkdown(text: string): string {
  // Minimal inline markdown: bold, italic, code
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>')
}

function truncateProposal(content: string): string {
  const lines = content.split('\n')
  if (lines.length <= 8) return content
  return lines.slice(0, 8).join('\n') + '\n…'
}

/** Shared: call the API with current message history and push the bot reply */
async function dispatchToAPI() {
  isThinking.value = true
  scrollToBottom()
  const generatingNow = isGenerating.value
  if (generatingNow) startLoading('chat-generate', 'Generating your resume…')
  try {
    const history: ChatMessage[] = messages.value
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))
    const result = await api.sendMessage(props.currentContent || '', history, props.language)

    if (generatingNow && result.proposedContent) {
      // Auto-apply the generated resume immediately — no Accept button needed
      resumeGenerated.value = true
      accepted.value = true
      isGenerating.value = false
      emit('applyProposal', result.proposedContent)
      // Push message showing the preview card (already accepted)
      messages.value.push({
        role: 'assistant',
        content: result.reply,
        proposedContent: result.proposedContent,
        options: null,
        time: now(),
      })
    } else {
      if (generatingNow) isGenerating.value = false
      messages.value.push({
        role: 'assistant',
        content: result.reply,
        proposedContent: result.proposedContent ?? null,
        options: result.options ?? null,
        time: now(),
      })
    }
    if (!isOpen.value) unreadCount.value++
  } catch {
    if (generatingNow) isGenerating.value = false
    messages.value.push({ role: 'assistant', content: t('chat.error'), time: now() })
  } finally {
    if (generatingNow) stopLoading('chat-generate')
    isThinking.value = false
    scrollToBottom()
  }
}

async function send() {
  const text = draft.value.trim()
  const selections = Array.from(pendingSelections.value)
  if ((!text && selections.length === 0) || isThinking.value) return

  // Build message content — combine selections + typed text
  const messageContent = selections.length > 0 && text
    ? `${selections.join(', ')} — ${text}`
    : selections.length > 0
      ? selections.join(', ')
      : text

  draft.value = ''
  if (inputEl.value) inputEl.value.style.height = 'auto'

  // Mark the active option set (structured or auto-detected) as submitted
  const activeIdx = activeOptionMsgIdx.value >= 0 ? activeOptionMsgIdx.value : autoActiveIdx.value
  if (activeIdx >= 0 && selections.length > 0) {
    messages.value.splice(activeIdx, 1, {
      ...messages.value[activeIdx],
      submittedSelections: selections,
    })
  }
  pendingSelections.value = new Set()
  autoActiveIdx.value = -1

  messages.value.push({ role: 'user', content: messageContent, time: now() })
  scrollToBottom()
  await dispatchToAPI()
}

function acceptProposal(content: string) {
  emit('applyProposal', content)
  accepted.value = true
  messages.value.push({
    role: 'assistant',
    content: t('chat.appliedMessage'),
    time: now(),
  })
  scrollToBottom()
}

// Reset accepted state when user makes changes
watch(() => props.currentContent, () => {
  accepted.value = false
})
</script>

<style scoped>
/* ── Trigger button ───────────────────────────────────────── */
.dc-trigger {
  position: fixed;
  /* bottom / right overridden by :style binding for drag */
  bottom: 56px;
  right: 20px;
  z-index: 1500;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  color: #444;
  cursor: grab;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  padding: 8px 14px 8px 10px;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  white-space: nowrap;
  user-select: none;
}

.dc-trigger:hover {
  border-color: #c8a951;
  box-shadow: 0 4px 20px rgba(200,169,81,0.18);
  transform: translateY(-1px);
}

.dc-trigger:active {
  cursor: grabbing;
}

.dc-trigger--open {
  border-color: #d0d0d0;
  color: #999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.dc-trigger-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.dc-avatar-svg {
  width: 32px;
  height: 32px;
}

/* Hat bob */
.dc-hat {
  animation: hat-bob 3s ease-in-out infinite;
  transform-origin: 24px 12px;
}
@keyframes hat-bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-1.5px); }
}

/* Head sway */
.dc-head {
  animation: head-sway 3s ease-in-out infinite;
  transform-origin: 24px 27px;
}
@keyframes head-sway {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(-2deg); }
  75%       { transform: rotate(2deg); }
}

/* Magnifying glass orbit */
.dc-glass {
  animation: glass-orbit 2.5s ease-in-out infinite;
  transform-origin: 28px 32px;
}
@keyframes glass-orbit {
  0%, 100% { transform: rotate(0deg) translate(0, 0); }
  50%       { transform: rotate(-12deg) translate(-1px, 1px); }
}

/* Eye blink */
.dc-eye-l, .dc-eye-r, .dc-blink {
  animation: blink 4s step-end infinite;
  transform-box: fill-box;
  transform-origin: center;
}
@keyframes blink {
  0%, 96%, 100% { transform: scaleY(1); }
  97%, 99%      { transform: scaleY(0.1); }
}

/* ── Panel ────────────────────────────────────────────────── */
.dc-panel {
  position: fixed;
  /* bottom / right overridden by :style binding for drag */
  bottom: 56px;
  right: 20px;
  width: 360px;
  height: 520px;
  z-index: 1600;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,0.14);
  font-family: 'IBM Plex Mono', monospace;
  overflow: hidden;
}

@media (max-width: 480px) {
  .dc-panel {
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw;
    height: 100dvh;
    border-radius: 0;
    border: none;
  }

  .dc-trigger {
    bottom: 16px !important;
    right: 16px !important;
  }
}

/* Header */
.dc-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #ebebeb;
  flex-shrink: 0;
  background: #f7f7f7;
}

.dc-panel-identity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dc-panel-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  padding: 2px;
  border: 1px solid #e0e0e0;
}

.dc-panel-name {
  font-size: 12px;
  color: #1a1a1a;
  letter-spacing: 0.06em;
  font-weight: 600;
}

.dc-panel-status {
  font-size: 10px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.dc-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.dc-status-dot--online { background: #4caf50; }
.dc-status-dot--thinking {
  background: #c8a951;
  animation: pulse-dot 1s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.dc-panel-close {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 4px;
  transition: color 0.15s;
}
.dc-panel-close:hover { color: #444; }

/* Messages */
.dc-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
  background: #fafafa;
}

.dc-messages::-webkit-scrollbar { width: 4px; }
.dc-messages::-webkit-scrollbar-track { background: transparent; }
.dc-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

.dc-msg {
  display: flex;
  flex-direction: column;
  max-width: 82%;
}

.dc-msg--user { align-self: flex-end; align-items: flex-end; }
.dc-msg--bot  { align-self: flex-start; align-items: flex-start; }

.dc-msg--welcome {
  align-self: center;
  max-width: 100%;
  text-align: center;
}

.dc-msg-bubble {
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 12px;
  line-height: 1.6;
  word-break: break-word;
}

.dc-msg-bubble :deep(code) {
  background: rgba(0,0,0,0.06);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 11px;
}

.dc-msg--user .dc-msg-bubble {
  background: #e8f3eb;
  color: #1a3a22;
  border-bottom-right-radius: 4px;
}

.dc-msg--bot .dc-msg-bubble {
  background: #fff;
  color: #333;
  border-bottom-left-radius: 4px;
  border: 1px solid #e8e8e8;
}

.dc-msg--welcome .dc-msg-bubble {
  background: transparent;
  border: 1px dashed #d8d8d8;
  color: #999;
  font-size: 11px;
  letter-spacing: 0.05em;
  border-radius: 8px;
}

.dc-msg-time {
  font-size: 9px;
  color: #bbb;
  margin-top: 3px;
  letter-spacing: 0.05em;
}

/* Typing dots */
.dc-typing {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 10px 16px;
  min-width: 52px;
}

.dc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ccc;
  animation: typing-bounce 1.2s ease-in-out infinite;
}
.dc-dot:nth-child(2) { animation-delay: 0.15s; }
.dc-dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40%           { transform: translateY(-5px); opacity: 1; }
}

/* ── Inline chips (inside message bubble) ─────────────────── */
.dc-inline-chip {
  display: inline-flex;
  align-items: center;
  margin: 1px 3px;
  padding: 2px 9px;
  border-radius: 12px;
  border: 1.5px solid #c8a951;
  background: #fffdf5;
  color: #a08030;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  vertical-align: middle;
  transition: all 0.15s;
  line-height: 1.4;
}

.dc-inline-chip:hover:not(:disabled) {
  background: #c8a951;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(200,169,81,0.3);
}

.dc-inline-chip--sent {
  background: #c8a951;
  color: #fff;
  cursor: default;
}

.dc-inline-chip:disabled:not(.dc-inline-chip--sent) {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Option pills ─────────────────────────────────────────── */
.dc-options-card {
  align-self: flex-start;
  width: calc(100% - 0px);
  max-width: 100%;
  background: #fff;
  border: 1.5px solid #e8e4d8;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dc-options-card--auto {
  border-color: #e8e4d8;
  background: #fdfcf8;
}

.dc-options-card--single .dc-pill {
  /* Single-select: gold border, click-to-send immediately */
  border-color: #c8a951;
  color: #a08030;
}

.dc-options-card--single .dc-pill:hover:not(:disabled):not(.dc-pill--frozen) {
  background: #c8a951;
  color: #fff;
}

.dc-options-label {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #a08030;
  font-weight: 600;
}

.dc-options-label-hint {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
  color: #aaa;
  font-size: 9px;
}

.dc-options-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dc-pill {
  padding: 4px 10px;
  border-radius: 20px;
  border: 1.5px solid #d8d8d8;
  background: #fff;
  color: #555;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
  line-height: 1.4;
}

.dc-pill:hover:not(:disabled):not(.dc-pill--frozen) {
  border-color: #c8a951;
  color: #a08030;
  background: #fdf8ee;
}

.dc-pill--selected {
  border-color: #c8a951;
  background: #c8a951;
  color: #fff;
  font-weight: 600;
}

.dc-pill--submitted {
  border-color: #c8a951;
  background: #fdf8ee;
  color: #a08030;
}

.dc-pill--frozen {
  cursor: default;
  opacity: 0.75;
}

.dc-pill--frozen:not(.dc-pill--submitted) {
  opacity: 0.45;
}

.dc-options-hint {
  font-size: 9px;
  color: #c8a951;
  letter-spacing: 0.06em;
  font-style: italic;
}

.dc-options-submitted {
  font-size: 9px;
  color: #4a8a5a;
  letter-spacing: 0.06em;
}

/* ── Generate bar ─────────────────────────────────────────── */
.dc-generate-bar {
  padding: 8px 12px;
  border-top: 1px solid #ebebeb;
  flex-shrink: 0;
}

.dc-generate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 16px;
  background: linear-gradient(135deg, #c8a951, #b8993f);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(200,169,81,0.3);
}

.dc-generate-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(200,169,81,0.4);
}

.dc-generate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* Proposal card */
.dc-proposal-card {
  background: #fffdf5;
  border: 1.5px solid #c8a951;
  border-radius: 10px;
  overflow: hidden;
  align-self: flex-start;
  max-width: 94%;
  width: 100%;
}

.dc-proposal-header {
  padding: 8px 12px;
  background: rgba(200, 169, 81, 0.08);
  border-bottom: 1px solid #ede8d8;
}

.dc-proposal-overline {
  font-size: 9px;
  letter-spacing: 0.15em;
  color: #a08030;
  text-transform: uppercase;
}

.dc-proposal-preview {
  margin: 0;
  padding: 10px 12px;
  font-size: 10px;
  color: #777;
  line-height: 1.5;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'IBM Plex Mono', monospace;
  max-height: 120px;
  overflow-y: auto;
  border-bottom: 1px solid #ede8d8;
}

.dc-proposal-actions {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
}

.dc-btn {
  flex: 1;
  padding: 7px 12px;
  border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.dc-btn--accept {
  background: #c8a951;
  color: #fff;
  border-color: #c8a951;
  font-weight: 600;
}
.dc-btn--accept:hover:not(:disabled) {
  background: #b8993f;
}
.dc-btn--accept:disabled {
  opacity: 0.5;
  cursor: default;
}

.dc-btn--dismiss {
  background: transparent;
  color: #999;
  border-color: #e0e0e0;
}
.dc-btn--dismiss:hover {
  color: #444;
  border-color: #bbb;
}

/* Input area */
.dc-input-area {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #ebebeb;
  background: #f7f7f7;
  flex-shrink: 0;
}

.dc-input {
  flex: 1;
  background: #fff;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  color: #333;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  padding: 8px 12px;
  resize: none;
  min-height: 36px;
  max-height: 120px;
  outline: none;
  transition: border-color 0.15s;
}

.dc-input::placeholder { color: #bbb; }
.dc-input:focus { border-color: #c8a951; }
.dc-input:disabled { opacity: 0.4; }

.dc-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #c8a951;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.1s;
}
.dc-send-btn:hover:not(:disabled) {
  background: #b8993f;
  transform: translateY(-1px);
}
.dc-send-btn:disabled {
  opacity: 0.35;
  cursor: default;
  transform: none;
}

/* Transition */
.chat-pop-enter-active {
  transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.chat-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.chat-pop-enter-from,
.chat-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>
