import PageContainer from '@/components/layout/page-container';
import { NewsBuilder } from '@/features/news/components/news-builder';

export const metadata = {
  title: 'Dashboard: Tạo tin tức'
};

export default function NewNewsPage() {
  return (
    <PageContainer pageTitle='Tạo tin tức' pageDescription='Soạn nội dung bài viết bằng page builder.'>
      <NewsBuilder />
    </PageContainer>
  );
}

