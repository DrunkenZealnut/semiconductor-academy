import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SOURCE_ACCENT_BORDER } from '@/components/sources/accent';
import type { Source } from '@/lib/types';

interface PathStep {
  step: number;
  perspective: string;
  title: string;
  description: string;
  sourceName: string;
  href: string;
  accent: NonNullable<Source['accent']>;
}

const PATH_STEPS: PathStep[] = [
  {
    step: 1,
    perspective: '원리',
    title: '공정이 어떻게 돌아갈까?',
    description: '8대 공정부터 클린룸까지, 교과서 단원 순서 그대로 원리를 익혀요.',
    sourceName: '「반도체 공정기초」 교과서',
    href: '/sources/daegu-hs-process/',
    accent: 'school',
  },
  {
    step: 2,
    perspective: '위험',
    title: '무엇이 왜 위험할까?',
    description: '각 공정에 숨은 유해인자를 학술서 17챕터로 깊이 있게 살펴봐요.',
    sourceName: '「반도체 산업의 유해인자」',
    href: '/chapters/',
    accent: 'book',
  },
  {
    step: 3,
    perspective: '안전',
    title: '어떻게 안전하게 다룰까?',
    description: '화학물질 취급·보호구·비상 대응, 현장 안전 수칙을 배워요.',
    sourceName: 'OSHA Chemical Safety',
    href: '/sources/osha-scs/',
    accent: 'osha',
  },
  {
    step: 4,
    perspective: '직무',
    title: '현장에선 무슨 일을 할까?',
    description: '개발·제조·재료·장비 4개 트랙의 직무 세계를 들여다봐요.',
    sourceName: 'NCS 반도체 학습모듈',
    href: '/sources/ncs-semi/',
    accent: 'standard',
  },
];

export function LearningPathSection() {
  return (
    <section aria-labelledby="learning-path-heading" className="mt-16 sm:mt-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          추천 학습 동선
        </p>
        <h2
          id="learning-path-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100"
        >
          이렇게 시작해 보세요
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          순서대로 읽으면 원리→위험→안전→직무로 이어지는 한 바퀴가 완성돼요.
          물론 아무 데서나 시작해도 좋아요.
        </p>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PATH_STEPS.map((p, i) => (
          <li key={p.step} className="relative">
            <Link
              href={p.href}
              className={cn(
                'group flex h-full flex-col rounded-2xl border-2 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900',
                SOURCE_ACCENT_BORDER[p.accent],
              )}
            >
              <div className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {p.step}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {p.perspective}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
                {p.title}
              </h3>
              <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-400">
                {p.description}
              </p>
              <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-500">
                {p.sourceName}
              </p>
            </Link>
            {i < PATH_STEPS.length - 1 ? (
              <ChevronRight
                aria-hidden
                className="absolute -right-3.5 top-1/2 z-10 hidden size-5 -translate-y-1/2 text-slate-400 lg:block dark:text-slate-600"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
