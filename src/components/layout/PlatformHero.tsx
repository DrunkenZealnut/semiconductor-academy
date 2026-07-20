import Link from 'next/link';
import { ArrowRight, Compass, Layers, Library } from 'lucide-react';
import { SOURCES } from '@/lib/sources';

const SOURCE_COUNT = SOURCES.length;
const TOTAL_UNITS = SOURCES.reduce((n, s) => n + s.sections.length, 0);

export function PlatformHero() {
  return (
    <section className="text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
        <Layers aria-hidden className="size-8" />
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-600">
        반도체 멀티소스 학습 플랫폼
      </p>

      <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
        반도체, 원리부터 직무까지
        <br />
        <span className="text-brand-600">네 가지 관점으로 배워요</span>
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        고교 교과서(원리) · 학술서(위험) · OSHA(안전) · NCS(직무) —{' '}
        <br className="hidden sm:inline" />
        같은 반도체를 네 방향에서 비추면 전체가 보여요.{' '}
        <br className="hidden sm:inline" />
        비유와 일러스트로 누구나 따라올 수 있습니다.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/#sources"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-brand-700 hover:shadow-lg"
        >
          <Library aria-hidden className="size-4" />
          자료원 둘러보기
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/start/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <Compass aria-hidden className="size-4" />
          학습 시작 가이드
        </Link>
      </div>

      <p className="mx-auto mt-6 text-xs text-slate-500 dark:text-slate-500">
        자료원 {SOURCE_COUNT}개 · {TOTAL_UNITS}개 학습 단위 · 전부 무료
      </p>
    </section>
  );
}
