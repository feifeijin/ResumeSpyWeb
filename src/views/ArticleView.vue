<template>
  <v-container class="article-view py-16">
    <v-row v-if="!article">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="article.notFound">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 mb-4">{{ t('articles.notFound') }}</h1>
        <v-btn :to="'/'" color="primary">{{ t('articles.backToArticles') }}</v-btn>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-btn :to="'/'" variant="text" class="mb-6" size="small">
          <v-icon start>mdi-arrow-left</v-icon>
          {{ t('articles.backToArticles') }}
        </v-btn>

        <article>
          <header class="mb-8">
            <h1 class="text-h3 font-weight-bold mb-4">{{ article.title }}</h1>
            <div class="d-flex flex-wrap gap-2 mb-4">
              <v-chip
                v-for="tag in article.tags"
                :key="tag"
                size="small"
                color="primary"
                variant="outlined"
              >
                {{ tag }}
              </v-chip>
            </div>
          </header>

          <div class="article-content text-body-1" v-html="article.content"></div>
        </article>

        <v-divider class="my-8"></v-divider>

        <v-btn :to="'/'" color="primary">
          <v-icon start>mdi-arrow-left</v-icon>
          {{ t('articles.backToArticles') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleContent } from '@/composables/useArticleContent'

const { t, tm } = useI18n()
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getArticleBySlug } = useArticleContent()

interface ArticleMeta {
  slug: string
  title: string
  excerpt: string
  tags: string[]
}

interface ArticleWithContent extends ArticleMeta {
  content: string
  notFound: false
}

interface ArticleNotFound {
  notFound: true
}

type ArticleData = ArticleWithContent | ArticleNotFound

function isArticleMeta(value: unknown): value is ArticleMeta {
  return (
    typeof value === 'object' &&
    value !== null &&
    'slug' in value &&
    'title' in value &&
    'excerpt' in value &&
    'tags' in value &&
    typeof (value as ArticleMeta).slug === 'string' &&
    typeof (value as ArticleMeta).title === 'string' &&
    typeof (value as ArticleMeta).excerpt === 'string' &&
    Array.isArray((value as ArticleMeta).tags)
  )
}

const articleMeta = computed<ArticleMeta | undefined>(() => {
  const items = tm('articles.items')
  if (!Array.isArray(items)) {
    return undefined
  }
  
  const found = items.find((item) => {
    return isArticleMeta(item) && item.slug === slug.value
  })
  
  return found && isArticleMeta(found) ? found : undefined
})

const article = computed<ArticleData | null>(() => {
  const meta = articleMeta.value
  if (!meta) {
    return { notFound: true }
  }

  const content = getArticleBySlug(slug.value)
  if (!content) {
    return { notFound: true }
  }

  return {
    ...meta,
    content,
    notFound: false,
  }
})
</script>

<style scoped>
.article-content {
  line-height: 1.8;
}

.article-content :deep(h1) {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.article-content :deep(h2) {
  font-size: 2rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.article-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.article-content :deep(h4) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(strong) {
  font-weight: 600;
}

.article-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.article-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #1976d2;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: rgba(0, 0, 0, 0.6);
}
</style>
