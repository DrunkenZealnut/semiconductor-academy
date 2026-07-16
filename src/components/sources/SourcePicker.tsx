import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Library } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getOrderedSources } from '@/lib/sources';
import type { Source } from '@/lib/types';
import { SOURCE_CATEGORY_LABELS, SOURCE_KIND_UNIT_LABELS } from '@/lib/types';
import { SourceBadge } from '@/components/sources/SourceBadge';
import { SOURCE_ACCENT_BORDER } from '@/components/sources/accent';

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

/** 자료원별 학습 관점 라벨 — 홈 카드 뱃지 전용 (미등록 id는 뱃지 미표시).
 *  교과서 카테고리 소속 자료원은 그룹 헤더 공통 뱃지로 대체 — 여기 등록하지 않는다. */
const PERSPECTIVE: Record<string, string> = {
  'epi-semi-hazards': '위험 — 왜 위험한가',
  'osha-scs': '안전 — 어떻게 다루나',
  'ncs-semi': '직무 — 현장에서 무슨 일을',
};

/** 교과서 카테고리 그룹 공통 학습 관점 뱃지 */
const TEXTBOOK_PERSPECTIVE = '교과 — 학교에서 배우는 그대로';

/** 관점 뱃지 pill — 개별 카드(PERSPECTIVE)와 교과서 그룹 헤더가 공용 */
function PerspectiveBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}

export function SourcePicker() {
  const sources = getOrderedSources();
  const standalone = sources.filter((s) => !s.category);
  const textbooks = sources.filter((s) => s.category === 'hs-textbook');

  return (
    <section
      id="sources"
      aria-labelledby="source-picker-heading"
      className="mt-12 scroll-mt-20 sm:mt-16"
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
          학술서·OSHA·NCS 세 자료원이 위험·안전·직무를, 반도체고 교과서 묶음이 학교 교과
          과정을 맡아요. 같은 주제를 여러 출처로 비교하면서 깊이 있게 익혀보세요.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {standalone.map((s) => {
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
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    {PERSPECTIVE[s.id] ? (
                      <PerspectiveBadge>{PERSPECTIVE[s.id]}</PerspectiveBadge>
                    ) : null}
                    <SourceBadge source={s} variant="lang" />
                  </div>
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

      {textbooks.length > 0 ? (
        <div
          role="group"
          aria-labelledby="hs-textbook-group-heading"
          className={cn(
            'mt-4 rounded-2xl border-2 bg-white p-5 sm:p-6 dark:bg-slate-900',
            SOURCE_ACCENT_BORDER.school,
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  ACCENT_ICON.school,
                )}
              >
                <IconFor accent="school" />
              </div>
              <div>
                <h3
                  id="hs-textbook-group-heading"
                  className="text-lg font-bold text-slate-900 dark:text-slate-100"
                >
                  {SOURCE_CATEGORY_LABELS['hs-textbook']}
                </h3>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  반도체고 학생이 학교에서 배우는 교과서를 권·단원 순서 그대로 재구성했어요.
                </p>
              </div>
            </div>
            <PerspectiveBadge>{TEXTBOOK_PERSPECTIVE}</PerspectiveBadge>
          </div>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {textbooks.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/sources/${s.id}/`}
                  aria-label={`${s.title} 자료원 보기`}
                  className="group flex h-full flex-col gap-1.5 rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-amber-900/60 dark:bg-amber-950/20 dark:hover:border-amber-700"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {s.title}
                    </h4>
                    <ArrowRight
                      aria-hidden
                      className="size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-amber-600 dark:group-hover:text-amber-300"
                    />
                  </div>
                  {s.subtitle ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{s.subtitle}</p>
                  ) : null}
                  <p className="mt-auto text-xs text-slate-500 dark:text-slate-500">
                    {s.sections.length}개 {SOURCE_KIND_UNIT_LABELS[s.kind]} · {s.attribution}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
