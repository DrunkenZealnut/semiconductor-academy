import { QuoteIndex } from '@/components/quote-index/QuoteIndex';
import type { QuoteItem } from '@/components/quote-index/QuoteCard';
import { buildMetadata } from '@/lib/seo';
import quotesData from '@/data/quotes.json';

export const metadata = buildMetadata({
  title: '인용 인덱스 — 책 + OSHA 통합',
  description:
    '책 「반도체 산업의 유해인자」 91개 인용과 OSHA Semiconductor Chemical Safety 26개 핵심 인용을 한 곳에서 검색해요.',
  path: '/quotes/',
});

const quotes = quotesData as QuoteItem[];

export default function QuotesPage() {
  const bookCount = quotes.filter((q) => q.sourceId === 'epi-semi-hazards').length;
  const oshaCount = quotes.filter((q) => q.sourceId === 'osha-scs').length;

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Source Quote Index
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          인용 인덱스 — 책 + OSHA 통합
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          학술서{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            「반도체 산업의 유해인자」
          </span>{' '}
          책 인용 {bookCount}개와{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            OSHA Semiconductor Chemical Safety
          </span>{' '}
          5 Part에서 추출한 핵심 인용 {oshaCount}개를 한 곳에서 검색해요. 키워드(예:{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
            silane
          </code>
          ,{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
            flash point
          </code>
          ,{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
            사전주의
          </code>
          ), 자료원·챕터·유형으로 검색할 수 있어요.
        </p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          총 <strong>{quotes.length}개</strong>의 인용 — 📖 책{' '}
          <strong>{bookCount}개</strong> + 🏛 OSHA <strong>{oshaCount}개</strong>
        </p>
      </header>

      <QuoteIndex quotes={quotes} />

      <footer className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
        <p>
          이 인덱스는 빌드 타임에 17챕터 mdx + OSHA SCS 5 Part mdx에서 자동 수집된
          결과예요. 책 인용은{' '}
          <strong>「반도체 산업의 유해인자」</strong>(에피스테메, 윤충식·김승원·박동욱·정지연·최상준·하권철·함승헌
          공저)에서 학습 보조 목적의 fair use 범위 내에서 발췌했고, OSHA 인용은 미국
          노동부(U.S. Department of Labor) 산하 OSHA의{' '}
          <em>Semiconductor Chemical Safety</em> 교육 자료(Public Domain — U.S. Gov
          Work)에서 영어 원문 그대로 발췌했어요.
        </p>
      </footer>
    </article>
  );
}
