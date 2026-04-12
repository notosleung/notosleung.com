<script setup lang="ts">
import mediumZoom from 'medium-zoom'
import { formatDate } from '@/logics'

interface Frontmatter {
  title?: string
  description?: string
  date?: string
  [key: string]: unknown
}

const { frontmatter } = defineProps<{
  frontmatter: Frontmatter
}>()

const route = useRoute()

const zoomRef = ref()
onMounted(() => {
  zoomRef.value = mediumZoom('.prose img', {
    background: 'rgba(0, 0, 0, 0.75)',
    margin: 24,
    scrollOffset: 0,
  })
})
onUnmounted(() => {
  zoomRef.value?.detach()
})
</script>

<template>
  <div class="prose mb-8">
    <h1 v-if="frontmatter.title" :id="frontmatter.title" class="mb-0">
      {{ frontmatter.title }}
    </h1>
    <div v-if="frontmatter.date || frontmatter.description" class="opacity-50 !-mt-6">
      <span v-if="frontmatter.description">{{ frontmatter.description }}</span>
      <span v-if="frontmatter.date">{{ `- ${formatDate(frontmatter.date, false)}` }}</span>
    </div>
  </div>
  <article class="relative">
    <slot />
  </article>
  <Back v-if="route.path !== '/'" />
</template>
