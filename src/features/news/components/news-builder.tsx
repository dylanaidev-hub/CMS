'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { NewsArticleContent } from './news-renderer';
import {
  createNewsId,
  createSlug,
  getNewsArticle,
  type NewsArticle,
  type NewsBlock,
  type NewsBlockType,
  upsertNewsArticle
} from '../lib/news-store';

type SlashMenuState = {
  blockId: string;
  top: number;
  left: number;
} | null;

type BubbleMenuState = {
  top: number;
  left: number;
} | null;

const blockOptions: Array<{
  type: NewsBlockType;
  label: string;
  description: string;
  icon: keyof typeof Icons;
}> = [
  {
    type: 'paragraph',
    label: 'Doan van',
    description: 'Van ban noi dung thong thuong',
    icon: 'post'
  },
  {
    type: 'heading',
    label: 'Tieu de',
    description: 'Tieu de lon trong bai viet',
    icon: 'text'
  },
  {
    type: 'quote',
    label: 'Trich dan',
    description: 'Doan nhan manh dang quote',
    icon: 'page'
  },
  {
    type: 'image',
    label: 'Hinh anh',
    description: 'Chen anh bang URL',
    icon: 'media'
  }
];

function createBlock(type: NewsBlockType = 'paragraph', content = ''): NewsBlock {
  return {
    id: createNewsId(),
    type,
    content
  };
}

function createEmptyArticle(): NewsArticle {
  const today = new Date().toISOString().slice(0, 10);

  return {
    id: createNewsId(),
    title: '',
    slug: '',
    excerpt: '',
    status: 'draft',
    coverImage: '',
    publishedAt: today,
    updatedAt: new Date().toISOString(),
    blocks: [createBlock('paragraph')]
  };
}

function htmlToText(value: string) {
  if (typeof window === 'undefined') {
    return value.replace(/<[^>]*>/g, '').trim();
  }

  const element = window.document.createElement('div');
  element.innerHTML = value;
  return element.textContent?.trim() ?? '';
}

function getEditableClass(type: NewsBlockType) {
  const base =
    'min-h-8 w-full rounded-md px-1 py-1 outline-none transition-colors focus:bg-muted/40 [&:empty:before]:text-muted-foreground [&:empty:before]:content-[attr(data-placeholder)]';

  if (type === 'heading') {
    return `${base} text-2xl font-semibold tracking-tight`;
  }

  if (type === 'quote') {
    return `${base} border-l-4 pl-4 text-lg italic`;
  }

  return `${base} text-base leading-7`;
}

function placeCaretAtEnd(element: HTMLElement) {
  element.focus();
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function NewsBuilder({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const paperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const excerptRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [slashMenu, setSlashMenu] = useState<SlashMenuState>(null);
  const [bubbleMenu, setBubbleMenu] = useState<BubbleMenuState>(null);
  const [article, setArticle] = useState<NewsArticle>(() => {
    if (!articleId) {
      return createEmptyArticle();
    }

    return getNewsArticle(articleId) ?? createEmptyArticle();
  });

  const isEditing = Boolean(articleId);

  const previewArticle = useMemo(
    () => ({
      ...article,
      title: article.title || 'Tieu de bai viet',
      excerpt: article.excerpt || 'Mo ta ngan cua bai viet se hien thi o day.',
      slug: article.slug || createSlug(article.title || 'bai-viet-moi')
    }),
    [article]
  );

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !paperRef.current) {
        setBubbleMenu(null);
        return;
      }

      const range = selection.getRangeAt(0);
      if (!paperRef.current.contains(range.commonAncestorContainer)) {
        setBubbleMenu(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) {
        setBubbleMenu(null);
        return;
      }

      setBubbleMenu({
        top: Math.max(rect.top - 44, 8),
        left: rect.left + rect.width / 2
      });
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const updateArticle = <K extends keyof NewsArticle>(key: K, value: NewsArticle[K]) => {
    setArticle((current) => ({
      ...current,
      [key]: value,
      slug: key === 'title' && !current.slug ? createSlug(String(value)) : current.slug
    }));
  };

  const updateBlock = (id: string, patch: Partial<NewsBlock>) => {
    setArticle((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.id === id ? { ...block, ...patch } : block))
    }));
  };

  const addBlockAfter = (blockId: string, type: NewsBlockType = 'paragraph') => {
    const newBlock = createBlock(type);

    setArticle((current) => {
      const index = current.blocks.findIndex((block) => block.id === blockId);
      if (index === -1) {
        return { ...current, blocks: [...current.blocks, newBlock] };
      }

      return {
        ...current,
        blocks: [
          ...current.blocks.slice(0, index + 1),
          newBlock,
          ...current.blocks.slice(index + 1)
        ]
      };
    });

    window.setTimeout(() => {
      const element = blockRefs.current[newBlock.id];
      if (element) {
        placeCaretAtEnd(element);
      }
    }, 0);
  };

  const removeBlock = (id: string) => {
    setArticle((current) => ({
      ...current,
      blocks: current.blocks.length > 1 ? current.blocks.filter((block) => block.id !== id) : current.blocks
    }));
  };

  const openSlashMenu = (blockId: string) => {
    const element = blockRefs.current[blockId];
    const rect = element?.getBoundingClientRect();

    setSlashMenu({
      blockId,
      top: rect ? rect.bottom + 8 : 220,
      left: rect ? rect.left + 8 : 320
    });
  };

  const selectSlashBlock = (type: NewsBlockType) => {
    if (!slashMenu) {
      return;
    }

    updateBlock(slashMenu.blockId, {
      type,
      content: type === 'image' ? '' : ''
    });
    setSlashMenu(null);

    window.setTimeout(() => {
      const element = blockRefs.current[slashMenu.blockId];
      if (element) {
        element.innerHTML = '';
        placeCaretAtEnd(element);
      }
    }, 0);
  };

  const runInlineCommand = (command: 'bold' | 'italic') => {
    document.execCommand(command);
    setBubbleMenu(null);

    const selectedBlockId = article.blocks.find((block) => {
      const element = blockRefs.current[block.id];
      const selection = window.getSelection();
      if (!element || !selection || selection.rangeCount === 0) {
        return false;
      }
      return element.contains(selection.anchorNode);
    })?.id;

    if (selectedBlockId) {
      const element = blockRefs.current[selectedBlockId];
      updateBlock(selectedBlockId, { content: element?.innerHTML ?? '' });
    }
  };

  const handleBlockKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, block: NewsBlock) => {
    if (event.key === '/') {
      openSlashMenu(block.id);
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey && block.type !== 'quote') {
      event.preventDefault();
      addBlockAfter(block.id, 'paragraph');
      return;
    }

    if (event.key === 'Backspace' && htmlToText(block.content) === '' && article.blocks.length > 1) {
      event.preventDefault();
      removeBlock(block.id);
    }
  };

  const handleSave = () => {
    const title = titleRef.current?.textContent?.trim() || article.title.trim();
    const excerpt = excerptRef.current?.textContent?.trim() || article.excerpt.trim();
    const blocks = article.blocks.map((block) => {
      if (block.type === 'image') {
        return block;
      }

      return {
        ...block,
        content: blockRefs.current[block.id]?.innerHTML ?? block.content
      };
    });
    const hasContent = blocks.some((block) => htmlToText(block.content));

    if (!title) {
      toast.error('Vui long nhap tieu de bai viet');
      return;
    }

    if (!excerpt) {
      toast.error('Vui long nhap mo ta ngan');
      return;
    }

    if (!hasContent) {
      toast.error('Vui long nhap noi dung bai viet');
      return;
    }

    const nextArticle = {
      ...article,
      title,
      excerpt,
      blocks,
      slug: article.slug || createSlug(title),
      updatedAt: new Date().toISOString()
    };

    upsertNewsArticle(nextArticle);
    toast.success(isEditing ? 'Da cap nhat bai viet' : 'Da tao bai viet');
    router.push('/dashboard/news');
  };

  return (
    <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]'>
      <div className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-3 py-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Select
              value={article.status}
              onValueChange={(value) => updateArticle('status', value as NewsArticle['status'])}
            >
              <SelectTrigger className='h-8 w-[130px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='draft'>Ban nhap</SelectItem>
                <SelectItem value='published'>Xuat ban</SelectItem>
              </SelectContent>
            </Select>
            <Input
              aria-label='Ngay dang'
              className='h-8 w-[150px]'
              type='date'
              value={article.publishedAt}
              onChange={(event) => updateArticle('publishedAt', event.target.value)}
            />
          </div>
          <div className='flex gap-2'>
            <Button asChild variant='outline' size='sm'>
              <Link href='/dashboard/news'>Huy</Link>
            </Button>
            <Button size='sm' onClick={handleSave}>
              Luu bai viet
            </Button>
          </div>
        </div>

        <div ref={paperRef} className='relative mx-auto max-w-4xl rounded-md border bg-background shadow-sm'>
          <div className='min-h-[760px] px-8 py-10 md:px-14 md:py-12'>
            <div
              ref={(node) => {
                titleRef.current = node;
                if (node && node.dataset.ready !== 'true') {
                  node.textContent = article.title;
                  node.dataset.ready = 'true';
                }
              }}
              contentEditable
              suppressContentEditableWarning
              data-placeholder='Tieu de tin tuc'
              className='mb-4 min-h-12 outline-none text-4xl font-semibold tracking-tight [&:empty:before]:text-muted-foreground [&:empty:before]:content-[attr(data-placeholder)]'
              onInput={(event) =>
                updateArticle('title', (event.currentTarget.textContent ?? '').trimStart())
              }
            />
            <div
              ref={(node) => {
                excerptRef.current = node;
                if (node && node.dataset.ready !== 'true') {
                  node.textContent = article.excerpt;
                  node.dataset.ready = 'true';
                }
              }}
              contentEditable
              suppressContentEditableWarning
              data-placeholder='Viet mo ta ngan cho bai viet...'
              className='text-muted-foreground mb-8 min-h-8 outline-none text-lg leading-8 [&:empty:before]:text-muted-foreground [&:empty:before]:content-[attr(data-placeholder)]'
              onInput={(event) =>
                updateArticle('excerpt', (event.currentTarget.textContent ?? '').trimStart())
              }
            />

            <div className='space-y-3'>
              {article.blocks.map((block) => (
                <div key={block.id} className='group relative'>
                  <button
                    type='button'
                    className='text-muted-foreground hover:bg-muted absolute -left-9 top-1 hidden size-7 items-center justify-center rounded-md group-hover:flex'
                    onClick={() => openSlashMenu(block.id)}
                    aria-label='Mo menu block'
                  >
                    /
                  </button>
                  {block.type === 'image' ? (
                    <div className='space-y-2 rounded-md border border-dashed p-3'>
                      <Label htmlFor={`image-${block.id}`}>Image URL</Label>
                      <Input
                        id={`image-${block.id}`}
                        value={block.content}
                        onChange={(event) => updateBlock(block.id, { content: event.target.value })}
                        placeholder='https://...'
                      />
                      {block.content && (
                        <div
                          role='img'
                          aria-label='Preview image'
                          className='aspect-[16/8] rounded-md bg-cover bg-center'
                          style={{ backgroundImage: `url("${block.content}")` }}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      ref={(node) => {
                        blockRefs.current[block.id] = node;
                        if (node && node.dataset.ready !== 'true') {
                          node.innerHTML = block.content;
                          node.dataset.ready = 'true';
                        }
                      }}
                      contentEditable
                      suppressContentEditableWarning
                      role='textbox'
                      aria-multiline='true'
                      aria-label='Noi dung block'
                      tabIndex={0}
                      data-placeholder='Go / de chon block, Enter de tao doan moi...'
                      className={getEditableClass(block.type)}
                      onKeyDown={(event) => handleBlockKeyDown(event, block)}
                      onInput={(event) => updateBlock(block.id, { content: event.currentTarget.innerHTML })}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {slashMenu && (
            <div
              className='fixed z-50 w-72 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg'
              style={{ top: slashMenu.top, left: slashMenu.left }}
            >
              {blockOptions.map((option) => {
                const Icon = Icons[option.icon];

                return (
                  <button
                    key={option.type}
                    type='button'
                    className='hover:bg-accent flex w-full items-start gap-3 rounded-sm px-3 py-2 text-left'
                    onClick={() => selectSlashBlock(option.type)}
                  >
                    <Icon className='mt-0.5 size-4' />
                    <span>
                      <span className='block text-sm font-medium'>{option.label}</span>
                      <span className='text-muted-foreground block text-xs'>{option.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {bubbleMenu && (
            <div
              className='fixed z-50 flex -translate-x-1/2 items-center gap-1 rounded-md border bg-popover p-1 shadow-lg'
              style={{ top: bubbleMenu.top, left: bubbleMenu.left }}
            >
              <Button type='button' size='sm' variant='ghost' onMouseDown={(event) => event.preventDefault()} onClick={() => runInlineCommand('bold')}>
                <Icons.bold />
              </Button>
              <Button type='button' size='sm' variant='ghost' onMouseDown={(event) => event.preventDefault()} onClick={() => runInlineCommand('italic')}>
                <Icons.italic />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card className='h-fit xl:sticky xl:top-20'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Xem truoc</CardTitle>
              <CardDescription>Noi dung se duoc landing page khac su dung.</CardDescription>
            </div>
            <Badge variant={previewArticle.status === 'published' ? 'default' : 'secondary'}>
              {previewArticle.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <NewsArticleContent article={previewArticle} />
        </CardContent>
      </Card>
    </div>
  );
}
