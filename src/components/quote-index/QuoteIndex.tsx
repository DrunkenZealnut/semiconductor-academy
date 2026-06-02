'use client';

import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { QuoteCard, type QuoteItem } from './QuoteCard';
import { Chip } from '@/components/ui/Chip';
import { getOrderedSources } from '@/lib/sources';

interface QuoteIndexProps {
  quotes: QuoteItem[];
}

type SourceFilter = 'all' | string;
type TypeFilter = 'all' | 'layered-explain' | 'source-quote';

export function QuoteIndex({ quotes }: QuoteIndexProps) {
  const sources = useMemo(() => getOrderedSources(), []);
  const showSourceFilter = sources.length >= 2;

  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [chapterFilter, setChapterFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const fuse = useMemo(
    () =>
      new Fuse(quotes, {
        keys: [
          { name: 'text', weight: 0.45 },
          { name: 'section', weight: 0.15 },
          { name: 'sectionRef', weight: 0.15 },
          { name: 'chapterTitle', weight: 0.1 },
          { name: 'partTitle', weight: 0.1 },
          { name: 'page', weight: 0.05 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [quotes],
  );

  const sourceCounts = useMemo(() => {
    const m: Record<string, number> = { all: quotes.length };
    for (const s of sources) {
      m[s.id] = quotes.filter((q) => q.sourceId === s.id).length;
    }
    return m;
  }, [quotes, sources]);

  const isBookSource = sourceFilter === 'epi-semi-hazards' || sourceFilter === 'all';

  const results = useMemo(() => {
    let list: QuoteItem[];
    if (query.trim().length >= 2) {
      list = fuse.search(query.trim()).map((r) => r.item);
    } else {
      list = quotes;
    }
    if (sourceFilter !== 'all') {
      list = list.filter((q) => q.sourceId === sourceFilter);
    }
    // chapter/type 필터는 책 quote에만 적용 — OSHA만 보고 있을 땐 무시
    if (isBookSource) {
      if (chapterFilter !== null) {
        list = list.filter((q) => q.sourceId === 'epi-semi-hazards' && q.chapter === chapterFilter);
      }
      if (typeFilter !== 'all') {
        list = list.filter((q) => q.sourceId === 'epi-semi-hazards' && q.type === typeFilter);
      }
    }
    return list;
  }, [query, sourceFilter, chapterFilter, typeFilter, isBookSource, fuse, quotes]);

  const chapterOptions = useMemo(() => {
    const map = new Map<number, string>();
    quotes.forEach((q) => {
      if (q.sourceId === 'epi-semi-hazards') {
        map.set(q.chapter, q.chapterShortTitle);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([order, title]) => ({ order, title }));
  }, [quotes]);

  const leCount = useMemo(
    () => quotes.filter((q) => q.sourceId === 'epi-semi-hazards' && q.type === 'layered-explain').length,
    [quotes],
  );
  const sqCount = useMemo(
    () => quotes.filter((q) => q.sourceId === 'epi-semi-hazards' && q.type === 'source-quote').length,
    [quotes],
  );

  const hasFilters =
    query.length > 0 ||
    sourceFilter !== 'all' ||
    chapterFilter !== null ||
    typeFilter !== 'all';

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
            placeholder="검색 — 키워드(예: silane, 사전주의), 페이지(p.13), 섹션..."
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

        {/* Source 필터 row — 자료원 ≥ 2 일 때만 노출 */}
        {showSourceFilter && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="mr-1 font-semibold text-slate-500 dark:text-slate-400">
              자료원
            </span>
            <Chip
              pressed={sourceFilter === 'all'}
              onClick={() => setSourceFilter('all')}
            >
              전체 {sourceCounts.all}
            </Chip>
            {sources.map((s) => (
              <Chip
                key={s.id}
                pressed={sourceFilter === s.id}
                onClick={() => setSourceFilter(s.id)}
              >
                {s.accent === 'book' ? '📖' : '🏛'} {s.id === 'osha-scs' ? 'OSHA' : '책'}{' '}
                {sourceCounts[s.id] ?? 0}
              </Chip>
            ))}
          </div>
        )}

        {/* Type/Chapter 필터 — 책 source 선택 시(또는 전체)만 작동 */}
        {isBookSource && (
          <div className="flex flex-wrap gap-2 text-xs">
            <Chip
              pressed={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
            >
              전체 유형
            </Chip>
            <Chip
              pressed={typeFilter === 'layered-explain'}
              onClick={() => setTypeFilter('layered-explain')}
            >
              도입 인용 ({leCount})
            </Chip>
            <Chip
              pressed={typeFilter === 'source-quote'}
              onClick={() => setTypeFilter('source-quote')}
            >
              본문 인용 ({sqCount})
            </Chip>

            <span className="mx-1 my-1 w-px bg-slate-300 dark:bg-slate-700" aria-hidden />

            <Chip
              pressed={chapterFilter === null}
              onClick={() => setChapterFilter(null)}
            >
              전체 챕터
            </Chip>
            {chapterOptions.map(({ order, title }) => (
              <Chip
                key={order}
                pressed={chapterFilter === order}
                onClick={() =>
                  setChapterFilter(chapterFilter === order ? null : order)
                }
              >
                Ch.{order} {title}
              </Chip>
            ))}
          </div>
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSourceFilter('all');
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
