// components/NewsCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { NewsItem } from '@/types/news';

export default function NewsCard({ id, title, summary, publishedAt, imageUrl }: NewsItem) {
  return (
    <Link href={`/news/${id}`} className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition p-4">
      <div className="w-full h-48 relative mb-4">
        <Image src={imageUrl} alt={title} fill className="object-cover rounded" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-2">
        {format(new Date(publishedAt), 'dd MMM yyyy')}
      </p>
      <p className="text-gray-700">{summary}</p>
    </Link>
  );
}
