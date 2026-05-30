'use client';

import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { QuoteCard, type QuoteItem } from './QuoteCard';
import { cn } from '@/lib/cn';

interface QuoteIndexProps {
  quotes: QuoteItem[];
}

type TypeFilter = 'all' | 'layered-explain' | 'source-quote';

export function QuoteIndex({ quotes }: QuoteIndexProps) {
  const [query, setQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const fuse = useMemo(
    () =>
      new Fuse(quotes, {
        keys: [
          { name: 'text', weight: 0.5 },
          { name: 'section', weight: 0.25 },
          { name: 'chapterTitle', weight: 0.15 },
          { name: 'page', weight: 0.1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [quotes],
  );

  const results = useMemo(() => {
    let list: QuoteItem[];
    if (query.trim().length >= 2) {
      list = fuse.search(query.trim()).map((r) => r.item);
    } else {
      list = quotes;
    }
    if (chapterFilter !== null) {
      list = list.filter((q) => q.chapter === chapterFilter);
    }
    if (typeFilter !== 'all') {
      list = list.filter((q) => q.type === typeFilter);
    }
    return list;
  }, [query, chapterFilter, typeFilter, fuse, quotes]);

  const chapterOptions = useMemo(() => {
    const map = new Map<number, string>();
    quotes.forEach((q) => map.set(q.chapter, q.chapterShortTitle));
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([order, title]) => ({ order, title }));
  }, [quotes]);

  const hasFilters = query.length > 0 || chapterFilter !== null || typeFilter !== 'all';

  return (
    <div>
      {/* 검색 + 필터 */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색 — 키워드, 페이지(p.13), 섹션, 챕터 제목..."
            aria-label="인용 검색"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-brand-900"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="검색어 지우기"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <FilterButton
            active={typeFilter === 'all'}
            onClick={() => setTypeFilter('all')}
          >
            전체 유형
          </FilterButton>
          <FilterButton
            active={typeFilter === 'layered-explain'}
            onClick={() => setTypeFilter('layered-explain')}
          >
            도입 인용 (17)
          </FilterButton>
          <FilterButton
            active={typeFilter === 'source-quote'}
            onClick={() => setTypeFilter('source-quote')}
          >
            본문 인용 (74)
          </FilterButton>

          <span className="mx-1 my-1 w-px bg-slate-300 dark:bg-slate-700" aria-hidden />

          <FilterButton
            active={chapterFilter === null}
            onClick={() => setChapterFilter(null)}
          >
            전체 챕터
          </FilterButton>
          {chapterOptions.map(({ order, title }) => (
            <FilterButton
              key={order}
              active={chapterFilter === order}
              onClick={() =>
                setChapterFilter(chapterFilter === order ? null : order)
              }
            >
              Ch.{order} {title}
            </FilterButton>
          ))}
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setChapterFilter(null);
              setTypeFilter('all');
            }}
            className="text-xs text-slate-600 underline-offset-2 hover:underline dark:text-slate-400"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 결과 카운트 */}
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        <strong className="text-slate-900 dark:text-slate-100">{results.length}</strong>개
        결과 {hasFilters && '(필터 적용 중)'}
      </p>

      {/* 카드 그리드 */}
      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          검색 결과가 없어요. 다른 키워드를 시도해 보세요.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 font-medium transition',
        active
          ? 'border-brand-500 bg-brand-500 text-white shadow-sm'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600',
      )}
    >
      {children}
    </button>
  );
}
