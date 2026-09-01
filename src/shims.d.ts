import type { DefineComponent } from 'vue'
import type { Frontmatter } from './types'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter?: Frontmatter
  }
}

declare module '*.md' {
  const component: DefineComponent<object, object, unknown>
  export default component
}
