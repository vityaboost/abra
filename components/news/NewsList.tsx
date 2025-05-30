// components/NewsList.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import NewsCard from './NewsCard';
import LoadingSpinner from './LoadingSpinner';
import { NewsItem } from '@/types/news';

interface Props { initialNews: NewsItem[] }

export default function NewsList({ initialNews }: Props) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page === 1) return;
    setLoading(true);
    fetch(`/api/news?page=${page}&limit=10`)
      .then(res => res.json())
      .then(data => {
        setNews(prev => [...prev, ...data.items]);
        setHasMore(data.items.length === 10);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + 1);
    });
    obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [hasMore]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Сетка содержит только реальные карточки новостей */}
      <div className="grid gap-6 md:grid-cols-2">
        {news.map(item => (
          <NewsCard key={item.id} {...item} />
        ))}
      </div>

      {/* Триггер для бесконечного скролла — вынесен за пределы грида */}
      <div ref={loadMoreRef} className="h-1" />

      {loading && <LoadingSpinner />}

      {!hasMore && (
        <p className="text-center mt-4 text-gray-500">
          No more
        </p>
      )}
    </div>
  );
}
