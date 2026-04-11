<template>
  <section class="how-it-works">
    <div class="how-inner">
      <p class="section-overline">— The Process —</p>
      <h2 class="section-title">How It Works</h2>

      <div class="steps">
        <div v-for="(step, i) in steps" :key="i" class="step">
          <div class="step-connector" v-if="i < steps.length - 1" aria-hidden="true" />

          <div class="step-num">{{ step.num }}</div>
          <div class="step-icon">{{ step.icon }}</div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
        </div>
      </div>

      <div class="how-cta">
        <router-link to="/create" class="btn-ink">Begin Your Dossier</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    num: '01',
    icon: '✒',
    title: 'Write in Markdown',
    desc: 'Compose your resume in plain Markdown. Clean, portable, version-controlled. Your words — no templates forcing your hand.',
  },
  {
    num: '02',
    icon: '◆',
    title: 'AI Tailors to the Role',
    desc: 'Paste a job description. The AI rewrites your dossier to match the role — every fact preserved, every keyword sharpened.',
  },
  {
    num: '03',
    icon: '◈',
    title: 'Export Your Dossier',
    desc: 'Download a polished PDF. Share in any language. EN, 中文, 日本語 — your story told wherever the opportunity leads.',
  },
]
</script>

<style scoped>
.how-it-works {
  position: relative;
  z-index: 10;
  padding: 6rem 2rem;
  background: transparent;
}

.how-inner {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

.section-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: #888888;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
}

.section-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: 0.05em;
  margin-bottom: 4rem;
}

/* ── Steps ───────────────────────────────────────────────── */
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0;
  position: relative;
  margin-bottom: 4rem;
}

.step {
  position: relative;
  padding: 2rem 2rem 2rem;
  text-align: center;
  border: 1.5px solid #D4D4D4;
  background: #F0F0F0;
  margin: 0 -1px -1px 0;
  transition: background 0.2s;
}

.step:hover {
  background: #E8E8E8;
}

/* Horizontal connector line between steps on desktop */
.step-connector {
  display: none;
}

.step-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: #888888;
  letter-spacing: 0.3em;
  margin-bottom: 1rem;
}

.step-icon {
  font-size: 1.6rem;
  color: #121212;
  margin-bottom: 1.25rem;
  display: block;
}

.step-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #121212;
  letter-spacing: 0.03em;
  margin: 0 0 0.85rem;
}

.step-desc {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.88rem;
  color: #666666;
  line-height: 1.75;
  margin: 0;
}

/* ── CTA ─────────────────────────────────────────────────── */
.how-cta {
  display: flex;
  justify-content: center;
}

.btn-ink {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  color: #F5F5F5;
  background: #121212;
  border: 1.5px solid #121212;
  padding: 0.85rem 2.5rem;
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
</style>
