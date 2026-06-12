import { Badge } from '@/components/ui/badge';
import type { NewsArticle } from '../lib/news-store';

export function NewsArticleContent({ article }: { article: NewsArticle }) {
  return (
    <article className='space-y-4'>
      {article.coverImage && (
        <div
          role='img'
          aria-label={article.title}
          className='aspect-[16/7] w-full rounded-md bg-cover bg-center'
          style={{ backgroundImage: `url("${article.coverImage}")` }}
        />
      )}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
            {article.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
          <span className='text-muted-foreground text-xs'>{article.publishedAt}</span>
        </div>
        <h2 className='text-2xl font-semibold tracking-tight'>{article.title}</h2>
        <p className='text-muted-foreground'>{article.excerpt}</p>
      </div>
      <div className='space-y-4'>
        {article.blocks.map((block) => {
          const html = { __html: block.content };

          if (block.type === 'heading') {
            return (
              <h3 key={block.id} className='text-xl font-semibold' dangerouslySetInnerHTML={html} />
            );
          }

          if (block.type === 'image') {
            return block.content ? (
              <div
                key={block.id}
                role='img'
                aria-label='News content image'
                className='aspect-[16/8] w-full rounded-md bg-cover bg-center'
                style={{ backgroundImage: `url("${block.content}")` }}
              />
            ) : null;
          }

          if (block.type === 'quote') {
            return (
              <blockquote
                key={block.id}
                className='border-l-4 pl-4 text-lg italic'
                dangerouslySetInnerHTML={html}
              />
            );
          }

          return (
            <p
              key={block.id}
              className='text-muted-foreground leading-7'
              dangerouslySetInnerHTML={html}
            />
          );
        })}
      </div>
    </article>
  );
}
