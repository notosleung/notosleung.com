<script setup lang="ts">
import type { Frontmatter } from '@/types'
import mediumZoom from 'medium-zoom'
import { formatDate } from '@/logics'

const { frontmatter } = defineProps<{
  frontmatter: Frontmatter
}>()

const route = useRoute()
const siteUrl = 'https://notosleung.com'
const isNotFound = computed(() => String(frontmatter.title) === '404')
const canonicalUrl = computed(() => new URL(route.path, siteUrl).href)
const description = computed(() => frontmatter.description || frontmatter.title || 'Notos Leung')

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
  meta: [
    { property: 'og:type', content: route.path.startsWith('/posts/') ? 'article' : 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: `${siteUrl}/apple-touch-icon.png` },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:image', content: `${siteUrl}/apple-touch-icon.png` },
    { name: 'description', content: description },
    { property: 'og:description', content: description },
    { name: 'twitter:description', content: description },
    ...(isNotFound.value
      ? [{ name: 'robots', content: 'noindex, noarchive' }]
      : []),
    ...(frontmatter.date
      ? [{ property: 'article:published_time', content: new Date(frontmatter.date).toISOString() }]
      : []),
  ],
})

const articleRef = ref<HTMLElement>()
const zoomRef = shallowRef<ReturnType<typeof mediumZoom>>()
const zoomImages = shallowRef<HTMLImageElement[]>([])

function openZoomByKeyboard(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ')
    return

  event.preventDefault()
  const image = event.currentTarget as HTMLImageElement
  image.click()
}

onMounted(() => {
  zoomImages.value = Array.from(articleRef.value?.querySelectorAll('img') || [])
  zoomImages.value.forEach((image) => {
    image.tabIndex = 0
    image.role = 'button'
    image.setAttribute('aria-label', image.alt ? `查看大图：${image.alt}` : '查看大图')
    image.addEventListener('keydown', openZoomByKeyboard)
  })
  zoomRef.value = mediumZoom(zoomImages.value, {
    background: 'rgba(0, 0, 0, 0.75)',
    margin: 24,
    scrollOffset: 0,
  })
})
onUnmounted(() => {
  zoomRef.value?.detach()
  zoomImages.value.forEach(image => image.removeEventListener('keydown', openZoomByKeyboard))
})
</script>

<template>
  <div class="prose mb-8">
    <h1 v-if="frontmatter.title" :id="frontmatter.title" class="mb-0">
      {{ frontmatter.title }}
    </h1>
    <div v-if="frontmatter.date || frontmatter.description" class="opacity-50 !-mt-6">
      <span v-if="frontmatter.description">{{ frontmatter.description }}</span>
      <time v-if="frontmatter.date" :datetime="new Date(frontmatter.date).toISOString()">
        {{ `- ${formatDate(frontmatter.date, false)}` }}
      </time>
    </div>
  </div>
  <article ref="articleRef" class="relative">
    <slot />
  </article>
  <Back v-if="route.path !== '/'" />
</template>
