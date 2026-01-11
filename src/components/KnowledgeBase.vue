<template>
  <v-sheet id="articles" class="text-center py-16" min-height="800">
    <header>
      <h2 class="text-h4 font-weight-bold">{{ t('articles.title') }}</h2>

      <p class="text-body-1 text-medium-emphasis mt-5">
        {{ t('articles.subtitle') }}
      </p>
    </header>

    <v-container>
      <v-row>
        <v-col
          v-for="(article, index) in articles"
          :key="`article-${index}-${article.title}`"
          class="pa-5"
          cols="12"
          md="4"
        >
          <article>
            <v-card class="bg-white rounded-xl pb-5 d-flex flex-column" flat height="100%">
              <v-card-title class="text-h6 mt-3 px-5">
                {{ article.title }}
              </v-card-title>

              <v-card-text class="text-body-2 text-medium-emphasis px-5 flex-grow-1">
                {{ article.excerpt }}
              </v-card-text>

              <v-card-actions class="px-5 pb-4 flex-column align-start">
                <div class="d-flex flex-wrap mb-3">
                  <v-chip
                    v-for="tag in article.tags"
                    :key="tag"
                    class="mr-2 mb-2"
                    size="small"
                    variant="outlined"
                    color="primary"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
                <v-btn
                  :to="`/articles/${article.slug}`"
                  color="primary"
                  variant="text"
                  size="small"
                >
                  {{ t('articles.readMore') }}
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </article>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

interface Article {
  slug: string
  title: string
  excerpt: string
  tags: string[]
}

function isArticleArray(value: unknown): value is Article[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'slug' in item &&
        'title' in item &&
        'excerpt' in item &&
        'tags' in item &&
        typeof item.slug === 'string' &&
        typeof item.title === 'string' &&
        typeof item.excerpt === 'string' &&
        Array.isArray(item.tags) &&
        item.tags.every((tag: unknown) => typeof tag === 'string'),
    )
  )
}

const { t, tm } = useI18n()

const articles = computed(() => {
  const value = tm('articles.items')
  return isArticleArray(value) ? value : []
})
</script>
