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
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter.date)
  .filter(i => !i.path.endsWith('.html') && (i.meta.frontmatter.type || 'blog').split('+').includes(props.type))
  .map(i => ({
    path: i.meta.frontmatter.redirect || i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
  }))
console.log(routes)
const posts = computed(() =>
  [...(props.posts || routes), ...(props.extra || [])]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
)
</script>

<template>
  <ul class="list-none not-prose">
    <template v-if="!posts.length">
      <div py2 op50>
        { nothing here yet }
      </div>
    </template>
    <template v-for="post in posts" :key="post.path">
      <div class="min-w-0">
        <RouterLink :to="post.path" class="item no-underline">
          <li class="text-gray-500 dark:text-inherit hover:border-b-black hover:text-black dark:hover:border-b-white dark:hover:text-white">
            <span class="text-3.5 opacity-50 mr-2 uppercase tracking-tighter inline lt-sm:block">
              {{ formatListDate(post.date) }}
            </span>
            <span class="text-4.5">{{ post.title }}</span>
          </li>
        </RouterLink>
      </div>
    </template>
  </ul>
</template>
