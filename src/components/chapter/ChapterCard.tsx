import Link from 'next/link';
import { BookOpen, Clock } from 'lucide-react';
import { ChapterCategoryBadge } from './ChapterCategoryBadge';
import { CHAPTER_CATEGORY_COLOR, type Chapter } from '@/lib/types';
import { cn } from '@/lib/cn';

interface Props {
  chapter: Chapter;
  variant?: 'compact' | 'full';
}

export function ChapterCard({ chapter, variant = 'full' }: Props) {
  const c = CHAPTER_CATEGORY_COLOR[chapter.category];
  return (
    <Link href={`/chapter/${chapter.slug}/`} className="block no-underline">
      <article
        className={cn(
          'group h-full rounded-2xl border-2 border-l-4 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900',
          c.border,
          'border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800',
        )}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">
            {chapter.order}
          </span>
          <ChapterCategoryBadge category={chapter.category} />
        </div>
        <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
          {chapter.shortTitle ?? chapter.title}
        </h3>
        {variant === 'full' && chapter.subtitle && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {chapter.subtitle}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen aria-hidden className="size-3" />
            p.{chapter.sourcePages[0]}~{chapter.sourcePages[1]}
          </span>
          <span className="flex items-center gap-1">
            <Clock aria-hidden className="size-3" />
            약 {chapter.readingTime}분
          </span>
        </div>
      </article>
    </Link>
  );
}
