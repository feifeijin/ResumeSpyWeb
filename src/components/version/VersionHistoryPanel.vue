<template>
  <Teleport to="body">
    <Transition name="panel-slide">
      <div v-if="open" class="vh-overlay" @click.self="$emit('close')">
        <aside class="vh-panel">
          <!-- Header -->
          <div class="vh-header">
            <span class="vh-overline">— {{ t('version.historyLabel') }} —</span>
            <button class="vh-close" @click="$emit('close')">✕</button>
          </div>

          <!-- Controls -->
          <div class="vh-controls">
            <span class="vh-hint" v-if="selected.size === 2">
              {{ t('version.diffReady') }}
            </span>
            <span class="vh-hint" v-else-if="selected.size > 0">
              {{ t('version.selectTwo') }}
            </span>
            <button
              v-if="selected.size === 2"
              class="vh-btn stamp"
              @click="openDiff"
            >{{ t('version.compare') }}</button>
          </div>

          <!-- Empty state -->
          <div v-if="!versions.length" class="vh-empty">
            <span>{{ t('version.empty') }}</span>
          </div>

          <!-- Version list -->
          <ul v-else class="vh-list">
            <li
              v-for="v in versions"
              :key="v.id"
              class="vh-item"
              :class="{ 'vh-item--selected': selected.has(v.id) }"
            >
              <label class="vh-item-check">
                <input
                  type="checkbox"
                  :checked="selected.has(v.id)"
                  :disabled="selected.size >= 2 && !selected.has(v.id)"
                  @change="toggleSelect(v.id)"
                />
              </label>

              <div class="vh-item-body" @click="toggleSelect(v.id)">
                <span class="vh-item-label">{{ v.label ?? formatDate(v.createdAt) }}</span>
                <span class="vh-item-preview">{{ v.preview }}</span>
                <span class="vh-item-date" v-if="v.label">{{ formatDate(v.createdAt) }}</span>
              </div>

              <div class="vh-item-actions">
                <button class="vh-btn-sm" @click="onRestore(v.id)" :title="t('version.restore')">↩</button>
                <button class="vh-btn-sm vh-btn-del" @click="onDelete(v.id)" :title="t('version.delete')">✕</button>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </Transition>
  </Teleport>

  <!-- Diff dialog -->
  <VersionDiffDialog
    v-if="diffPair"
    :pair="diffPair"
    @close="diffPair = null"
    @restore="(content) => { $emit('restore', content); diffPair = null }"
  />

  <!-- Restore confirm -->
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="restoreConfirm" class="vh-overlay vh-overlay--modal" @click.self="restoreConfirm = null">
        <div class="vh-modal">
          <p class="vh-modal-text">{{ t('version.restoreConfirm') }}</p>
          <div class="vh-modal-actions">
            <button class="vh-btn stamp" @click="confirmRestore">{{ t('common.confirm') }}</button>
            <button class="vh-btn" @click="restoreConfirm = null">{{ t('common.cancel') }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ResumeVersion } from '@/api/resume-version-api'
import VersionDiffDialog from './VersionDiffDialog.vue'

const props = defineProps<{
  open: boolean
  versions: ResumeVersion[]
}>()

const emit = defineEmits<{
  close: []
  restore: [content: string]
  delete: [id: string]
}>()

const { t } = useI18n()

const selected = ref<Set<string>>(new Set())
const diffPair = ref<[ResumeVersion, ResumeVersion] | null>(null)
const restoreConfirm = ref<string | null>(null) // stores versionId

watch(
  () => props.open,
  (val) => {
    if (!val) selected.value = new Set()
  },
)

function toggleSelect(id: string) {
  const s = new Set(selected.value)
  if (s.has(id)) {
    s.delete(id)
  } else if (s.size < 2) {
    s.add(id)
  }
  selected.value = s
}

function openDiff() {
  const ids = Array.from(selected.value)
  const a = props.versions.find((v) => v.id === ids[0])
  const b = props.versions.find((v) => v.id === ids[1])
  if (a && b) diffPair.value = [a, b]
}

function onRestore(id: string) {
  restoreConfirm.value = id
}

async function confirmRestore() {
  const id = restoreConfirm.value
  restoreConfirm.value = null
  if (!id) return
  const version = props.versions.find((v) => v.id === id)
  if (version) emit('restore', version.content)
}

function onDelete(id: string) {
  emit('delete', id)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.vh-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.vh-overlay--modal {
  justify-content: center;
  align-items: center;
}

.vh-panel {
  width: 360px;
  height: 100%;
  background: #fafafa;
  border-left: 1.5px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  font-family: 'IBM Plex Mono', monospace;
  overflow: hidden;
  box-shadow: -4px 0 24px rgba(0,0,0,0.08);
}

.vh-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #f5f5f5;
}

.vh-overline {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: #888;
  text-transform: uppercase;
  font-weight: 600;
}

.vh-close {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  transition: color 0.15s;
}

.vh-close:hover {
  color: #444;
}

.vh-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  min-height: 44px;
  border-bottom: 1px solid #ebebeb;
  background: #fff;
}

.vh-hint {
  font-size: 10px;
  color: #999;
  letter-spacing: 0.05em;
}

.vh-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.vh-list {
  list-style: none;
  margin: 0;
  padding: 6px 0;
  overflow-y: auto;
  flex: 1;
  background: #fff;
}

.vh-list::-webkit-scrollbar { width: 4px; }
.vh-list::-webkit-scrollbar-track { background: transparent; }
.vh-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

.vh-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: default;
  transition: background 0.1s;
}

.vh-item:hover {
  background: #f8f8f8;
}

.vh-item--selected {
  background: #fdf8ed;
  border-left: 2.5px solid #c8a951;
  padding-left: 17px;
}

.vh-item-check {
  padding-top: 2px;
  cursor: pointer;
}

.vh-item-check input[type='checkbox'] {
  accent-color: #c8a951;
  cursor: pointer;
}

.vh-item-body {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.vh-item-label {
  font-size: 11px;
  color: #222;
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.vh-item-preview {
  font-size: 10px;
  color: #888;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.vh-item-date {
  font-size: 9px;
  color: #bbb;
  letter-spacing: 0.05em;
}

.vh-item-actions {
  display: flex;
  gap: 4px;
  padding-top: 2px;
}

.vh-btn-sm {
  background: none;
  border: 1px solid #e0e0e0;
  color: #aaa;
  cursor: pointer;
  font-size: 11px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.vh-btn-sm:hover {
  color: #333;
  border-color: #bbb;
  background: #f0f0f0;
}

.vh-btn-del:hover {
  color: #c05050;
  border-color: #d08080;
  background: #fff0f0;
}

.vh-btn {
  background: none;
  border: 1px solid #d8d8d8;
  color: #777;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  padding: 5px 12px;
  border-radius: 4px;
  transition: all 0.15s;
}

.vh-btn:hover {
  color: #333;
  border-color: #aaa;
  background: #f5f5f5;
}

.vh-btn.stamp {
  border-color: #c8a951;
  color: #a08030;
}

.vh-btn.stamp:hover {
  background: #c8a951;
  color: #fff;
  border-color: #c8a951;
}

/* Restore confirm modal */
.vh-modal {
  background: #f8f8f8;
  border: 1.5px solid #e0e0e0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  padding: 28px 32px;
  min-width: 300px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'IBM Plex Mono', monospace;
}

.vh-modal-text {
  font-size: 12px;
  color: #333;
  letter-spacing: 0.06em;
  line-height: 1.6;
  margin: 0;
}

.vh-modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Transitions */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.25s ease;
}

.panel-slide-enter-active .vh-panel,
.panel-slide-leave-active .vh-panel {
  transition: transform 0.25s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}

.panel-slide-enter-from .vh-panel,
.panel-slide-leave-to .vh-panel {
  transform: translateX(100%);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
