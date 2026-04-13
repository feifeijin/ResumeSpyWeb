<template>
  <Teleport to="body">
    <div class="vd-overlay" @click.self="$emit('close')">
      <div class="vd-dialog">
        <!-- Header -->
        <div class="vd-header">
          <span class="vd-overline">— {{ t('version.diffTitle') }} —</span>
          <button class="vd-close" @click="$emit('close')">✕</button>
        </div>

        <!-- Meta row -->
        <div class="vd-meta">
          <div class="vd-meta-col vd-meta-del">
            <span class="vd-meta-label">{{ t('version.older') }}</span>
            <span class="vd-meta-date">{{ formatDate(older.createdAt) }}</span>
          </div>
          <div class="vd-meta-col vd-meta-add">
            <span class="vd-meta-label">{{ t('version.newer') }}</span>
            <span class="vd-meta-date">{{ formatDate(newer.createdAt) }}</span>
          </div>
        </div>

        <!-- Diff view -->
        <div class="vd-body" ref="bodyEl">
          <div v-if="!diffLines.length" class="vd-identical">
            {{ t('version.identical') }}
          </div>
          <div v-else class="vd-diff">
            <div
              v-for="(line, i) in diffLines"
              :key="i"
              class="vd-line"
              :class="{
                'vd-line--add': line.type === 'add',
                'vd-line--del': line.type === 'del',
                'vd-line--ctx': line.type === 'ctx',
              }"
            >
              <span class="vd-gutter">{{ line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' ' }}</span>
              <span class="vd-text">{{ line.text }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="vd-footer">
          <button class="vd-btn stamp" @click="$emit('restore', newer.content)">
            {{ t('version.restoreNewer') }}
          </button>
          <button class="vd-btn" @click="$emit('close')">{{ t('common.cancel') }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as Diff from 'diff'
import type { ResumeVersion } from '@/api/resume-version-api'

const props = defineProps<{
  pair: [ResumeVersion, ResumeVersion]
}>()

defineEmits<{
  close: []
  restore: [content: string]
}>()

const { t } = useI18n()
const bodyEl = ref<HTMLElement | null>(null)

// Ensure pair[0] is older (earlier createdAt)
const [older, newer] = computed(() => {
  const [a, b] = props.pair
  return new Date(a.createdAt) <= new Date(b.createdAt) ? [a, b] : [b, a]
}).value

interface DiffLine {
  type: 'add' | 'del' | 'ctx'
  text: string
}

const CONTEXT = 3

const diffLines = computed<DiffLine[]>(() => {
  const changes = Diff.diffLines(older.content, newer.content)
  const result: DiffLine[] = []

  // Expand into individual lines with context trimming
  changes.forEach((part) => {
    const lines = part.value.split('\n')
    // Remove trailing empty string from split
    if (lines[lines.length - 1] === '') lines.pop()

    const type: DiffLine['type'] = part.added ? 'add' : part.removed ? 'del' : 'ctx'
    lines.forEach((text) => result.push({ type, text }))
  })

  // Collapse unchanged runs longer than CONTEXT * 2 + 1
  const out: DiffLine[] = []
  let ctxRun: DiffLine[] = []
  let i = 0

  while (i < result.length) {
    const line = result[i]
    if (line.type === 'ctx') {
      ctxRun.push(line)
      i++
    } else {
      // Flush ctxRun: keep tail of previous run + head of next run
      if (ctxRun.length > CONTEXT * 2) {
        if (out.length) {
          out.push(...ctxRun.slice(0, CONTEXT))
          out.push({ type: 'ctx', text: `  ··· ${ctxRun.length - CONTEXT * 2} unchanged lines ···` })
          out.push(...ctxRun.slice(-CONTEXT))
        } else {
          out.push({ type: 'ctx', text: `  ··· ${ctxRun.length - CONTEXT} unchanged lines ···` })
          out.push(...ctxRun.slice(-CONTEXT))
        }
      } else {
        out.push(...ctxRun)
      }
      ctxRun = []
      out.push(line)
      i++
    }
  }

  // Flush trailing context
  if (ctxRun.length > CONTEXT) {
    out.push(...ctxRun.slice(0, CONTEXT))
    out.push({ type: 'ctx', text: `  ··· ${ctxRun.length - CONTEXT} unchanged lines ···` })
  } else {
    out.push(...ctxRun)
  }

  return out
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.vd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.vd-dialog {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  width: min(860px, 100%);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  font-family: 'IBM Plex Mono', monospace;
}

.vd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #2a2a2a;
  flex-shrink: 0;
}

.vd-overline {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: #888;
  text-transform: uppercase;
}

.vd-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  transition: color 0.15s;
}
.vd-close:hover { color: #ccc; }

.vd-meta {
  display: flex;
  border-bottom: 1px solid #1e1e1e;
  flex-shrink: 0;
}

.vd-meta-col {
  flex: 1;
  padding: 8px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vd-meta-del { border-right: 1px solid #1e1e1e; background: rgba(200, 60, 60, 0.05); }
.vd-meta-add { background: rgba(60, 160, 80, 0.05); }

.vd-meta-label {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #555;
}

.vd-meta-date {
  font-size: 11px;
  color: #999;
}

.vd-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.vd-identical {
  padding: 40px;
  text-align: center;
  color: #444;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.vd-diff {
  font-size: 12px;
  line-height: 1.6;
}

.vd-line {
  display: flex;
  align-items: baseline;
  padding: 0 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.vd-line--add { background: rgba(50, 150, 70, 0.15); }
.vd-line--del { background: rgba(180, 50, 50, 0.15); }
.vd-line--ctx { color: #555; }

.vd-gutter {
  width: 18px;
  flex-shrink: 0;
  color: #555;
  user-select: none;
  font-size: 11px;
}

.vd-line--add .vd-gutter { color: #4caf50; }
.vd-line--del .vd-gutter { color: #e57373; }

.vd-text {
  color: #ccc;
  flex: 1;
}

.vd-line--add .vd-text { color: #a5d6a7; }
.vd-line--del .vd-text { color: #ef9a9a; }
.vd-line--ctx .vd-text { color: #444; font-style: italic; }

.vd-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 14px 20px;
  border-top: 1px solid #2a2a2a;
  flex-shrink: 0;
}

.vd-btn {
  background: none;
  border: 1px solid #2a2a2a;
  color: #888;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  padding: 7px 16px;
  transition: all 0.15s;
}

.vd-btn:hover { color: #ccc; border-color: #555; }

.vd-btn.stamp {
  border-color: #c8a951;
  color: #c8a951;
}
.vd-btn.stamp:hover {
  background: #c8a951;
  color: #0a0a0a;
}
</style>
