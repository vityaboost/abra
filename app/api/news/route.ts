// app/api/news/route.ts
import { NextResponse } from 'next/server';
import { getAllNews } from '@/lib/news';

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '10');
  const all = getAllNews();
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit);
  return NextResponse.json({ items });
}
