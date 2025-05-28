// app/news/[id]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getNewsById, getAllNews } from '@/lib/news';
import { remark } from 'remark';
import html from 'remark-html';

// Чтобы SSG знал все динамические пути:
export function generateStaticParams() {
  const all = getAllNews();
  return all.map(item => ({ id: item.id }));
}

// Эта страница — серверный компонент
export default async function NewsDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  let news;
  try {
    news = getNewsById(id);
  } catch {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-red-600">Новость не найдена.</p>
        <Link href="/news" className="text-blue-600 underline">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  // Преобразуем MDX-контент в чистый HTML
  const processed = await remark().use(html).process(news.content);
  const contentHtml = processed.toString();

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
        {format(new Date(news.publishedAt), 'dd MMMM yyyy')}
      </p>

      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
