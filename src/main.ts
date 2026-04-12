import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { setupRouterScroller } from './plugins/vue-router-better-scroller'

// import './assets/styles/common.css'
// import './assets/styles/theme-dark.css'
// import './assets/styles/post.css'
import 'virtual:uno.css'
import '@/assets/css/main.css'
import '@/assets/css/dark.css'
import '@/assets/css/prose.css'

import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-class.css'
import 'markdown-it-github-alerts/styles/github-base.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
  },
  ({ app, initialState, router }) => {
    const pinia = createPinia()
    app.use(pinia)

    // 客户端激活时恢复状态
    if (!import.meta.env.SSR) {
      pinia.state.value = initialState.pinia || {}

      setupRouterScroller(router, {
        selectors: {
          async html({ savedPosition }) {
            // 只等待 savedPosition 以上的图片加载完
            // 这样页面高度稳定后就能准确恢复位置
            await new Promise((resolve) => {
              // allImages: 页面上所有图片
              const allImages = document.querySelectorAll('img')
              if (allImages.length === 0) {
                resolve(undefined)
                return
              }

              // relevantImages: 存放目标位置以上的图片
              const relevantImages: HTMLImageElement[] = []
              const targetY = savedPosition?.top ?? 0

              // 找出目标位置以上的所有图片，push 到 relevantImages 中
              allImages.forEach((img) => {
                const rect = img.getBoundingClientRect()
                if (rect.top + window.scrollY <= targetY) {
                  relevantImages.push(img as HTMLImageElement)
                }
              })

              if (relevantImages.length === 0) {
                resolve(undefined)
                return
              }

              let loaded = 0
              let timeout: ReturnType<typeof setTimeout> | null = null

              const onImageLoad = () => {
                loaded++
                if (loaded === relevantImages.length) {
                  // eslint-disable-next-line ts/no-use-before-define
                  cleanup()
                  resolve(undefined)
                }
              }

              const cleanup = () => {
                relevantImages.forEach((img) => {
                  img.removeEventListener('load', onImageLoad)
                  img.removeEventListener('error', onImageLoad)
                })
                if (timeout)
                  clearTimeout(timeout)
              }

              relevantImages.forEach((img) => {
                if (img.complete) {
                  onImageLoad()
                }
                else {
                  img.addEventListener('load', onImageLoad)
                  img.addEventListener('error', onImageLoad)
                }
              })

              // 最多等 500ms
              timeout = setTimeout(() => {
                cleanup()
                resolve(undefined)
              }, 500)
            })

            return true
          },
        },
        behavior: 'auto',
      })
    }
    else {
      initialState.pinia = pinia.state.value
    }
  },
)
