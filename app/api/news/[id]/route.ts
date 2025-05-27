// app/api/news/[id]/route.ts
import { NextResponse } from 'next/server';
import { getNewsById } from '@/lib/news';

export function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const news = getNewsById(params.id);
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
}
