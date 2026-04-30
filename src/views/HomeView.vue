<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import ResumeGuide from '@/components/ResumeGuide.vue'
import KnowledgeBase from '@/components/KnowledgeBase.vue'

const router = useRouter()
const { t, locale } = useI18n()
const { isAuthenticated } = storeToRefs(useAuthStore())

function rainStyle(i: number) {
  const left = (i * 37 + 13) % 97
  const delay = -((i * 1.3) % 5)
  const duration = 1.4 + (i % 7) * 0.35
  const opacity = 0.05 + (i % 5) * 0.04
  const height = 40 + (i % 7) * 22
  return {
    left: `${left}%`,
    animationDelay: `${delay.toFixed(1)}s`,
    animationDuration: `${duration.toFixed(1)}s`,
    opacity: opacity.toFixed(2),
    height: `${height}px`,
  }
}

// ── SEO: page title + meta description ────────────────────────────────────
let injectedMeta: HTMLMetaElement | null = null

function injectHomeSeo() {
  document.title = 'ResumeSpy — Your Dossier. Your Story.'
  injectedMeta?.remove()
  injectedMeta = document.createElement('meta')
  injectedMeta.setAttribute('name', 'description')
  injectedMeta.setAttribute(
    'content',
    locale.value === 'zh'
      ? '面向现代职场人的精品简历工坊。版本控制、AI 定制、多语言支持，让你的简历永不过时。'
      : locale.value === 'ja'
        ? 'モダンなプロフェッショナルのための職歴管理ツール。バージョン管理・AI調整・多言語対応で履歴書を常に最新に。'
        : 'Craft, version, and tailor your resume with AI for every opportunity. Multilingual. Private. Yours.',
  )
  document.head.appendChild(injectedMeta)
}

watch(locale, injectHomeSeo, { immediate: true })

onUnmounted(() => {
  injectedMeta?.remove()
  injectedMeta = null
})

const features = [
  {
    num: 'I',
    icon: '◈',
    title: t('home.features.versionControl'),
    desc: t('home.features.versionControlDesc'),
    tilt: '-1.2deg',
  },
  {
    num: 'II',
    icon: '◆',
    title: t('home.features.aiTailoring'),
    desc: t('home.features.aiTailoringDesc'),
    tilt: '0.9deg',
  },
  {
    num: 'III',
    icon: '◇',
    title: t('home.features.manyTongues'),
    desc: t('home.features.manyTonguesDesc'),
    tilt: '-0.6deg',
  },
]
</script>

<template>
  <div class="noir-home">
    <!-- Film grain overlay -->
    <div class="film-grain" aria-hidden="true" />

    <!-- Rain -->
    <div class="rain-container" aria-hidden="true">
      <div
        v-for="i in 35"
        :key="i"
        class="rain-drop"
        :style="rainStyle(i)"
      />
    </div>

    <!-- ── HERO ───────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-inner">
        <p class="overline">{{ $t('home.overline') }}</p>

        <h1 class="hero-title">
          RESUME<span class="title-gold">SPY</span>
        </h1>

        <p class="tagline">{{ $t('home.tagline') }}</p>

        <p class="hero-desc">
          {{ $t('home.description') }}
        </p>

        <div class="hero-cta">
          <button class="btn-ink" @click="router.push('/create')">
            {{ $t('home.cta') }}
          </button>
          <button v-if="!isAuthenticated" class="btn-ghost" @click="router.push('/auth')">
            {{ $t('navigation.login') }}
          </button>
          <button v-else class="btn-ghost" @click="router.push('/myspy')">
            {{ $t('navigation.mySpy') }}
          </button>
        </div>
      </div>

      <!-- Vignette bottom fade -->
      <div class="hero-vignette" aria-hidden="true" />
    </section>

    <!-- ── DIVIDER ─────────────────────────────────────────── -->
    <div class="divider" aria-hidden="true">
      <span class="divider-line" />
      <span class="divider-glyph">✦</span>
      <span class="divider-line" />
    </div>

    <!-- ── FEATURES ───────────────────────────────────────── -->
    <section class="features">
      <h2 class="section-heading">{{ $t('home.sectionHeading') }}</h2>

      <div class="card-grid">
        <div
          v-for="(f, i) in features"
          :key="i"
          class="case-card"
          :style="{ '--tilt': f.tilt }"
        >
          <div class="card-header">
            <span class="card-num">{{ f.num }}</span>
            <span class="card-icon">{{ f.icon }}</span>
            <h3 class="card-title">{{ f.title }}</h3>
          </div>
          <p class="card-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── DIVIDER ─────────────────────────────────────────── -->
    <div class="divider" aria-hidden="true">
      <span class="divider-line" />
      <span class="divider-glyph">✦</span>
      <span class="divider-line" />
    </div>

    <!-- ── HOW IT WORKS ──────────────────────────────────────── -->
    <ResumeGuide />

    <!-- ── DIVIDER ─────────────────────────────────────────── -->
    <div class="divider" aria-hidden="true">
      <span class="divider-line" />
      <span class="divider-glyph">✦</span>
      <span class="divider-line" />
    </div>

    <!-- ── ARTICLES ───────────────────────────────────────── -->
    <KnowledgeBase />

    <!-- ── DIVIDER ─────────────────────────────────────────── -->
    <div class="divider" aria-hidden="true">
      <span class="divider-line" />
      <span class="divider-glyph">✦</span>
      <span class="divider-line" />
    </div>

    <!-- ── MANIFESTO ──────────────────────────────────────── -->
    <section class="manifesto">
      <p class="manifesto-label">{{ $t('home.manifesto.label') }}</p>

      <blockquote class="manifesto-quote">
        "{{ $t('home.manifesto.quote') }}"
      </blockquote>

      <p class="manifesto-sig">{{ $t('home.manifesto.author') }}</p>
      <p class="manifesto-note">{{ $t('home.manifesto.note') }}</p>

      <div class="manifesto-actions">
        <a
          href="https://github.com/feifeijin/ResumeSpyWeb"
          target="_blank"
          rel="noopener"
          class="btn-ghost"
        >
          {{ $t('home.manifesto.starGitHub') }}
        </a>
        <a
          href="https://www.buymeacoffee.com/feifeijin"
          target="_blank"
          rel="noopener"
          class="btn-coffee"
        >
          {{ $t('home.manifesto.buyCoffee') }}
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Tokens ──────────────────────────────────────────────── */
.noir-home {
  --bg:        #FAFAFA;
  --surface:   #F0F0F0;
  --border:    #D4D4D4;
  --text:      #121212;
  --muted:     #666666;
  --gold:      #121212;
  --gold-dim:  #888888;
  --ink:       #FFFFFF;

  --f-title:  'Inter', system-ui, sans-serif;
  --f-body:   'Inter', system-ui, sans-serif;
  --f-stamp:  'IBM Plex Mono', monospace;

  position: relative;
  background: var(--bg);
  color: var(--text);
  font-family: var(--f-body);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Film Grain ──────────────────────────────────────────── */
.film-grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 200;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.4;
  mix-blend-mode: overlay;
}

/* ── Rain ────────────────────────────────────────────────── */
.rain-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.rain-drop {
  position: absolute;
  top: -100px;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.07));
  animation: rain-fall linear infinite;
}

@keyframes rain-fall {
  to { transform: translateY(115vh); }
}

/* ── Hero ────────────────────────────────────────────────── */
.hero {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 7rem 2rem 5rem;
  background: var(--bg);
}

.hero-inner { max-width: 680px; }

.hero-vignette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent, var(--bg));
  pointer-events: none;
}

.overline {
  font-family: var(--f-stamp);
  font-size: 0.8rem;
  color: var(--gold-dim);
  letter-spacing: 0.28em;
  margin-bottom: 1.75rem;
}

.hero-title {
  font-family: var(--f-title);
  font-size: clamp(3.2rem, 10vw, 7.5rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text);
  line-height: 1;
  margin: 0 0 1.5rem;
}

.title-gold { color: var(--gold); }

.tagline {
  font-family: var(--f-stamp);
  font-size: 1rem;
  color: var(--muted);
  letter-spacing: 0.12em;
  margin-bottom: 1.75rem;
}

.hero-desc {
  font-size: 1rem;
  font-style: italic;
  color: var(--muted);
  line-height: 1.95;
  margin-bottom: 3rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ── Buttons ─────────────────────────────────────────────── */
.btn-ink {
  font-family: var(--f-stamp);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  color: #F5F5F5;
  background: #121212;
  border: 1.5px solid #121212;
  padding: 0.85rem 2.2rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  text-decoration: none;
  display: inline-block;
  box-shadow: 3px 3px 0 #AAAAAA;
}

.btn-ink:hover {
  background: #2B2B2B;
  transform: translateY(-2px);
  box-shadow: 5px 5px 0 #AAAAAA;
}

.btn-ghost {
  font-family: var(--f-stamp);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  color: #666666;
  background: transparent;
  border: 1.5px solid #D4D4D4;
  padding: 0.85rem 2.2rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: border-color 0.2s, color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-ghost:hover {
  border-color: #888888;
  color: #121212;
}

.btn-coffee {
  font-family: var(--f-stamp);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  color: #666666;
  background: transparent;
  border: 1.5px solid #D4D4D4;
  padding: 0.85rem 2.2rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-coffee:hover {
  border-color: #888888;
  color: #121212;
}

/* ── Divider ─────────────────────────────────────────────── */
.divider {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 5vw;
}

.divider-line {
  flex: 1;
  display: block;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border), transparent);
}

.divider-glyph {
  font-size: 0.65rem;
  color: var(--gold-dim);
  flex-shrink: 0;
}

/* ── Features ────────────────────────────────────────────── */
.features {
  position: relative;
  z-index: 10;
  padding: 6rem 2rem;
  text-align: center;
}

.section-heading {
  font-family: var(--f-title);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text);
  letter-spacing: 0.25em;
  margin-bottom: 4rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 960px;
  margin: 0 auto;
}

.case-card {
  position: relative;
  background: var(--surface);
  border: 1.5px solid #D4D4D4;
  padding: 2.5rem 2rem 2.25rem;
  text-align: left;
  transform: rotate(var(--tilt, 0deg));
  box-shadow: 4px 4px 0 #AAAAAA;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s ease;
}

/* Inner sketch border */
.case-card::before {
  content: '';
  position: absolute;
  inset: 7px;
  border: 1px dashed #D4D4D4;
  pointer-events: none;
  opacity: 0.4;
}

.case-card:hover {
  transform: rotate(0deg) translateY(-5px);
  box-shadow: 6px 6px 0 #AAAAAA;
}

.card-header {
  display: contents;
}

.card-num {
  display: block;
  font-family: var(--f-title);
  font-size: 0.65rem;
  color: var(--gold-dim);
  letter-spacing: 0.35em;
  margin-bottom: 0.75rem;
}

.card-icon {
  display: block;
  font-size: 1.4rem;
  color: var(--gold);
  margin-bottom: 1rem;
}

.card-title {
  font-family: var(--f-title);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.12em;
  margin: 0 0 0.85rem;
}

@media (max-width: 600px) {
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.85rem;
  }

  .card-header .card-num,
  .card-header .card-icon {
    margin-bottom: 0;
  }

  .card-header .card-title {
    margin: 0;
  }
}

.card-desc {
  font-size: 0.9rem;
  font-style: italic;
  color: var(--muted);
  line-height: 1.75;
  margin: 0;
}

/* ── Manifesto ───────────────────────────────────────────── */
.manifesto {
  position: relative;
  z-index: 10;
  padding: 6rem 2rem 7rem;
  text-align: center;
  background: transparent;
}

.manifesto-label {
  font-family: var(--f-stamp);
  font-size: 0.78rem;
  color: var(--gold-dim);
  letter-spacing: 0.22em;
  margin-bottom: 2.5rem;
}

.manifesto-quote {
  font-size: 1.2rem;
  font-style: italic;
  color: var(--text);
  line-height: 2.1;
  border: none;
  padding: 0;
  margin: 0 auto 2.5rem;
  max-width: 560px;
}

.manifesto-sig {
  font-family: var(--f-stamp);
  font-size: 1rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.manifesto-note {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--muted);
  margin-bottom: 3rem;
}

.manifesto-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
