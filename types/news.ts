// types/news.ts
export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    publishedAt: string;
    imageUrl: string;
  }
  
  export interface NewsFull extends NewsItem {
    content: string;
  }
  