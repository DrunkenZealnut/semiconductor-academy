import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  HAZARD_LABELS_CL,
  TOPIC_LABELS,
  type RelatedItem,
} from '@/lib/cross-link/schema';
import type { Source } from '@/lib/types';
import { SOURCE_ACCENT_BORDER } from '@/components/sources/accent';

interface RelatedItemCardProps {
  item: RelatedItem;
  accent?: Source['accent'];
  /** 미등록 chemical (unknownChemicals)에 표시할 chemical ID 집합 */
  unknownChemicals?: Set<string>;
}

export function RelatedItemCard({ item, accent, unknownChemicals }: RelatedItemCardProps) {
  const accentCls = SOURCE_ACCENT_BORDER[accent ?? 'standard'];
  return (
    <Link
      href={item.href}
      className={cn(
        'group block rounded-xl border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900',
        accentCls,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
          {item.title}
        </h4>
        <ArrowRight className="size-3.5 shrink-0 translate-y-0.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
      </div>

      {hasAnyShared(item) ? (
        <ul className="mt-2 flex flex-wrap gap-1">
          {item.sharedTopics.map((t) => (
            <li key={`t-${t}`}>
              <Chip tone="topic">{TOPIC_LABELS[t]}</Chip>
            </li>
          ))}
          {item.sharedHazards.map((h) => (
            <li key={`h-${h}`}>
              <Chip tone="hazard">{HAZARD_LABELS_CL[h]}</Chip>
            </li>
          ))}
          {item.sharedChemicals.map((c) => {
            const unknown = unknownChemicals?.has(c);
            return (
              <li key={`c-${c}`}>
                <Chip tone="chemical" muted={unknown} title={unknown ? '미등록 물질' : undefined}>
                  {c}
                </Chip>
              </li>
            );
          })}
        </ul>
      ) : null}
    </Link>
  );
}

function hasAnyShared(item: RelatedItem) {
  return (
    item.sharedTopics.length + item.sharedHazards.length + item.sharedChemicals.length > 0
  );
}

interface ChipProps {
  children: React.ReactNode;
  tone: 'topic' | 'hazard' | 'chemical';
  muted?: boolean;
  title?: string;
}

const CHIP_STYLE: Record<ChipProps['tone'], string> = {
  topic: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  hazard: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
  chemical: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200',
};

function Chip({ children, tone, muted, title }: ChipProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
        muted ? 'bg-slate-200 italic text-slate-500 dark:bg-slate-700 dark:text-slate-400' : CHIP_STYLE[tone],
      )}
    >
      {children}
    </span>
  );
}
