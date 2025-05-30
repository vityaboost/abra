// app/news/page.tsx
import NewsList from '@/components/news/NewsList'
import { getAllNews } from '@/lib/news'
import { OfferTrigger } from '@/components/OfferTrigger'
import { NewsItem } from '@/types/news'

export default function NewsPage() {
  const all: NewsItem[] = getAllNews()
  const initialNews = all.slice(0, 10)

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Latest Sports News</h1>

      {/* Перед лентой новостей показываем другую гифку */}
      <OfferTrigger
        eventId="newsPage"
        mode="inline"
        bannerSrc="/bann4.jpg"
        width={720}
        height={160}
      />

      <NewsList initialNews={initialNews} />
    </div>
  )
}
