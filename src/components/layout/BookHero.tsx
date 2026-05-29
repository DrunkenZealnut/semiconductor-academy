import Link from 'next/link';
import { ArrowRight, BookOpen, ListOrdered } from 'lucide-react';

export function BookHero() {
  return (
    <section className="text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
        <BookOpen aria-hidden className="size-8" />
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-600">
        책 한 권을 풀어드립니다
      </p>

      <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
        반도체 산업의 유해인자,
        <br />
        <span className="text-brand-600">쉽게 풀어드려요</span>
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        학술서{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          「반도체 산업의 유해인자」
        </span>
        를 중·고등학생과 일반인 눈높이로 다시 풀어 썼어요.{' '}
        <br className="hidden sm:inline" />
        비유와 일러스트로 누구나 따라올 수 있습니다.
      </p>

      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-500">
        저자 · 윤충식 · 김승원 · 박동욱 · 정지연 · 최상준 · 하권철 · 함승헌 (총 7인)
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/chapter/risks-of-new-tech/"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-brand-700 hover:shadow-lg"
        >
          <BookOpen aria-hidden className="size-4" />
          책 처음부터 읽기
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/chapters/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <ListOrdered aria-hidden className="size-4" />책 차례 보기
        </Link>
      </div>

      <p className="mx-auto mt-6 text-xs text-slate-500 dark:text-slate-500">
        17챕터 · 약 2시간 · 일러스트와 비유로 풀이
      </p>
    </section>
  );
}
