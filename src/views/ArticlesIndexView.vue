<template>
  <div class="noir-archives-index">
    <div class="film-grain" aria-hidden="true" />

    <div class="archives-index-page">
      <div class="archives-index-inner">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumb">
          <router-link to="/">{{ t('navigation.home') }}</router-link>
          <span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-current">{{ t('articles.backToArticles') }}</span>
        </nav>

        <header class="index-header">
          <p class="index-overline">{{ t('articles.readingRoom') }}</p>
          <h1 class="index-title">{{ t('articlesIndex.title') }}</h1>
          <p class="index-subtitle">{{ t('articlesIndex.subtitle') }}</p>
        </header>

        <!-- Tag filter -->
        <div v-if="allTags.length" class="tag-filter" role="tablist">
          <button
            class="tag-chip"
            :class="{ active: selectedTag === null }"
            @click="selectedTag = null"
          >
            {{ t('articlesIndex.allTag') }}
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="tag-chip"
            :class="{ active: selectedTag === tag }"
            @click="selectedTag = tag"
          >
            {{ tag }}
          </button>
        </div>

        <!-- Article list -->
        <div class="article-grid">
          <router-link
            v-for="article in filteredArticles"
            :key="article.slug"
            :to="`/article/${article.slug}`"
            class="article-card"
          >
            <div class="card-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <h2 class="card-title">{{ article.title }}</h2>
            <p class="card-excerpt">{{ article.excerpt }}</p>
            <div class="card-meta">
              <span>{{ article.author }}</span>
              <span class="meta-dot">·</span>
              <time :datetime="article.date">{{ formatDate(article.date) }}</time>
              <span class="meta-dot">·</span>
              <span>{{ article.readTime }} {{ t('articles.minRead') }}</span>
            </div>
            <span class="card-read">{{ t('articles.readMore') }} →</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getArticlesByLocale } from '@/articles/articles'
import { useSeo, SITE_URL } from '@/composables/useSeo'

const { t, locale } = useI18n()

const articles = computed(() => getArticlesByLocale(locale.value))

const allTags = computed(() => {
  const set = new Set<string>()
  articles.value.forEach((a) => a.tags.forEach((tag) => set.add(tag)))
  return Array.from(set).sort()
})

const selectedTag = ref<string | null>(null)

const filteredArticles = computed(() => {
  if (selectedTag.value === null) return articles.value
  const tag = selectedTag.value
  return articles.value.filter((a) => a.tags.includes(tag))
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(
    locale.value === 'ja' ? 'ja-JP' : locale.value === 'zh' ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )
}

useSeo(() => {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('articlesIndex.title'),
    description: t('articlesIndex.subtitle'),
    itemListElement: articles.value.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/article/${a.slug}`,
      name: a.title,
    })),
  }

  return {
    title: `${t('articlesIndex.title')} — ResumeSpy`,
    description: t('articlesIndex.metaDesc'),
    canonicalPath: '/articles',
    locale: locale.value,
    jsonLd: [itemListSchema],
  }
})
</script>

<style scoped>
.noir-archives-index {
  --bg: #fafafa;
  --surface: #f0f0f0;
  --border: #d4d4d4;
  --text: #121212;
  --muted: #666666;
  --gold-dim: #888888;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
}

.film-grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.4;
  mix-blend-mode: overlay;
}

.archives-index-page {
  position: relative;
  z-index: 10;
  padding: 3rem 2rem 6rem;
}

.archives-index-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.breadcrumb {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}
.breadcrumb a { color: var(--muted); text-decoration: none; transition: color 0.2s; }
.breadcrumb a:hover { color: var(--text); }
.breadcrumb-sep { color: var(--gold-dim); }
.breadcrumb-current { color: var(--gold-dim); }

.index-header {
  text-align: center;
  margin-bottom: 3rem;
}

.index-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  color: var(--gold-dim);
  letter-spacing: 0.28em;
  margin-bottom: 1rem;
}

.index-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.1em;
  margin: 0 0 0.75rem;
}

.index-subtitle {
  font-style: italic;
  color: var(--muted);
  font-size: 1rem;
  max-width: 580px;
  margin: 0 auto;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.tag-chip {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.4rem 0.85rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.tag-chip:hover { border-color: var(--gold-dim); color: var(--text); }
.tag-chip.active { background: var(--text); color: #fafafa; border-color: var(--text); }

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.article-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  padding: 1.75rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 4px 4px 0 #aaa;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 0 #aaa;
}

.card-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--gold-dim);
  border: 1px solid var(--border);
  padding: 0.15rem 0.5rem;
}

.card-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.04em;
  margin: 0;
  line-height: 1.4;
}

.card-excerpt {
  font-size: 0.9rem;
  font-style: italic;
  color: var(--muted);
  line-height: 1.65;
  margin: 0;
}

.card-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
  margin-top: auto;
}

.meta-dot { color: var(--gold-dim); }

.card-read {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: var(--text);
}
</style>
