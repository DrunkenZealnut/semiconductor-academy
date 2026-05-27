import Link from 'next/link';
import { ChevronLeft, BookOpen, Clock } from 'lucide-react';
import { ChapterCategoryBadge } from './ChapterCategoryBadge';
import type { Chapter } from '@/lib/types';

export function ChapterHeader({ chapter }: { chapter: Chapter }) {
  return (
    <header className="mb-8">
      <Link
        href="/chapters/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400"
      >
        <ChevronLeft className="size-4" />
        책 차례로 돌아가기
      </Link>

      <ChapterCategoryBadge category={chapter.category} className="mb-3" />

      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        Chapter {chapter.order}
      </p>
      <h1 className="mt-1 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl dark:text-slate-100">
        {chapter.title}
      </h1>
      {chapter.subtitle && (
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          {chapter.subtitle}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <BookOpen aria-hidden className="size-4" />
          원본 p.{chapter.sourcePages[0]}~{chapter.sourcePages[1]}
        </span>
        <span className="flex items-center gap-1">
          <Clock aria-hidden className="size-4" />
          약 {chapter.readingTime}분 소요
        </span>
      </div>
    </header>
  );
}
