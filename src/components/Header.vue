<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { toggleDark } from '@/logics'

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const { y: scroll } = useWindowScroll()
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo" aria-label="返回首页" />
    <nav class="menu">
      <RouterLink to="/posts" class="menu-item" aria-label="博客文章列表">
        <span class="lt-md:!hidden">Blog</span>
        <span class="menu-icon md:!hidden" aria-hidden="true" i-ri-article-line />
      </RouterLink>
      <a
        href="https://github.com/notosleung"
        target="_blank"
        rel="noopener"
        class="menu-item"
        aria-label="访问 Notos Leung 的 GitHub"
      >
        <span class="menu-icon" aria-hidden="true" i-ri-github-line />
      </a>
      <a
        href="/feed.xml"
        target="_blank"
        rel="noopener"
        class="menu-item"
        aria-label="订阅 Notos Leung 的 RSS"
      >
        <span class="menu-icon" aria-hidden="true" i-la-rss-square style="font-size: 1.25rem;" />
      </a>
      <button type="button" class="menu-item" aria-label="切换明暗主题" title="切换明暗主题" @click="toggleDark">
        <span class="menu-icon" aria-hidden="true" i-ri-sun-line dark:i-ri-moon-line />
      </button>
    </nav>
    <button
      type="button"
      title="返回顶部"
      aria-label="返回顶部"
      fixed right-3 bottom-3 w-11 h-11 hover:op100 rounded-full text-4
      hover-bg-hex-8883 bg-transparent transition duration-300 z-100 print:hidden
      border-none cursor-pointer
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <span aria-hidden="true" i-ri-arrow-up-line />
    </button>
  </header>
</template>

<style scoped>
button:focus-visible,
a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
</style>
