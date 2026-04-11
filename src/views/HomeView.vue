<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

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

const features = [
  {
    num: 'I',
    icon: '◈',
    title: 'Version Control',
    desc: 'Every draft preserved. Every version recoverable. Your resume evolves — nothing is ever lost.',
    tilt: '-1.2deg',
  },
  {
    num: 'II',
    icon: '◆',
    title: 'AI Tailoring',
    desc: 'Paste a job description. Watch your story reshape itself — precise, intentional, yours.',
    tilt: '0.9deg',
  },
  {
    num: 'III',
    icon: '◇',
    title: 'Many Tongues',
    desc: 'English. 中文. 日本語. Your story told in every language — translated with care, not machinery.',
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
        <p class="overline">— Case File No. 001 —</p>

        <h1 class="hero-title">
          RESUME<span class="title-gold">SPY</span>
        </h1>

        <p class="tagline">Your dossier. Your story. Your world.</p>

        <p class="hero-desc">
          An atelier for the modern professional —<br />
          version-controlled resumes, AI-tailored to every role,<br />
          written in the ink of who you are.
        </p>

        <div class="hero-cta">
          <button class="btn-ink" @click="router.push('/create')">
            Open Your Dossier
          </button>
          <button class="btn-ghost" @click="router.push('/auth')">
            Sign In
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
      <h2 class="section-heading">What Lies Within</h2>

      <div class="card-grid">
        <div
          v-for="(f, i) in features"
          :key="i"
          class="case-card"
          :style="{ '--tilt': f.tilt }"
        >
          <span class="card-num">{{ f.num }}</span>
          <span class="card-icon">{{ f.icon }}</span>
          <h3 class="card-title">{{ f.title }}</h3>
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

    <!-- ── MANIFESTO ──────────────────────────────────────── -->
    <section class="manifesto">
      <p class="manifesto-label">— From the desk of the creator —</p>

      <blockquote class="manifesto-quote">
        "This is not a product. It is a stage.<br />
        A place where your story takes form —<br />
        not in templates and checkboxes,<br />
        but in craft, intention, and ink."
      </blockquote>

      <p class="manifesto-sig">— Fei-Fei Jin</p>
      <p class="manifesto-note">Open source · Built for love · Offered freely</p>

      <div class="manifesto-actions">
        <a
          href="https://github.com/feifeijin/ResumeSpyWeb"
          target="_blank"
          rel="noopener"
          class="btn-ghost"
        >
          ★ &nbsp;Star on GitHub
        </a>
        <a
          href="https://www.buymeacoffee.com/feifeijin"
          target="_blank"
          rel="noopener"
          class="btn-coffee"
        >
          ☕ &nbsp;Buy me a coffee
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Tokens ──────────────────────────────────────────────── */
.noir-home {
  --bg:        #0c0a08;
  --surface:   #161210;
  --border:    #2e2620;
  --text:      #e2d5bc;
  --muted:     #6a5f52;
  --gold:      #c49a38;
  --gold-dim:  #7a5f22;
  --ink:       #090807;

  --f-title:  'Cinzel', serif;
  --f-body:   'IM Fell English', serif;
  --f-stamp:  'Special Elite', cursive;

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
  background: linear-gradient(to bottom, transparent, rgba(196, 170, 110, 0.22));
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
  background:
    radial-gradient(ellipse 55% 45% at 50% 38%, rgba(196, 154, 56, 0.07) 0%, transparent 65%),
    linear-gradient(to bottom, #0c0a08 0%, #110e0b 60%, #0c0a08 100%);
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
  letter-spacing: 0.1em;
  color: var(--text);
  line-height: 1;
  margin: 0 0 1.5rem;
  text-shadow:
    0 0 80px rgba(196, 154, 56, 0.12),
    0 2px 4px rgba(0,0,0,0.8);
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
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  color: var(--ink);
  background: var(--gold);
  border: none;
  padding: 0.85rem 2.2rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-ink:hover {
  background: #d4a940;
  box-shadow: 0 0 24px rgba(196, 154, 56, 0.45);
  transform: translateY(-2px);
}

.btn-ghost {
  font-family: var(--f-stamp);
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.85rem 2.2rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: border-color 0.3s, color 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-ghost:hover {
  border-color: var(--gold-dim);
  color: var(--text);
}

.btn-coffee {
  font-family: var(--f-stamp);
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  color: var(--text);
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.85rem 2.2rem;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-coffee:hover {
  border-color: var(--gold-dim);
  color: var(--gold);
  background: rgba(196, 154, 56, 0.05);
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
  border: 1px solid var(--border);
  padding: 2.5rem 2rem 2.25rem;
  text-align: left;
  transform: rotate(var(--tilt, 0deg));
  box-shadow: 3px 3px 0 var(--ink), 5px 5px 0 rgba(0, 0, 0, 0.35);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s ease;
}

/* Inner double border — aged paper feel */
.case-card::before {
  content: '';
  position: absolute;
  inset: 7px;
  border: 1px solid var(--border);
  pointer-events: none;
  opacity: 0.35;
}

.case-card:hover {
  transform: rotate(0deg) translateY(-5px);
  box-shadow: 3px 3px 0 var(--ink), 10px 10px 0 rgba(0, 0, 0, 0.4),
              0 0 40px rgba(196, 154, 56, 0.07);
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
  background: linear-gradient(to bottom, transparent, rgba(196, 154, 56, 0.025), transparent);
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
  color: var(--gold);
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
