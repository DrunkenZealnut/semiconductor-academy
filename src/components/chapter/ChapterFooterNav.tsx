import Link from 'next/link';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import type { Chapter } from '@/lib/types';

interface Props {
  prev?: Chapter;
  next?: Chapter;
}

export function ChapterFooterNav({ prev, next }: Props) {
  return (
    <nav
      aria-label="챕터 탐색"
      className="not-prose mt-16 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3 dark:border-slate-800"
    >
      {prev ? (
        <Link
          href={`/chapter/${prev.slug}/`}
          className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-brand-500 dark:border-slate-800"
        >
          <ChevronLeft aria-hidden className="size-5 text-slate-400 group-hover:text-brand-600" />
          <div>
            <div className="text-xs text-slate-500">Chapter {prev.order}</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {prev.shortTitle ?? prev.title}
            </div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      <Link
        href="/chapters/"
        className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-4 hover:border-brand-500 dark:border-slate-800"
      >
        <List aria-hidden className="size-4 text-slate-500 group-hover:text-brand-600" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">목차로</span>
      </Link>

      {next ? (
        <Link
          href={`/chapter/${next.slug}/`}
          className="group flex items-center justify-end gap-3 rounded-xl border border-slate-200 p-4 text-right hover:border-brand-500 dark:border-slate-800"
        >
          <div>
            <div className="text-xs text-slate-500">Chapter {next.order}</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {next.shortTitle ?? next.title}
            </div>
          </div>
          <ChevronRight aria-hidden className="size-5 text-slate-400 group-hover:text-brand-600" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
