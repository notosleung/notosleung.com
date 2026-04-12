<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="prose mt-8">
    <span class="font-mono op50 w-fit">&gt; </span>
    <RouterLink
      class="font-mono op50 hover:op75 w-fit"
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      v-text="'cd ..'"
    />
  </div>
</template>

<style scoped>
/* a {
  color: rgba(0, 0, 0, 0.5) !important;
  font-size: 1rem;
}
a:hover {
  color: rgba(0, 0, 0, 0.75) !important;
}

html.dark a {
  color: rgba(255, 255, 255, 0.5) !important;
}
html.dark a:hover {
  color: rgba(255, 255, 255, 0.75) !important;
} */
</style>
