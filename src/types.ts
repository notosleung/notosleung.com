export interface Post {
  path: string
  title: string
  date: string | Date
  description?: string
}

export interface Frontmatter {
  title?: string
  description?: string
  date?: string | Date
  type?: string
  redirect?: string
  [key: string]: unknown
}
