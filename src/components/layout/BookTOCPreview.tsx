import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getChaptersByCategory } from '@/lib/chapters';
import {
  CHAPTER_CATEGORY_COLOR,
  CHAPTER_CATEGORY_LABELS,
  type ChapterCategory,
} from '@/lib/types';
import { cn } from '@/lib/cn';

const CATEGORY_ORDER: ChapterCategory[] = [
  'foundation',
  'process',
  'hazard',
  'reflection',
];

const CATEGORY_PREVIEW: Record<
  ChapterCategory,
  { emoji: string; desc: string }
> = {
  foundation: { emoji: '🏛', desc: '반도체와 클린룸의 기초' },
  process: { emoji: '⚙', desc: '9단계 제조 공정의 흐름' },
  hazard: { emoji: '⚠', desc: '화학물질·전자파·직업병' },
  reflection: { emoji: '💭', desc: '산업보건학 시각의 결론' },
};

function formatRange(items: { order: number }[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return `Ch.${items[0].order}`;
  return `Ch.${items[0].order}~${items[items.length - 1].order}`;
}

export function BookTOCPreview() {
  return (
    <section className="mt-16">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            책 차례
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            17챕터 · 4 카테고리
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            관심 가는 부분부터 시작하거나, 처음부터 차근차근 읽어보세요.
          </p>
        </div>
        <Link
          href="/chapters/"
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex"
        >
          전체 차례 보기
          <ArrowRight className="size-4" />
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CATEGORY_ORDER.map((cat) => {
          const items = getChaptersByCategory(cat);
          if (items.length === 0) return null;
          const preview = CATEGORY_PREVIEW[cat];
          const color = CHAPTER_CATEGORY_COLOR[cat];

          return (
            <Link
              key={cat}
              href={`/chapters/#${cat}`}
              className="group block no-underline"
            >
              <article
                className={cn(
                  'h-full rounded-2xl border-2 border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900',
                  color.border,
                  'border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800',
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span aria-hidden className="text-3xl">
                    {preview.emoji}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      color.bg,
                      color.text,
                      color.bgDark,
                      color.textDark,
                    )}
                  >
                    {formatRange(items)}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {CHAPTER_CATEGORY_LABELS[cat]}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {preview.desc}
                </p>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                  {items.length}개 챕터
                </p>
                <span
                  className={cn(
                    'mt-3 inline-flex items-center gap-1 text-sm font-semibold transition group-hover:gap-2',
                    color.text,
                    color.textDark,
                  )}
                >
                  보기
                  <ArrowRight className="size-3" />
                </span>
              </article>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/chapters/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          전체 차례 보기
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
