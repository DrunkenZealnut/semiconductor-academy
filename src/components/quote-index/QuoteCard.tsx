import Link from 'next/link';
import { BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getSource } from '@/lib/sources';
import { SourceBadge } from '@/components/sources/SourceBadge';

interface BaseQuote {
  id: string;
  sourceId: string;
  language: 'ko' | 'en';
  text: string;
  snippet: string;
}

export interface BookQuote extends BaseQuote {
  sourceId: 'epi-semi-hazards';
  language: 'ko';
  type: 'layered-explain' | 'source-quote';
  chapter: number;
  chapterTitle: string;
  chapterShortTitle: string;
  chapterSlug: string;
  page: number | null;
  section: string | null;
}

export interface OshaQuote extends BaseQuote {
  sourceId: 'osha-scs';
  language: 'en';
  type: 'osha-section';
  kind: 'overview' | 'learning-objectives' | 'summary' | 'definition';
  partId: string;
  partTitle: string;
  partHref: string;
  sectionRef?: string;
}

export type QuoteItem = BookQuote | OshaQuote;

interface QuoteCardProps {
  quote: QuoteItem;
}

const OSHA_KIND_LABEL: Record<OshaQuote['kind'], string> = {
  overview: '개요',
  'learning-objectives': '학습 목표',
  summary: '요약',
  definition: '정의',
};

export function QuoteCard({ quote }: QuoteCardProps) {
  if (quote.sourceId === 'osha-scs') {
    return <OshaQuoteCard quote={quote} />;
  }
  return <BookQuoteCard quote={quote} />;
}

function BookQuoteCard({ quote }: { quote: BookQuote }) {
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

function OshaQuoteCard({ quote }: { quote: OshaQuote }) {
  const source = getSource('osha-scs');
  const kindLabel = OSHA_KIND_LABEL[quote.kind];

  return (
    <article className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-emerald-900/60 dark:bg-slate-900">
      <header className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
          <ShieldCheck aria-hidden className="size-3.5" />
          OSHA · {kindLabel}
        </span>
        {source && <SourceBadge source={source} variant="lang" />}
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {quote.partTitle}
        </span>
      </header>

      {quote.sectionRef && (
        <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {quote.sectionRef}
        </p>
      )}

      <blockquote className="mb-3 border-l-4 border-emerald-300 pl-3 text-sm italic leading-relaxed text-slate-700 dark:border-emerald-700 dark:text-slate-300">
        {quote.snippet}
      </blockquote>

      <Link
        href={quote.partHref}
        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-300"
      >
        🏛 OSHA {quote.partTitle.split('·')[0].trim()}에서 보기 →
      </Link>
    </article>
  );
}
