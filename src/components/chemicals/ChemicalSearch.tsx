'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { ChemicalCard } from './ChemicalCard';
import { searchChemicals } from '@/lib/search';
import { chemicals } from '@/lib/content';
import { CATEGORY_LABELS, type ChemicalCategory, type ProcessId } from '@/lib/types';
import { getOrderedProcesses } from '@/lib/content';
import { cn } from '@/lib/cn';

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ChemicalCategory[];

export function ChemicalSearch() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <ChemicalSearchInner />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="not-prose animate-pulse">
      <div className="mb-4 h-12 rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

function ChemicalSearchInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const initialQuery = searchParams.get('q') ?? '';
  const initialCategories = useMemo(
    () => new Set((searchParams.get('category')?.split(',').filter(Boolean) ?? []) as ChemicalCategory[]),
    [searchParams],
  );
  const initialProcesses = useMemo(
    () => new Set((searchParams.get('process')?.split(',').filter(Boolean) ?? []) as ProcessId[]),
    [searchParams],
  );

  const [query, setQuery] = useState(initialQuery);
  const [activeCategories, setActiveCategories] = useState<Set<ChemicalCategory>>(initialCategories);
  const [activeProcesses, setActiveProcesses] = useState<Set<ProcessId>>(initialProcesses);

  const processes = getOrderedProcesses();

  // Sync state → URL (debounced for query)
  const syncToUrl = useCallback(
    (q: string, cats: Set<ChemicalCategory>, procs: Set<ProcessId>) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (cats.size > 0) params.set('category', Array.from(cats).join(','));
      if (procs.size > 0) params.set('process', Array.from(procs).join(','));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  useEffect(() => {
    const t = setTimeout(() => syncToUrl(query, activeCategories, activeProcesses), 250);
    return () => clearTimeout(t);
  }, [query, activeCategories, activeProcesses, syncToUrl]);

  const filtered = useMemo(() => {
    const base = query.trim() ? searchChemicals(query) : chemicals;
    return base.filter((c) => {
      if (activeCategories.size > 0 && !activeCategories.has(c.category)) return false;
      if (activeProcesses.size > 0 && !c.usedIn.some((p) => activeProcesses.has(p))) return false;
      return true;
    });
  }, [query, activeCategories, activeProcesses]);

  const toggleCategory = (cat: ChemicalCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleProcess = (pid: ProcessId) => {
    setActiveProcesses((prev) => {
      const next = new Set(prev);
      if (next.has(pid)) next.delete(pid);
      else next.add(pid);
      return next;
    });
  };

  const reset = () => {
    setQuery('');
    setActiveCategories(new Set());
    setActiveProcesses(new Set());
  };

  const activeFilterCount = activeCategories.size + activeProcesses.size;

  return (
    <div className="not-prose grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Mobile filter toggle - only visible below lg */}
      <button
        type="button"
        onClick={() => setMobileFiltersOpen((v) => !v)}
        aria-expanded={mobileFiltersOpen}
        aria-controls="chemical-filters"
        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          필터
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </span>
        <span className="text-xs text-slate-500">
          {mobileFiltersOpen ? '접기' : '펼치기'}
        </span>
      </button>

      {/* Filter sidebar - always visible on lg+, toggleable on mobile */}
      <aside
        id="chemical-filters"
        className={cn(
          'space-y-6',
          !mobileFiltersOpen && 'hidden lg:block',
        )}
      >
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            분류
          </h3>
          <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                aria-pressed={activeCategories.has(cat)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition lg:rounded-md lg:text-left',
                  activeCategories.has(cat)
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                )}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            사용 공정
          </h3>
          <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
            {processes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProcess(p.id)}
                aria-pressed={activeProcesses.has(p.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition lg:rounded-md lg:text-left',
                  activeProcesses.has(p.id)
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                )}
              >
                {p.nameKo}
              </button>
            ))}
          </div>
        </div>

        {(activeCategories.size > 0 || activeProcesses.size > 0 || query) && (
          <button
            type="button"
            onClick={reset}
            className="text-xs text-slate-500 underline hover:text-slate-700"
          >
            필터 초기화
          </button>
        )}
      </aside>

      {/* Search + Results */}
      <div>
        <div className="relative mb-4">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="물질 이름, 화학식, CAS번호로 검색..."
            aria-label="유해물질 검색"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="검색어 지우기"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          검색 결과: <strong className="text-slate-900 dark:text-slate-100">{filtered.length}</strong>건
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700">
            검색 결과가 없어요. 다른 키워드로 시도해 보세요.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((c) => (
              <ChemicalCard key={c.id} id={c.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
