import { resolve } from 'node:path'
import MarkdownItShiki from '@shikijs/markdown-it'
import { transformerNotationDiff, transformerNotationHighlight, transformerNotationWordHighlight } from '@shikijs/transformers'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import fs from 'fs-extra'
import matter from 'gray-matter'
import anchor from 'markdown-it-anchor'
import GitHubAlerts from 'markdown-it-github-alerts'
// @ts-expect-error 无类型定义
import LinkAttributes from 'markdown-it-link-attributes'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

const HTTPS_REGEX = /^https?:\/\// // 以 http:// 或 https:// 开头的链接
const BLANK_REGEX = /\s+/g // 仅包含空白字符的字符串

// https://vite.dev/config/
export default defineConfig({

  base: '/',
  plugins: [
    UnoCSS(),
    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      // dts: 'src/typed-router.d.ts',
      extendRoute(route) {
        const path = route.components.get('default')
        if (!path)
          return

        if (path.endsWith('.md')) {
          const { data } = matter(fs.readFileSync(path, 'utf-8'))
          route.addToMeta({
            frontmatter: data,
          })
        }
      },
    }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      wrapperComponent: 'MdWrapper',
      wrapperClasses: 'prose',
      headEnabled: true,
      exportFrontmatter: false,
      exposeFrontmatter: false,
      exposeExcerpt: false,
      markdownItOptions: {
        html: true,
        typographer: true,
        quotes: '""\'\'',
      },
      async markdownItSetup(md) {
        md.use(await MarkdownItShiki({
          themes: {
            dark: 'vitesse-dark',
            light: 'vitesse-light',
          },
          defaultColor: false,
          cssVariablePrefix: '--s-',
          transformers: [
            transformerTwoslash({
              explicitTrigger: true,
              renderer: rendererRich(),
            }),
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
          ],
        }))
        md.use(anchor, {
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            // placement: 'after',
          }),
          slugify: s => s.trim().toLowerCase().replace(BLANK_REGEX, '-'),
        })
        md.use(LinkAttributes, {
          matcher: (link: string) => HTTPS_REGEX.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
        md.use(GitHubAlerts)
        // 取得默认渲染逻辑
        const defaultRender = md.renderer.rules.image || function (tokens, idx, options, _env, self) {
          return self.renderToken(tokens, idx, options)
        }

        md.renderer.rules.image = (tokens, idx, options, env, self) => {
          const token = tokens[idx]

          // 注入 loading="lazy"
          token?.attrSet('loading', 'lazy')

          // 顺便可以注入 UnoCSS 的类名，统一图片样式
          token?.attrJoin('class', 'max-w-full h-auto')

          return defaultRender(tokens, idx, options, env, self)
        }
      },
      frontmatterPreprocess(frontmatter, options, id, defaults) {
        let head: any
        if (id.endsWith('pages/index.md')) {
          // index.md 时，自动处理 frontmatter 转换到 head
          head = defaults(frontmatter, options)
        }
        else {
          const title = `${frontmatter.title} - Notos Leung`
          // 非 index.md 时，不影响原 frontmatter 的情况下覆盖 title 字段，并处理转换到 head
          head = defaults({ ...frontmatter, title }, options)
        }
        return { head, frontmatter }
      },
    }),
    AutoImport({
      imports: [
        'vue',
        unheadVueComposablesImports,
        VueRouterAutoImports,
        '@vueuse/core',
      ],
    }),
    Components({
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        // 可添加 UI 库解析器，如 ElementPlus、Naive UI 等
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  // SSG 配置
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
})
