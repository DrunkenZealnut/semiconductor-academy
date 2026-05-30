import { QuoteIndex } from '@/components/quote-index/QuoteIndex';
import type { QuoteItem } from '@/components/quote-index/QuoteCard';
import { buildMetadata } from '@/lib/seo';
import quotesData from '@/data/quotes.json';

export const metadata = buildMetadata({
  title: '책 원문 인용 인덱스',
  description:
    '17챕터에 흩어진 책 원문 인용을 한 곳에 모았어요. 페이지·키워드·섹션으로 검색할 수 있어요.',
  path: '/quotes/',
});

const quotes = quotesData as QuoteItem[];

export default function QuotesPage() {
  const leCount = quotes.filter((q) => q.type === 'layered-explain').length;
  const sqCount = quotes.filter((q) => q.type === 'source-quote').length;

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Source Quote Index
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          책 원문 인용 인덱스
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          17챕터에 흩어진 책{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            「반도체 산업의 유해인자」
          </span>{' '}
          원문 인용을 한 곳에 모았어요. 키워드(예:{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
            사전주의 원칙
          </code>
          ), 페이지(
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
            p.13
          </code>
          ), 섹션 제목으로 검색할 수 있어요.
        </p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          총 <strong>{quotes.length}개</strong>의 인용 — 챕터 도입부 인용{' '}
          <strong>{leCount}개</strong> + 본문 인용 <strong>{sqCount}개</strong>
        </p>
      </header>

      <QuoteIndex quotes={quotes} />

      <footer className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
        <p>
          이 인덱스는 빌드 타임에 17챕터 mdx 파일에서 자동 수집된 결과예요. 사용된
          인용은 모두{' '}
          <strong>「반도체 산업의 유해인자」</strong>(에피스테메, 윤충식·김승원·박동욱·정지연·최상준·하권철·함승헌
          공저) 책의 일부로, 학습 보조 목적의 fair use 범위 내에서 발췌했어요.
        </p>
      </footer>
    </article>
  );
}
