import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Source } from '@/lib/types';

type Accent = NonNullable<Source['accent']>;

interface RoleEntry {
  goal: string;
  /** PerspectiveCatalog 관점 군집 앵커 id */
  targetId: string;
  accent: Accent;
}

/** 목표 → 관점 군집 바로가기. 순수 앵커 링크(개인화·상태·분기 페이지 없음). */
const ROLE_ENTRIES: RoleEntry[] = [
  { goal: '진로를 찾고 있어요', targetId: 'cluster-job', accent: 'standard' },
  { goal: '수업·발표 자료가 필요해요', targetId: 'cluster-principle', accent: 'school' },
  { goal: '안전하게 다루는 법', targetId: 'cluster-safety', accent: 'osha' },
  { goal: '왜 위험한지 궁금해요', targetId: 'cluster-risk', accent: 'book' },
];

const ROLE_PILL: Record<Accent, string> = {
  book: 'border-brand-300 hover:border-brand-500 hover:bg-brand-50 dark:border-brand-800 dark:hover:border-brand-600 dark:hover:bg-brand-950/40',
  osha: 'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/40',
  standard:
    'border-slate-300 hover:border-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:bg-slate-800/60',
  school:
    'border-amber-300 hover:border-amber-500 hover:bg-amber-50 dark:border-amber-800 dark:hover:border-amber-600 dark:hover:bg-amber-950/40',
};

export function RoleQuickEntry() {
  return (
    <nav aria-label="목표별 바로가기" className="mt-12 sm:mt-16">
      <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
        무엇부터 볼까요?
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        {ROLE_ENTRIES.map((r) => (
          <li key={r.targetId}>
            <Link
              href={`#${r.targetId}`}
              className={cn(
                'group inline-flex items-center gap-1.5 rounded-full border-2 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition dark:bg-slate-900 dark:text-slate-200',
                ROLE_PILL[r.accent],
              )}
            >
              {r.goal}
              <ArrowRight
                aria-hidden
                className="size-3.5 text-slate-400 transition group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
