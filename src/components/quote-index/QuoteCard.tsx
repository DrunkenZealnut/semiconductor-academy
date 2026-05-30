import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface QuoteItem {
  id: string;
  chapter: number;
  chapterTitle: string;
  chapterShortTitle: string;
  chapterSlug: string;
  type: 'layered-explain' | 'source-quote';
  page: number | null;
  section: string | null;
  text: string;
  snippet: string;
}

interface QuoteCardProps {
  quote: QuoteItem;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  const isLayered = quote.type === 'layered-explain';
  const Icon = isLayered ? Sparkles : BookOpen;
  const typeLabel = isLayered ? '도입 인용' : '본문 인용';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold',
            isLayered
              ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
          )}
        >
          <Icon aria-hidden className="size-3.5" />
          {typeLabel}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Ch.{quote.chapter} {quote.chapterShortTitle}
        </span>
        {quote.page !== null && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            p.{quote.page}
          </span>
        )}
      </header>

      {quote.section && (
        <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {quote.section}
        </p>
      )}

      <blockquote className="mb-3 border-l-4 border-brand-300 pl-3 text-sm italic leading-relaxed text-slate-700 dark:border-brand-700 dark:text-slate-300">
        {quote.snippet}
      </blockquote>

      <Link
        href={`/chapter/${quote.chapterSlug}/`}
        className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline dark:text-brand-300"
      >
        📖 챕터에서 보기 →
      </Link>
    </article>
  );
}
