import { Link2 } from 'lucide-react';
import { lookupRelated, getUnknownChemicals } from '@/lib/cross-link/lookup';
import { getSource } from '@/lib/sources';
import { SourceBadge } from '@/components/sources/SourceBadge';
import { RelatedItemCard } from './RelatedItemCard';

interface RelatedFromOtherSourcesProps {
  sourceId: string;
  sectionId: string;
  /** 헤딩 텍스트 (기본: "같은 주제를 다른 자료에서도 보기") */
  heading?: string;
  /** 그룹당 최대 항목 수 (기본 6) */
  maxPerGroup?: number;
}

export function RelatedFromOtherSources({
  sourceId,
  sectionId,
  heading = '같은 주제를 다른 자료에서도 보기',
  maxPerGroup,
}: RelatedFromOtherSourcesProps) {
  const groups = lookupRelated(sourceId, sectionId, { maxPerGroup });

  // 자료원 그룹 0개면 패널 자체를 숨김
  if (groups.length === 0) return null;

  const unknownChemicals = new Set(getUnknownChemicals());

  return (
    <section
      className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/40"
      aria-labelledby="related-from-other-sources-heading"
    >
      <header className="mb-4 flex items-center gap-2">
        <Link2 aria-hidden className="size-4 text-slate-500 dark:text-slate-400" />
        <h2
          id="related-from-other-sources-heading"
          className="text-base font-bold text-slate-900 dark:text-slate-100"
        >
          {heading}
        </h2>
      </header>

      <div className="space-y-6">
        {groups.map((g) => {
          const source = getSource(g.sourceId);
          if (!source) return null;
          return (
            <div key={g.sourceId}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {source.title}
                </h3>
                <SourceBadge source={source} variant="lang" />
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {g.items.map((item) => (
                  <li key={`${item.sourceId}::${item.sectionId}`}>
                    <RelatedItemCard
                      item={item}
                      accent={source.accent}
                      unknownChemicals={unknownChemicals}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
