import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Library } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getOrderedSources } from '@/lib/sources';
import type { Source } from '@/lib/types';
import { SourceBadge } from './SourceBadge';
import { SOURCE_ACCENT_BORDER } from './accent';

const ACCENT_ICON: Record<NonNullable<Source['accent']>, string> = {
  book: 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
  osha: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  standard: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  school: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

function IconFor({ accent }: { accent?: Source['accent'] }) {
  const cls = 'size-7';
  if (accent === 'book') return <BookOpen aria-hidden className={cls} />;
  if (accent === 'osha') return <ShieldCheck aria-hidden className={cls} />;
  if (accent === 'school') return <GraduationCap aria-hidden className={cls} />;
  return <Library aria-hidden className={cls} />;
}

export function SourcePicker() {
  const sources = getOrderedSources();

  return (
    <section
      aria-labelledby="source-picker-heading"
      className="mt-12 sm:mt-16"
    >
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          자료원 선택
        </p>
        <h2
          id="source-picker-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100"
        >
          어느 자료부터 살펴볼까요?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          국내 학술서와 OSHA 교육 프로그램 등 자료원별로 학습할 수 있어요.
          같은 주제를 여러 출처로 비교하면서 깊이 있게 익혀보세요.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {sources.map((s) => {
          const accentRing = SOURCE_ACCENT_BORDER[s.accent ?? 'standard'];
          const accentIcon = ACCENT_ICON[s.accent ?? 'standard'];
          const href = `/sources/${s.id}/`;
          return (
            <li key={s.id}>
              <Link
                href={href}
                aria-label={`${s.title} 자료원 보기`}
                className={cn(
                  'group flex h-full flex-col gap-3 rounded-2xl border-2 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 dark:bg-slate-900',
                  accentRing,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-xl',
                      accentIcon,
                    )}
                  >
                    <IconFor accent={s.accent} />
                  </div>
                  <SourceBadge source={s} variant="lang" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {s.title}
                  </h3>
                  {s.subtitle ? (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {s.subtitle}
                    </p>
                  ) : null}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {s.sections.length}개 섹션 · {s.attribution}
                </p>

                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-brand-600 dark:text-slate-300 dark:group-hover:text-brand-300">
                  자료원 인덱스 열기
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
