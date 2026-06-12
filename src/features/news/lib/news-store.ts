'use client';

export type NewsStatus = 'draft' | 'published';
export type NewsBlockType = 'heading' | 'paragraph' | 'image' | 'quote';

export type NewsBlock = {
  id: string;
  type: NewsBlockType;
  content: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: NewsStatus;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  blocks: NewsBlock[];
};

const STORAGE_KEY = 'cms_news_articles';

export const defaultNewsArticles: NewsArticle[] = [
  {
    id: 'welcome-cms',
    title: 'Ra mat khu vuc quan ly tin tuc CMS',
    slug: 'ra-mat-khu-vuc-quan-ly-tin-tuc-cms',
    excerpt:
      'CMS da co khu vuc quan ly tin tuc voi danh sach bai viet, trang tao moi va trinh soan thao noi dung don gian.',
    status: 'published',
    coverImage:
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-06-12',
    updatedAt: '2026-06-12T00:00:00.000Z',
    blocks: [
      {
        id: 'block-1',
        type: 'heading',
        content: 'CMS tin tuc da san sang'
      },
      {
        id: 'block-2',
        type: 'paragraph',
        content:
          'Ban co the tao, chinh sua, xoa va xem truoc bai viet ngay trong dashboard. Cac bai da publish se hien thi tren landing page.'
      },
      {
        id: 'block-3',
        type: 'quote',
        content: 'Noi dung landing page gio co the duoc dieu khien truc tiep tu CMS.'
      }
    ]
  },
  {
    id: 'content-workflow',
    title: 'Quy trinh bien tap noi dung gon hon',
    slug: 'quy-trinh-bien-tap-noi-dung-gon-hon',
    excerpt:
      'Page builder dang block giup bien tap vien tao noi dung co cau truc ma khong can thao tac code.',
    status: 'published',
    coverImage:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-06-11',
    updatedAt: '2026-06-11T00:00:00.000Z',
    blocks: [
      {
        id: 'block-1',
        type: 'paragraph',
        content:
          'Moi block co the la tieu de, doan van, hinh anh hoac trich dan. Ban co the them bot block de lap ghep trang tin tuc.'
      }
    ]
  }
];

export function createNewsId() {
  return `news-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

export function getNewsArticles() {
  if (typeof window === 'undefined') {
    return defaultNewsArticles;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNewsArticles));
    return defaultNewsArticles;
  }

  try {
    return JSON.parse(stored) as NewsArticle[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNewsArticles));
    return defaultNewsArticles;
  }
}

export function saveNewsArticles(articles: NewsArticle[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  window.dispatchEvent(new Event('cms-news-updated'));
}

export function getNewsArticle(id: string) {
  return getNewsArticles().find((article) => article.id === id);
}

export function upsertNewsArticle(article: NewsArticle) {
  const articles = getNewsArticles();
  const index = articles.findIndex((item) => item.id === article.id);
  const nextArticles =
    index >= 0
      ? articles.map((item) => (item.id === article.id ? article : item))
      : [article, ...articles];

  saveNewsArticles(nextArticles);
}

export function deleteNewsArticle(id: string) {
  saveNewsArticles(getNewsArticles().filter((article) => article.id !== id));
}

