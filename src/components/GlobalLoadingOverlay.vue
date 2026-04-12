<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="loadingStore.isGlobalLoading" class="noir-overlay" role="status" aria-live="polite">
        <!-- Film grain -->
        <div class="grain" aria-hidden="true" />

        <div class="detective-stage">
          <!-- Detective SVG -->
          <svg
            class="detective-svg"
            viewBox="0 0 220 260"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <!-- ── Hat ───────────────────────────── -->
            <rect x="68" y="16" width="54" height="44" rx="6" fill="#111"/>
            <rect x="54" y="57" width="82" height="10" rx="5" fill="#1a1a1a"/>
            <rect x="68" y="51" width="54" height="9" fill="#0c0c0c"/>

            <!-- ── Head ──────────────────────────── -->
            <ellipse cx="95" cy="86" rx="27" ry="29" fill="#2c2c2c"/>
            <!-- jaw shadow -->
            <ellipse cx="95" cy="98" rx="20" ry="14" fill="#222"/>
            <!-- eyes -->
            <ellipse cx="84" cy="82" rx="5" ry="3.5" fill="#0e0e0e"/>
            <ellipse cx="107" cy="82" rx="5" ry="3.5" fill="#0e0e0e"/>
            <!-- pupils -->
            <circle cx="85" cy="82" r="2.5" fill="#080808"/>
            <circle cx="108" cy="82" r="2.5" fill="#080808"/>
            <!-- eye glints -->
            <circle cx="86" cy="81" r="0.8" fill="#ccc" opacity="0.6"/>
            <circle cx="109" cy="81" r="0.8" fill="#ccc" opacity="0.6"/>
            <!-- determined mouth -->
            <path d="M83 100 Q95 104 107 100" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round"/>

            <!-- ── Neck / collar ─────────────────── -->
            <rect x="87" y="113" width="16" height="14" rx="2" fill="#2a2a2a"/>

            <!-- ── Coat body ─────────────────────── -->
            <path d="M55 128 L40 260 L150 260 L135 128 Z" fill="#1a1a1a"/>

            <!-- ── Lapels ────────────────────────── -->
            <path d="M95 148 L65 128 L74 178 Z" fill="#111"/>
            <path d="M95 148 L125 128 L116 178 Z" fill="#111"/>

            <!-- ── Collar ─────────────────────────── -->
            <path d="M65 128 L80 115 L95 148 Z" fill="#1c1c1c"/>
            <path d="M125 128 L110 115 L95 148 Z" fill="#1c1c1c"/>

            <!-- ── Tie ────────────────────────────── -->
            <path d="M92 126 L95 155 L98 126" fill="#0e0e0e"/>

            <!-- ── Belt ──────────────────────────── -->
            <rect x="66" y="182" width="58" height="6" rx="3" fill="#111"/>
            <!-- belt buckle -->
            <rect x="91" y="181" width="8" height="8" rx="1" fill="#333"/>

            <!-- ── Left arm + cigarette ──────────── -->
            <path d="M55 128 L38 190 L50 193 L67 135 Z" fill="#141414"/>
            <ellipse cx="42" cy="194" rx="7" ry="5" fill="#2a2a2a"/>
            <!-- cigarette -->
            <rect x="33" y="192" width="16" height="3" rx="1.5" fill="#d4c9a8"/>
            <!-- ash tip -->
            <ellipse cx="34" cy="193.5" rx="2.5" ry="2" class="cig-tip"/>
            <!-- smoke -->
            <g class="smoke-group">
              <circle cx="33" cy="187" r="2.2" class="smoke s1"/>
              <circle cx="31" cy="180" r="1.8" class="smoke s2"/>
              <circle cx="34" cy="173" r="1.2" class="smoke s3"/>
              <circle cx="31" cy="166" r="0.8" class="smoke s4"/>
            </g>

            <!-- ── Right arm + magnifying glass ─── -->
            <!-- arm (animated as a group) -->
            <g class="mag-arm">
              <path d="M135 128 L152 88 L143 85 L126 132 Z" fill="#141414"/>
              <!-- hand -->
              <ellipse cx="149" cy="82" rx="8" ry="6" fill="#2a2a2a"/>
              <!-- glass handle -->
              <line x1="156" y1="74" x2="170" y2="55" stroke="#888" stroke-width="5" stroke-linecap="round"/>
              <!-- glass ring (outer) -->
              <circle cx="157" cy="60" r="24" stroke="#aaa" stroke-width="4.5" fill="none"/>
              <!-- glass ring (inner bevel) -->
              <circle cx="157" cy="60" r="21" stroke="#666" stroke-width="1" fill="none" opacity="0.5"/>
              <!-- lens fill -->
              <circle cx="157" cy="60" r="21" fill="rgba(160,185,195,0.07)"/>
              <!-- radar sweep line (animated) -->
              <g class="radar-sweep">
                <line x1="157" y1="60" x2="178" y2="60" stroke="rgba(200,230,255,0.45)" stroke-width="1.5" stroke-linecap="round"/>
              </g>
              <!-- lens shine -->
              <ellipse cx="149" cy="52" rx="6" ry="3.5" fill="rgba(255,255,255,0.11)" transform="rotate(-35 149 52)"/>
              <!-- secondary shine -->
              <ellipse cx="165" cy="68" rx="3" ry="2" fill="rgba(255,255,255,0.05)" transform="rotate(-35 165 68)"/>
            </g>
          </svg>

          <!-- Loading message -->
          <div class="detective-msg">
            <span class="msg-glyph">✦</span>
            <span class="msg-text">{{ currentMessage || t('loading.processing') }}</span>
            <span class="msg-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>

          <!-- Subline -->
          <p class="detective-sub">{{ t('common.pleaseWait') }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoadingStore } from '@/stores/loading'

const { t } = useI18n()
const loadingStore = useLoadingStore()

const currentMessage = computed(() => loadingStore.currentLoadingState?.message)

defineOptions({ name: 'GlobalLoadingOverlay' })
</script>

<style scoped>
/* ── Overlay ───────────────────────────────────────────────── */
.noir-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(8, 8, 8, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
}

.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.1'/%3E%3C/svg%3E");
  opacity: 0.5;
  mix-blend-mode: overlay;
}

/* ── Detective stage ───────────────────────────────────────── */
.detective-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  animation: stage-flicker 8s ease-in-out infinite;
}

.detective-svg {
  width: 200px;
  height: auto;
  filter: drop-shadow(0 0 18px rgba(180, 200, 220, 0.12));
}

/* ── Magnifying glass arm swing ────────────────────────────── */
.mag-arm {
  transform-origin: 135px 128px;
  animation: arm-swing 2.8s ease-in-out infinite alternate;
}

@keyframes arm-swing {
  from { transform: rotate(-9deg); }
  to   { transform: rotate(9deg); }
}

/* ── Radar sweep inside glass ──────────────────────────────── */
.radar-sweep {
  transform-origin: 157px 60px;
  animation: radar 2s linear infinite;
}

@keyframes radar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── Cigarette glow ────────────────────────────────────────── */
.cig-tip {
  fill: #bb3300;
  animation: ember 2.5s ease-in-out infinite alternate;
}

@keyframes ember {
  from { fill: #cc4400; opacity: 1; }
  to   { fill: #ff6600; opacity: 0.6; }
}

/* ── Smoke particles ───────────────────────────────────────── */
.smoke {
  fill: #999;
  animation: drift 3.5s ease-out infinite;
}
.s1 { animation-delay: 0s;    opacity: 0.55; }
.s2 { animation-delay: 0.7s;  opacity: 0.4;  }
.s3 { animation-delay: 1.4s;  opacity: 0.25; }
.s4 { animation-delay: 2.1s;  opacity: 0.15; }

@keyframes drift {
  0%   { transform: translate(0,   0)    scale(1);   opacity: inherit; }
  60%  { transform: translate(-4px,-25px) scale(1.6); }
  100% { transform: translate(-2px,-45px) scale(2.2); opacity: 0; }
}

/* ── Whole stage subtle flicker ───────────────────────────── */
@keyframes stage-flicker {
  0%,100% { opacity: 1; }
  48%      { opacity: 1; }
  49%      { opacity: 0.92; }
  50%      { opacity: 1; }
  92%      { opacity: 1; }
  93%      { opacity: 0.95; }
  94%      { opacity: 1; }
}

/* ── Message ───────────────────────────────────────────────── */
.detective-msg {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.88rem;
  letter-spacing: 0.2em;
  color: #CCCCCC;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.msg-glyph {
  color: #888;
  font-size: 0.7rem;
}

.msg-text {
  text-transform: uppercase;
}

.msg-dots span {
  animation: blink 1.2s infinite;
  opacity: 0;
}
.msg-dots span:nth-child(1) { animation-delay: 0s;    }
.msg-dots span:nth-child(2) { animation-delay: 0.3s;  }
.msg-dots span:nth-child(3) { animation-delay: 0.6s;  }

@keyframes blink {
  0%, 60%, 100% { opacity: 0; }
  30%            { opacity: 1; }
}

.detective-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.75rem;
  font-style: italic;
  color: #555;
  margin: 0;
  letter-spacing: 0.05em;
}

/* ── Transition ────────────────────────────────────────────── */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
