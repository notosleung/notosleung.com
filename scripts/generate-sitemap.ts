import path from 'node:path'
import fs from 'fs-extra'

const SITE_URL = 'https://notosleung.com'
const WINDOWS_SEPARATOR_REGEX = /\\/g
const HTML_EXTENSION_REGEX = /\.html$/

async function collectHtmlFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? collectHtmlFiles(target) : [target]
  }))

  return files.flat()
}

function toRoute(file: string) {
  const relativePath = path.relative('dist', file).replace(WINDOWS_SEPARATOR_REGEX, '/')
  if (relativePath === 'index.html')
    return '/'

  return `/${relativePath.replace(HTML_EXTENSION_REGEX, '')}`
}

async function run() {
  const files = await collectHtmlFiles('dist')
  const routes = files
    .filter(file => file.endsWith('.html'))
    .map(toRoute)
    .filter(route => route !== '/404')
    .sort()

  const urls = routes
    .map(route => `  <url><loc>${new URL(route, SITE_URL).href}</loc></url>`)
    .join('\n')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  await fs.writeFile('dist/sitemap.xml', sitemap)
}

run()
