import type { RouterScrollBehavior } from 'vue-router'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import 'virtual:uno.css'
import '@/assets/css/main.css'
import '@/assets/css/dark.css'
import '@/assets/css/prose.css'

import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-class.css'
import 'markdown-it-github-alerts/styles/github-base.css'

const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (savedPosition)
    return savedPosition

  if (to.hash)
    return { el: to.hash, behavior: 'smooth' }

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
