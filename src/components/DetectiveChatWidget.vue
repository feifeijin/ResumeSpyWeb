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
            <!-- Regular message -->
            <div
              class="dc-msg"
              :class="msg.role === 'user' ? 'dc-msg--user' : 'dc-msg--bot'"
            >
              <div class="dc-msg-bubble" v-html="renderMarkdown(msg.content)" />
              <div class="dc-msg-time">{{ msg.time }}</div>
            </div>

            <!-- Proposal card (attached to the assistant message that has a proposal) -->
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

        <!-- Input -->
        <form class="dc-input-area" @submit.prevent="send" aria-label="Message input">
          <textarea
            ref="inputEl"
            v-model="draft"
            class="dc-input"
            :placeholder="t('chat.placeholder')"
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
            :disabled="!draft.trim() || isThinking"
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
import ResumeChatService, { type ChatMessage } from '@/api/resume-chat-api'

interface ChatEntry {
  role: 'user' | 'assistant'
  content: string
  proposedContent?: string | null
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
const api = new ResumeChatService()

const isOpen = ref(false)
const isThinking = ref(false)
const draft = ref('')
const accepted = ref(false)
const messages = ref<ChatEntry[]>([])
const messagesEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)

const unreadCount = ref(0)
const hasUnread = computed(() => !isOpen.value && unreadCount.value > 0)

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

async function send() {
  const text = draft.value.trim()
  if (!text || isThinking.value) return

  draft.value = ''
  if (inputEl.value) {
    inputEl.value.style.height = 'auto'
  }

  messages.value.push({ role: 'user', content: text, time: now() })
  scrollToBottom()

  isThinking.value = true
  scrollToBottom()

  try {
    const history: ChatMessage[] = messages.value
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))

    const result = await api.sendMessage(
      props.currentContent || '',
      history,
      props.language,
    )

    messages.value.push({
      role: 'assistant',
      content: result.reply,
      proposedContent: result.proposedContent ?? null,
      time: now(),
    })

    if (!isOpen.value) unreadCount.value++
  } catch {
    messages.value.push({
      role: 'assistant',
      content: t('chat.error'),
      time: now(),
    })
  } finally {
    isThinking.value = false
    scrollToBottom()
  }
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
