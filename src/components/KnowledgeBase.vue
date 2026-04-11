<template>
  <section class="reading-room">
    <div class="reading-inner">
      <p class="section-overline">— The Reading Room —</p>
      <h2 class="section-title">From the Archives</h2>
      <p class="section-sub">Field notes on resume craft, career strategy, and the art of the application.</p>

      <div class="article-grid">
        <router-link
          v-for="article in articles"
          :key="article.slug"
          :to="`/article/${article.slug}`"
          class="article-card"
        >
          <div class="card-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <h3 class="card-title">{{ article.title }}</h3>
          <p class="card-excerpt">{{ article.excerpt }}</p>
          <span class="card-read">{{ t('articles.readMore') }} →</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

interface ArticleMeta {
  slug: string
  title: string
  excerpt: string
  tags: string[]
}

const articles = computed<ArticleMeta[]>(() => {
  const items = tm('articles.items') as unknown
  if (!Array.isArray(items)) return []
  return items as ArticleMeta[]
})
</script>

<style scoped>
.reading-room {
  position: relative;
  z-index: 10;
  padding: 6rem 2rem;
}

.reading-inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.section-overline {
  font-family: 'Special Elite', cursive;
  font-size: 0.78rem;
  color: #7a5f22;
  letter-spacing: 0.28em;
  margin-bottom: 1rem;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #e2d5bc;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
}

.section-sub {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  color: #6a5f52;
  font-size: 0.95rem;
  margin-bottom: 3.5rem;
}

/* ── Article Grid ─────────────────────────────────────────── */
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  text-align: left;
}

.article-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: #161210;
  border: 1px solid #2e2620;
  padding: 2rem 1.75rem;
  text-decoration: none;
  transition: border-color 0.3s, background 0.3s, transform 0.3s;
}

.article-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #c49a38;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.article-card:hover {
  border-color: #3e3428;
  background: #1c1814;
  transform: translateY(-3px);
}

.article-card:hover::after {
  transform: scaleX(1);
}

.card-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  font-family: 'Special Elite', cursive;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: #7a5f22;
  border: 1px solid #2e2620;
  padding: 0.15rem 0.5rem;
}

.card-title {
  font-family: 'Cinzel', serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #e2d5bc;
  letter-spacing: 0.05em;
  line-height: 1.4;
  margin: 0;
  transition: color 0.2s;
}

.article-card:hover .card-title {
  color: #c49a38;
}

.card-excerpt {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  font-size: 0.88rem;
  color: #6a5f52;
  line-height: 1.7;
  margin: 0;
  flex: 1;
}

.card-read {
  font-family: 'Special Elite', cursive;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: #7a5f22;
  transition: color 0.2s;
  margin-top: auto;
}

.article-card:hover .card-read {
  color: #c49a38;
}
</style>
