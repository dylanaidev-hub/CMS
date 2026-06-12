import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { NewsListing } from '@/features/news/components/news-listing';

export const metadata = {
  title: 'Dashboard: Tin tức'
};

export default function NewsPage() {
  return (
    <PageContainer
      pageTitle='Tin tức'
      pageDescription='Quản lý các bài tin tức hiển thị trên landing page.'
      pageHeaderAction={
        <Button asChild>
          <Link href='/dashboard/news/new'>
            <Icons.add />
            Tạo mới
          </Link>
        </Button>
      }
    >
      <NewsListing />
    </PageContainer>
  );
}

