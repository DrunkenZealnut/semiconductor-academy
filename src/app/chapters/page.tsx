import { ChapterCard } from '@/components/chapter/ChapterCard';
import { getChaptersByCategory } from '@/lib/chapters';
import { CHAPTER_CATEGORY_LABELS, type ChapterCategory } from '@/lib/types';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '책 차례',
  description: '책처럼 차근차근 17챕터. 약 2시간이면 한 권 다 읽을 수 있어요.',
  path: '/chapters/',
});

const CATEGORY_ORDER: ChapterCategory[] = ['foundation', 'process', 'hazard', 'reflection'];
const CATEGORY_EMOJI: Record<ChapterCategory, string> = {
  foundation: '🏛',
  process: '⚙',
  hazard: '⚠',
  reflection: '💭',
};
const CATEGORY_DESC: Record<ChapterCategory, string> = {
  foundation: '도입과 기초 — 반도체와 클린룸을 처음부터',
  process: '9단계 제조 공정 — 각 공정의 의미와 유해인자',
  hazard: '화학물질·전자파·직업병 — 위험의 학술적 정리',
  reflection: '책의 결론 — 산업보건학적 관점',
};

export default function ChaptersIndexPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          책 차례
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
          반도체 산업의 유해인자 — 17챕터
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          책처럼 차근차근. 약 2시간이면 한 권 다 읽을 수 있어요.
        </p>
      </header>

      <div className="space-y-12">
        {CATEGORY_ORDER.map((cat) => {
          const items = getChaptersByCategory(cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} id={cat} className="scroll-mt-24">
              <header className="mb-4 flex items-baseline gap-2">
                <span className="text-2xl" aria-hidden>{CATEGORY_EMOJI[cat]}</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {CHAPTER_CATEGORY_LABELS[cat]}
                </h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {CATEGORY_DESC[cat]}
                </span>
              </header>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((c) => (
                  <ChapterCard key={c.id} chapter={c} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
