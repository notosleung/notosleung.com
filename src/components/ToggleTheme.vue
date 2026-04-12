<script setup lang="ts">
import { toggleDark } from '@/logics'

// const isDarkStore = useIsDarkStore()
</script>

<template>
  <div title="ToggleTheme" @click="toggleDark">
    <slot />
  </div>
</template>
