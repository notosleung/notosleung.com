<script setup lang="ts">
const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <div class="footer pt-10">
    <p class="footer-text">
      <span class="copyright-text inline lt-sm:block">2025<span v-if="currentYear > 2025">-PRESENT</span> &copy;Notos Leung. </span>
      <a class="b-b b-b-solid b-black dark:b-white !b-op30 !hover:b-op80 transition duration-300" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
        CC BY-NC-SA 4.0
      </a>
    </p>
  </div>
</template>

<style scoped>
.footer-text {
  text-align: start;
  font-size: 0.9rem;
}
</style>
