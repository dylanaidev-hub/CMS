'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Icons } from '@/components/icons';
import { deleteNewsArticle, getNewsArticles, type NewsArticle } from '../lib/news-store';

export function NewsListing() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  const loadArticles = () => {
    setArticles(getNewsArticles());
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = (id: string) => {
    deleteNewsArticle(id);
    loadArticles();
    toast.success('Đã xóa bài viết');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách tin tức</CardTitle>
        <CardDescription>Quản lý các bài viết hiển thị trên landing page.</CardDescription>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className='text-muted-foreground rounded-md border py-10 text-center text-sm'>
            Chưa có bài viết nào.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead className='w-[180px] text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className='max-w-[420px] whitespace-normal'>
                    <div className='font-medium'>{article.title}</div>
                    <div className='text-muted-foreground line-clamp-1 text-xs'>{article.excerpt}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                      {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.publishedAt}</TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-2'>
                      <Button asChild variant='outline' size='sm'>
                        <Link href={`/dashboard/news/${article.id}/edit`}>
                          <Icons.edit />
                          Sửa
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='outline' size='sm'>
                            <Icons.trash />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bài viết "{article.title}" sẽ bị xóa khỏi CMS và landing page.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(article.id)}>
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

