<script setup lang="ts">
defineProps<{
  headings: { id: string, text: string, level: number }[]
}>()

const expanded = ref(false)
const hovered = ref(false)
const articleHovered = ref(false)
const focused = ref(false)
const visible = computed(() => expanded.value || hovered.value || articleHovered.value || focused.value)
const route = useRoute()
const tocRef = ref<HTMLElement>()
let article: HTMLElement | null = null

function enterArticle() {
  articleHovered.value = true
}

function leaveArticle() {
  articleHovered.value = false
}

onMounted(() => {
  article = tocRef.value?.closest('article') || null
  article?.addEventListener('mouseenter', enterArticle)
  article?.addEventListener('mouseleave', leaveArticle)
})

onUnmounted(() => {
  article?.removeEventListener('mouseenter', enterArticle)
  article?.removeEventListener('mouseleave', leaveArticle)
})

watch(() => route.path, () => {
  expanded.value = false
  hovered.value = false
  articleHovered.value = false
  focused.value = false
})

function onFocusOut(event: FocusEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null))
    focused.value = false
}

function close(event: KeyboardEvent) {
  const button = (event.currentTarget as HTMLElement).querySelector('button')
  button?.focus()
  expanded.value = false
  hovered.value = false
  articleHovered.value = false
  focused.value = false
}
</script>

<template>
  <nav
    ref="tocRef"
    class="article-toc"
    :class="{ 'is-visible': visible }"
    aria-label="文章目录"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="onFocusOut"
    @keydown.esc.prevent="close"
  >
    <button
      class="toc-toggle"
      type="button"
      aria-label="展开或收起文章目录"
      aria-controls="article-toc-list"
      :aria-expanded="visible"
      @click="expanded = !expanded; hovered = false; focused = false"
    >
      <span class="i-ri-menu-2-fill" aria-hidden="true" />
    </button>
    <ol id="article-toc-list" class="toc-list">
      <li v-for="heading in headings" :key="heading.id" :style="{ paddingLeft: `${(heading.level - 2) * 0.8}rem` }">
        <RouterLink :to="{ path: route.path, query: route.query, hash: `#${heading.id}` }">
          {{ heading.text }}
        </RouterLink>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.article-toc {
  display: none;
  position: fixed;
  top: calc(4rem + 40px);
  left: 1.75rem;
  z-index: 20;
  width: min(260px, calc((100vw - 680px) / 2 - 48px));
  max-height: calc(100dvh - 110px);
  flex-direction: column;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--fg);
}
.toc-toggle {
  display: grid;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: var(--c-bg);
  color: var(--fg-light);
  font-size: 18px;
  cursor: pointer;
}
.toc-list {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  margin: 4px 0 0;
  padding: 0 8px 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}
.is-visible .toc-list {
  opacity: 0.75;
  pointer-events: auto;
}
.is-visible .toc-toggle {
  color: var(--fg);
}
.toc-list > li {
  margin: 8px 0 0;
  list-style: none;
  line-height: 1.5;
}
.toc-list > li::before {
  display: none;
}
.toc-list a {
  display: block;
  padding: 3px 0;
  border: 0;
  font-weight: inherit;
  color: inherit;
  opacity: 0.75;
  overflow-wrap: anywhere;
  transition: opacity 0.2s ease;
}
.toc-list a:hover,
.toc-list a:focus-visible {
  opacity: 1;
  border: 0;
}
.toc-toggle:focus-visible,
.toc-list a:focus-visible {
  outline: 2px solid var(--fg-light);
  outline-offset: 2px;
}
@media (min-width: 1200px) {
  .article-toc {
    display: flex;
  }
}
@media (prefers-reduced-motion: reduce) {
  .toc-list,
  .toc-list a {
    transition: none;
  }
}
</style>
