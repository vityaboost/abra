// lib/news.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { NewsItem } from '@/types/news'

const NEWS_DIR = path.join(process.cwd(), 'content', 'news')

export function getAllNews(): NewsItem[] {
  const files = fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const filePath = path.join(NEWS_DIR, filename)
      const source = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(source)
      const id = filename.replace(/\.mdx$/, '')

      return {
        id,
        title: String(data.title || ''),
        summary: String(data.summary || ''),
        publishedAt: String(data.publishedAt || ''),
        imageUrl: String(data.imageUrl || ''),
      }
    })
    .sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
}

/** Возвращает всю запись вместе с MDX-контентом */
export function getNewsById(id: string): (NewsItem & { content: string }) | null {
  const filePath = path.join(NEWS_DIR, `${id}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const source = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(source)

  return {
    id,
    title: String(data.title || ''),
    summary: String(data.summary || ''),
    publishedAt: String(data.publishedAt || ''),
    imageUrl: String(data.imageUrl || ''),
    content,         // ← вот оно!
  }
}
