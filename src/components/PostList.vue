<script setup lang="ts">
import type { Post } from '@/types'
import { formatListDate } from '@/logics'

const props = defineProps<{
  type?: string
  posts?: Post[]
  extra?: Post[]
}>()

const router = useRouter()
const routes: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter?.date)
  .filter((i) => {
    if (i.path.endsWith('.html'))
      return false

    const types = (i.meta.frontmatter?.type || 'blog').split('+')
    return props.type ? types.includes(props.type) : true
  })
  .map(i => ({
    path: i.meta.frontmatter?.redirect || i.path,
    title: i.meta.frontmatter?.title || i.path,
    date: i.meta.frontmatter!.date!,
  }))
const posts = computed(() =>
  [...(props.posts || routes), ...(props.extra || [])]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
)
</script>

<template>
  <ul class="list-none not-prose">
    <li v-if="!posts.length" py2 op50 before:hidden class="!pl-0">
      { nothing here yet }
    </li>
    <template v-else>
      <li
        v-for="post in posts"
        :key="post.path"
        class="min-w-0 !pl-0 before:hidden text-gray-500 dark:text-inherit hover:border-b-black hover:text-black dark:hover:border-b-white dark:hover:text-white"
      >
        <RouterLink :to="post.path" class="item no-underline">
          <time :datetime="new Date(post.date).toISOString()" class="text-3.5 opacity-50 mr-2 uppercase tracking-tighter inline lt-sm:block">
            {{ formatListDate(post.date) }}
          </time>
          <span class="text-4.5">{{ post.title }}</span>
        </RouterLink>
      </li>
    </template>
  </ul>
</template>
