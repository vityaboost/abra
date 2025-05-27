// lib/news.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NewsItem, NewsFull } from '@/types/news';

const newsDir = path.join(process.cwd(), 'content', 'news');

// Список всех новостей (без контента)
export function getAllNews(): NewsItem[] {
  const files = fs.readdirSync(newsDir);
  const items = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(newsDir, filename), 'utf8');
    const { data } = matter(raw);
    return {
      id: slug,
      title: data.title,
      summary: data.summary,
      publishedAt: data.publishedAt,
      imageUrl: data.imageUrl,
    };
  });
  return items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Получить одну новость вместе с контентом MDX
export function getNewsById(id: string): NewsFull {
  const fullPath = path.join(newsDir, `${id}.mdx`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  return {
    id,
    title: data.title,
    summary: data.summary,
    publishedAt: data.publishedAt,
    imageUrl: data.imageUrl,
    content,
  };
}
