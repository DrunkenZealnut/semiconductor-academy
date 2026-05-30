import Link from 'next/link';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import type { Source } from '@/lib/types';
import { SourceBadge } from './SourceBadge';

interface SourceHeaderProps {
  source: Source;
}

export function SourceHeader({ source }: SourceHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
      <nav aria-label="breadcrumb" className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-300">
          홈
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span>자료원</span>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{source.title}</span>
      </nav>

      <div className="flex items-start gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="size-3.5" />
          다른 자료원
        </Link>
        <SourceBadge source={source} variant="all" />
      </div>

      <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
        {source.title}
      </h1>
      {source.subtitle ? (
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{source.subtitle}</p>
      ) : null}

      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-slate-500 dark:text-slate-400">저자/기관</dt>
          <dd className="mt-0.5 text-slate-800 dark:text-slate-200">{source.attribution}</dd>
        </div>
        {source.publisher ? (
          <div>
            <dt className="font-semibold text-slate-500 dark:text-slate-400">발행처</dt>
            <dd className="mt-0.5 text-slate-800 dark:text-slate-200">
              {source.publisher}
              {source.year ? ` (${source.year})` : ''}
            </dd>
          </div>
        ) : null}
        {source.url ? (
          <div className="sm:col-span-2">
            <dt className="font-semibold text-slate-500 dark:text-slate-400">원문</dt>
            <dd className="mt-0.5">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-300"
              >
                {source.url}
                <ExternalLink className="size-3.5" />
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
    </header>
  );
}
