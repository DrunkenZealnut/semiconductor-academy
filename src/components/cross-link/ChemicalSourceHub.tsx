import { FlaskConical } from 'lucide-react';
import { lookupByChemical, getUnknownChemicals } from '@/lib/cross-link/lookup';
import { getSource } from '@/lib/sources';
import { SourceBadge } from '@/components/sources/SourceBadge';
import { RelatedItemCard } from './RelatedItemCard';

interface ChemicalSourceHubProps {
  chemicalId: string;
  /** 헤딩 텍스트 (기본: "이 물질을 다루는 자료") */
  heading?: string;
  /** 그룹당 최대 항목 수 (기본 6) */
  maxPerGroup?: number;
}

export function ChemicalSourceHub({
  chemicalId,
  heading = '이 물질을 다루는 자료',
  maxPerGroup,
}: ChemicalSourceHubProps) {
  const groups = lookupByChemical(chemicalId, { maxPerGroup });
  if (groups.length === 0) return null;

  const unknownChemicals = new Set(getUnknownChemicals());

  return (
    <section
      className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6 dark:border-blue-900 dark:bg-blue-950/30"
      aria-labelledby="chemical-source-hub-heading"
    >
      <header className="mb-4 flex items-center gap-2">
        <FlaskConical aria-hidden className="size-4 text-blue-700 dark:text-blue-300" />
        <h2
          id="chemical-source-hub-heading"
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
