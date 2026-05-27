import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChapterNavProps {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}

export function ChapterNav({ prev, next }: ChapterNavProps) {
  return (
    <nav
      aria-label="챕터 탐색"
      className="not-prose mt-16 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-brand-500 dark:border-slate-800"
        >
          <ChevronLeft aria-hidden className="size-5 text-slate-400 group-hover:text-brand-600" />
          <div>
            <div className="text-xs text-slate-500">이전</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{prev.label}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex items-center justify-end gap-3 rounded-xl border border-slate-200 p-4 text-right hover:border-brand-500 dark:border-slate-800"
        >
          <div>
            <div className="text-xs text-slate-500">다음</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{next.label}</div>
          </div>
          <ChevronRight aria-hidden className="size-5 text-slate-400 group-hover:text-brand-600" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
