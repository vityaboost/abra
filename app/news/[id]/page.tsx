// app/news/[id]/page.tsx
import fs from 'fs'
import path from 'path'
import { format, parseISO, isValid } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { remark } from 'remark'
import html from 'remark-html'
import { getNewsById, getAllNews } from '@/lib/news'
import { notFound } from 'next/navigation'

// статические пути для SSG
export function generateStaticParams() {
  return getAllNews().map((item) => ({ id: item.id }))
}

export default async function NewsDetail({
  params: { id },
}: {
  params: { id: string }
}) {
  // берём полный объект (включая content)
  const news = getNewsById(id)
  if (!news) {
    notFound()
  }

  // превращаем MDX-контент в чистый HTML
  const processed = await remark().use(html).process(news.content)
  const contentHtml = processed.toString()

  // безопасно парсим дату
  let date = parseISO(news.publishedAt)
  if (!isValid(date)) date = new Date()

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link href="/news" className="inline-block text-blue-600 underline mb-4">
        ← Back to news
      </Link>

      {news.imageUrl && (
        <div className="w-full h-64 relative mb-6">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
      <p className="text-gray-500 mb-4">
        {format(date, 'dd MMMM yyyy')}
      </p>

      {/* вот она — вёрстка основного текста */}
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  )
}
