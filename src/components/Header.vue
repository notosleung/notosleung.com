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
  <div class="header">
    <RouterLink to="/" class="logo" />
    <nav class="menu">
      <RouterLink to="/posts" class="font-bold">
        <span class="lt-md:!hidden">Blog</span>
        <div class="md:!hidden" i-ri-article-line />
      </RouterLink>
      <a href="https://github.com/notosleung" target="_blank" class="cursor-pointer">
        <div i-ri-github-line />
      </a>
      <a class="cursor-pointer" @click="toggleDark">
        <div i-ri-sun-line dark:i-ri-moon-line />
      </a>
    </nav>
    <button
      title="Scroll to top"
      fixed right-3 bottom-3 w-10 h-10 hover:op100 rounded-full text-4
      hover-bg-hex-8883 bg-transparent transition duration-300 z-100 print:hidden
      border-none outline-none cursor-pointer
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line />
    </button>
  </div>
</template>

<style scoped>

</style>
