import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '학습 시작하기',
  description: '어디서부터 시작할지 막막하다면 여기서부터 차근차근.',
  path: '/start/',
});

const tracks = [
  {
    step: 1,
    title: '반도체란 무엇일까?',
    description: '도체·부도체·반도체의 차이부터, 비유로 쉽게 시작해요.',
    href: '/what-is-semiconductor/',
    estimate: '5분',
  },
  {
    step: 2,
    title: '새 기술의 위험성',
    description: '석면, DDT가 알려준 교훈. 왜 반도체에도 이 시각이 필요한가요?',
    href: '/risks-of-new-tech/',
    estimate: '7분',
  },
  {
    step: 3,
    title: '클린룸이란?',
    description: '가장 깨끗한 공간의 역설. 클린룸은 안전을 보장하나요?',
    href: '/cleanroom/',
    estimate: '6분',
  },
  {
    step: 4,
    title: '제조 공정 한눈에',
    description: '9단계 공정을 따라가며 반도체가 만들어지는 과정을 알아봐요.',
    href: '/process-overview/',
    estimate: '10분',
  },
  {
    step: 5,
    title: '유해물질 사전 둘러보기',
    description: '실제로 어떤 화학물질이 쓰이는지 검색해보세요.',
    href: '/chemicals/',
    estimate: '자유 탐색',
  },
  {
    step: 6,
    title: '직업병 사례',
    description: '반도체 산업에서 보고된 직업병과 우리가 기억해야 할 것들.',
    href: '/occupational-disease/',
    estimate: '8분',
  },
];

export default function StartPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          학습 시작하기
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
          어디서부터 시작할까요?
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          순서대로 따라오시면, 약 40분 안에 반도체 산업의 큰 그림을 잡을 수 있어요.
        </p>
      </header>

      <ol className="space-y-4">
        {tracks.map((t) => (
          <li key={t.step}>
            <Link href={t.href} className="block no-underline">
              <Card className="hover:border-brand-500">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {t.step}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                      {t.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {t.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">⏱ {t.estimate}</p>
                  </div>
                  <ArrowRight aria-hidden className="mt-2 size-5 text-slate-400" />
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}
