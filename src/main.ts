import type { RouterScrollBehavior } from 'vue-router'
import { ViteSSG } from 'vite-ssg'
import { nextTick } from 'vue'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import 'virtual:uno.css'
import '@/assets/css/main.css'
import '@/assets/css/dark.css'
import '@/assets/css/prose.css'

import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-class.css'
import 'markdown-it-github-alerts/styles/github-base.css'

const scrollBehavior: RouterScrollBehavior = async (to, _from, savedPosition) => {
  if (savedPosition)
    return savedPosition

  if (to.hash && typeof document !== 'undefined') {
    await nextTick()
    const hash = to.hash.slice(1)
    let id = hash
    try {
      id = decodeURIComponent(hash)
    }
    catch {
      // Literal percent signs are valid in the existing heading IDs.
    }
    const el = document.getElementById(hash) || document.getElementById(id)
    if (el) {
      return {
        el,
        top: Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      }
    }
    return false
  }

  return { left: 0, top: 0 }
}

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior,
  },
)
