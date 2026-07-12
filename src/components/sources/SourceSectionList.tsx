import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import type { SourceSection } from '@/lib/types';

interface SourceSectionListProps {
  sections: SourceSection[];
  /** 헤딩 텍스트 (자료원별로 "챕터" / "Part 모듈" 등 다른 단위명) */
  heading?: string;
  /** 학습 단위 라벨 (예: "챕터", "Part") */
  unitLabel?: string;
}

function SectionCard({ s }: { s: SourceSection }) {
  return (
    <li>
      <Link
        href={s.href}
        className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700"
      >
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
          {s.title}
        </h3>
        {s.summary ? (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {s.summary}
          </p>
        ) : null}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
          {s.readingTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {s.readingTime}분
            </span>
          ) : (
            <span />
          )}
          <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
        </div>
      </Link>
    </li>
  );
}

export function SourceSectionList({
  sections,
  heading = '학습 섹션',
  unitLabel,
}: SourceSectionListProps) {
  // group 필드가 있으면 세분류 트랙별로 묶어 렌더 (NCS). 없으면 flat (책·OSHA).
  const hasGroups = sections.some((s) => s.group);
  const groups = hasGroups
    ? sections.reduce<Record<string, SourceSection[]>>((acc, s) => {
        const key = s.group ?? '기타';
        (acc[key] ??= []).push(s);
        return acc;
      }, {})
    : null;

  return (
    <section className="mt-10" aria-labelledby="source-section-list-heading">
      <div className="flex items-baseline justify-between">
        <h2
          id="source-section-list-heading"
          className="text-xl font-bold text-slate-900 dark:text-slate-100"
        >
          {heading}
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {sections.length}
          {unitLabel ? ` ${unitLabel}` : '개'}
        </span>
      </div>

      {groups ? (
        <div className="mt-5 space-y-8">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <span className="inline-block h-4 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                {group}
                <span className="font-normal text-slate-400 dark:text-slate-500">
                  · {items.length}개
                </span>
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((s) => (
                  <SectionCard key={s.id} s={s} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {sections.map((s) => (
            <SectionCard key={s.id} s={s} />
          ))}
        </ul>
      )}
    </section>
  );
}
