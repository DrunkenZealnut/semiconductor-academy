import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Library, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getOrderedSources } from '@/lib/sources';
import type { Source } from '@/lib/types';
import { SOURCE_KIND_UNIT_LABELS } from '@/lib/types';
import { SourceBadge } from '@/components/sources/SourceBadge';
import { SOURCE_ACCENT_BORDER } from '@/components/sources/accent';

type Accent = NonNullable<Source['accent']>;

const ACCENT_ICON: Record<Accent, string> = {
  book: 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
  osha: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  standard: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  school: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

function IconFor({ accent }: { accent: Accent }) {
  const cls = 'size-6';
  if (accent === 'book') return <BookOpen aria-hidden className={cls} />;
  if (accent === 'osha') return <ShieldCheck aria-hidden className={cls} />;
  if (accent === 'school') return <GraduationCap aria-hidden className={cls} />;
  return <Library aria-hidden className={cls} />;
}

/** 관점 라벨·앵커 — accent축이 곧 관점(원리·위험·안전·직무)이라 자료원 추가 시 자동 편입된다.
 *  Record<Accent>라 accent 유니온에 값이 추가되면 typecheck가 항목 누락을 잡는다. */
const PERSPECTIVE_META: Record<Accent, { label: string; anchorId: string }> = {
  // 교과서 9권 + 입문서가 함께 묶이므로 '학교에서 배우는 그대로'를 일반화했다
  // (first-semiconductor-primer Do 단계 — 학교 교재가 아닌 입문서 편입).
  school: { label: '원리 · 기초부터 차근차근', anchorId: 'cluster-principle' },
  book: { label: '위험 · 왜 위험한가', anchorId: 'cluster-risk' },
  osha: { label: '안전 · 어떻게 다루나', anchorId: 'cluster-safety' },
  standard: { label: '직무 · 현장에서 무슨 일을', anchorId: 'cluster-job' },
};

/** 렌더 순서(관점 서사) — 새 accent 추가 시 여기에도 넣어야 홈에 노출된다. */
const PERSPECTIVE_ORDER: Accent[] = ['school', 'book', 'osha', 'standard'];

function SourceCard({ source }: { source: Source }) {
  const accent: Accent = source.accent ?? 'standard';
  return (
    <Link
      href={`/sources/${source.id}/`}
      aria-label={`${source.title} 자료원 보기`}
      className={cn(
        'group flex h-full flex-col gap-3 rounded-2xl border-2 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900',
        SOURCE_ACCENT_BORDER[accent],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl',
            ACCENT_ICON[accent],
          )}
        >
          <IconFor accent={accent} />
        </div>
        <SourceBadge source={source} variant="lang" />
      </div>

      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{source.title}</h4>
        {source.subtitle ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{source.subtitle}</p>
        ) : null}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-500">
        {source.sections.length}개 {SOURCE_KIND_UNIT_LABELS[source.kind]} · {source.attribution}
      </p>

      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-brand-600 dark:text-slate-300 dark:group-hover:text-brand-300">
        자료원 인덱스 열기
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/**
 * 홈 자료원 카탈로그 — `getOrderedSources()`를 accent(=관점)로 군집화해 전체 노출한다.
 * 기존 SourcePicker(카드 렌더)와 LearningPathSection(관점 서사)을 하나로 통합했으며,
 * `#sources` 앵커(PlatformHero CTA·Header 네비 참조)를 승계한다.
 */
export function PerspectiveCatalog() {
  const sources = getOrderedSources();

  return (
    <section
      id="sources"
      aria-labelledby="catalog-heading"
      className="mt-16 scroll-mt-20 sm:mt-20"
    >
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          자료원 카탈로그
        </p>
        <h2
          id="catalog-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100"
        >
          무엇을 배울 수 있나요?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          원리 → 위험 → 안전 → 직무, 네 관점으로 자료원을 골라 보세요. 어디서 시작해도 좋아요.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {PERSPECTIVE_ORDER.map((accent) => {
          const items = sources.filter((s) => (s.accent ?? 'standard') === accent);
          if (items.length === 0) return null;
          const meta = PERSPECTIVE_META[accent];
          return (
            <div key={accent} id={meta.anchorId} className="scroll-mt-20">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {meta.label}
                </h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  자료원 {items.length}개
                </span>
              </div>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((s) => (
                  <li key={s.id}>
                    <SourceCard source={s} />
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
