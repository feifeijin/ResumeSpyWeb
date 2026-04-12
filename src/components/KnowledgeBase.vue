<template>
  <section class="reading-room">
    <div class="reading-inner">
      <p class="section-overline">{{ $t('home.readingRoom.title') }}</p>
      <h2 class="section-title">{{ $t('home.readingRoom.subtitle') }}</h2>
      <p class="section-sub">{{ $t('home.readingRoom.description') }}</p>

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
          <div class="card-meta">
            <span>{{ article.author }}</span>
            <span class="meta-dot">·</span>
            <span>{{ article.readTime }} {{ t('articles.minRead') }}</span>
          </div>
          <span class="card-read">{{ t('articles.readMore') }} →</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getArticlesByLocale } from '@/articles/articles'

const { t, locale } = useI18n()

const articles = computed(() => getArticlesByLocale(locale.value))
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
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  color: #888888;
  letter-spacing: 0.28em;
  margin-bottom: 1rem;
}

.section-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
}

.section-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-style: italic;
  color: #666666;
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
  background: #F0F0F0;
  border: 1.5px solid #D4D4D4;
  padding: 2rem 1.75rem;
  text-decoration: none;
  box-shadow: 3px 3px 0 #AAAAAA;
  transition: border-color 0.3s, background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.article-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #121212;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.article-card:hover {
  border-color: #AAAAAA;
  background: #E8E8E8;
  transform: translateY(-3px);
  box-shadow: 5px 5px 0 #AAAAAA;
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
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: #888888;
  border: 1px solid #D4D4D4;
  padding: 0.15rem 0.5rem;
}

.card-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #121212;
  letter-spacing: 0.05em;
  line-height: 1.4;
  margin: 0;
  transition: color 0.2s;
}

.article-card:hover .card-title {
  color: #2B2B2B;
}

.card-excerpt {
  font-family: 'Inter', system-ui, sans-serif;
  font-style: italic;
  font-size: 0.88rem;
  color: #666666;
  line-height: 1.7;
  margin: 0;
  flex: 1;
}

.card-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #888888;
  display: flex;
  gap: 0.35rem;
  align-items: center;
}
.meta-dot { color: #888888; }

.card-read {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: #888888;
  transition: color 0.2s;
  margin-top: auto;
}

.article-card:hover .card-read {
  color: #121212;
}
</style>
