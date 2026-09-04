import path from 'node:path'
import fs from 'fs-extra'
import matter from 'gray-matter'

const SITE_URL = 'https://notosleung.com'
const POSTS_DIRECTORY = 'pages/posts'
const OUTPUT_FILE = 'dist/feed.xml'
const MARKDOWN_EXTENSION_REGEX = /\.md$/
const MARKDOWN_LINK_REGEX = /!?\[([^\]]*)\]\([^)]*\)/g
const MARKDOWN_SYNTAX_REGEX = /[#>*_~`|-]+/g
const HTML_TAG_REGEX = /<[^>]*>/g
const WHITESPACE_REGEX = /\s+/g
const AMPERSAND_REGEX = /&/g
const LESS_THAN_REGEX = /</g
const GREATER_THAN_REGEX = />/g
const DOUBLE_QUOTE_REGEX = /"/g
const SINGLE_QUOTE_REGEX = /'/g
const MAX_DESCRIPTION_LENGTH = 240

interface FeedItem {
  title: string
  link: string
  date: Date
  description: string
}

function escapeXml(value: string) {
  return value
    .replace(AMPERSAND_REGEX, '&amp;')
    .replace(LESS_THAN_REGEX, '&lt;')
    .replace(GREATER_THAN_REGEX, '&gt;')
    .replace(DOUBLE_QUOTE_REGEX, '&quot;')
    .replace(SINGLE_QUOTE_REGEX, '&apos;')
}

function createDescription(content: string) {
  const description = content
    .replace(MARKDOWN_LINK_REGEX, '$1')
    .replace(HTML_TAG_REGEX, '')
    .replace(MARKDOWN_SYNTAX_REGEX, ' ')
    .replace(WHITESPACE_REGEX, ' ')
    .trim()

  if (description.length <= MAX_DESCRIPTION_LENGTH)
    return description

  return `${description.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}…`
}

async function collectPosts(): Promise<FeedItem[]> {
  const files = await fs.readdir(POSTS_DIRECTORY)

  const posts = await Promise.all(files
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(async (file) => {
      const source = await fs.readFile(path.join(POSTS_DIRECTORY, file), 'utf8')
      const { data, content } = matter(source)

      if (!data.title || !data.date)
        return null

      const route = data.redirect || `/posts/${file.replace(MARKDOWN_EXTENSION_REGEX, '')}`
      const date = new Date(data.date)
      if (Number.isNaN(date.getTime()))
        throw new TypeError(`Invalid date in ${file}: ${String(data.date)}`)

      return {
        title: String(data.title),
        link: new URL(route, SITE_URL).href,
        date,
        description: String(data.description || createDescription(content)),
      }
    }))

  return posts
    .filter((post): post is FeedItem => post !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

async function run() {
  const posts = await collectPosts()
  const lastBuildDate = posts[0]?.date || new Date()
  const items = posts.map(post => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.link)}</link>
      <guid isPermaLink="true">${escapeXml(post.link)}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`).join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Notos Leung</title>
    <link>${SITE_URL}/</link>
    <description>Keep It Simple &amp; Stupid.</description>
    <language>zh-CN</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  await fs.ensureDir(path.dirname(OUTPUT_FILE))
  await fs.writeFile(OUTPUT_FILE, feed)
}

run()
