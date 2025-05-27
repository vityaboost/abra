// app/news/page.tsx
 import NewsList from '../../components/news/NewsList'
 import { getAllNews } from '../../lib/news'
 import { NewsItem } from '../../types/news'

export default function NewsPage() {
  // load all news items from the filesystem
  const all: NewsItem[] = getAllNews();

  // take the first 10 for the initial page
  const initialNews = all.slice(0, 10);

  // render the client-side NewsList, passing in the initial batch
  return <NewsList initialNews={initialNews} />;
}
