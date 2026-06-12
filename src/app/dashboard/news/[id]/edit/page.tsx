import PageContainer from '@/components/layout/page-container';
import { NewsBuilder } from '@/features/news/components/news-builder';

export const metadata = {
  title: 'Dashboard: Sửa tin tức'
};

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageContainer
      pageTitle='Sửa tin tức'
      pageDescription='Cập nhật nội dung bài viết bằng page builder.'
    >
      <NewsBuilder articleId={id} />
    </PageContainer>
  );
}

