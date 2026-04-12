import type { DefineComponent } from 'vue'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: any
  }
}

declare module '*.md' {
  const component: DefineComponent<object, object, any>
  export default component
}
