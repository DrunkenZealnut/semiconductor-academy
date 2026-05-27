import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { HazardBadge } from '@/components/content/HazardBadge';
import { Tag } from '@/components/ui/Tag';
import { CATEGORY_LABELS } from '@/lib/types';
import { getChemicalById } from '@/lib/content';

interface ChemicalCardProps {
  id: string;
  showLink?: boolean;
}

export function ChemicalCard({ id, showLink = true }: ChemicalCardProps) {
  const chem = getChemicalById(id);
  if (!chem) return null;

  const Wrapper = showLink ? Link : 'div';
  const wrapperProps = showLink
    ? { href: `/chemicals/${chem.id}/`, className: 'block no-underline' }
    : {};

  return (
    /* @ts-expect-error - dynamic component */
    <Wrapper {...wrapperProps}>
      <Card className="not-prose h-full">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {chem.nameKo}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {chem.nameEn}
              {chem.formula && (
                <span className="ml-2 font-mono text-slate-700 dark:text-slate-300">
                  {chem.formula}
                </span>
              )}
            </p>
          </div>
          <Tag variant="info">{CATEGORY_LABELS[chem.category]}</Tag>
        </div>

        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          {chem.easyExplain}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {chem.hazards.map((h) => (
            <HazardBadge key={h} type={h} />
          ))}
        </div>
      </Card>
    </Wrapper>
  );
}
