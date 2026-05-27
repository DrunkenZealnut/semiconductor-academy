import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export function ChaptersHero() {
  return (
    <section className="mt-20 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            <BookOpen className="size-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              책처럼 차근차근
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              17챕터 · 약 2시간 · 비유와 일러스트로 풀어드려요
            </p>
          </div>
        </div>
        <Link
          href="/chapters/"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          책 차례 보기
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
