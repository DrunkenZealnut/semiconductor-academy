import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { SourceBadge } from '@/components/sources/SourceBadge';
import { RelatedFromOtherSources } from '@/components/cross-link/RelatedFromOtherSources';
import { NCS_SEMI } from '@/lib/sources';
import { loadNcsModuleMdx } from '@/lib/ncsMdx';
import { buildMetadata } from '@/lib/seo';
import { SOURCE_LICENSE_LABELS } from '@/lib/types';

export function generateStaticParams() {
  return NCS_SEMI.sections.map((s) => ({ module: s.id }));
}

function findModuleIndex(moduleId: string) {
  return NCS_SEMI.sections.findIndex((s) => s.id === moduleId);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const idx = findModuleIndex(module);
  if (idx < 0) return buildMetadata();
  const section = NCS_SEMI.sections[idx];
  return buildMetadata({
    title: `${section.title} | NCS 반도체 학습모듈`,
    description: section.summary ?? section.title,
    path: `/sources/ncs-semi/${module}/`,
  });
}

export default async function NcsModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const idx = findModuleIndex(module);
  if (idx < 0) notFound();

  const section = NCS_SEMI.sections[idx];
  const Body = await loadNcsModuleMdx(module);
  const prev = idx > 0 ? NCS_SEMI.sections[idx - 1] : undefined;
  const next = idx < NCS_SEMI.sections.length - 1 ? NCS_SEMI.sections[idx + 1] : undefined;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <nav aria-label="breadcrumb" className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-300">
            홈
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <Link
            href="/sources/ncs-semi/"
            className="hover:text-brand-600 dark:hover:text-brand-300"
          >
            NCS 반도체 학습모듈
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{section.title}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={NCS_SEMI} variant="kind" />
          <SourceBadge source={NCS_SEMI} variant="license" />
          {section.group ? (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {section.group}
            </span>
          ) : null}
          {section.readingTime ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Clock className="size-3" />
              {section.readingTime}분
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          {section.title}
        </h1>
        {section.summary ? (
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{section.summary}</p>
        ) : null}
      </header>

      <div className="prose prose-lg max-w-none dark:prose-invert prose-h2:mt-10 prose-h3:mt-6">
        {Body ? (
          <Body />
        ) : (
          <p className="text-slate-600 dark:text-slate-400">본문 준비 중입니다.</p>
        )}
      </div>

      <RelatedFromOtherSources sourceId="ncs-semi" sectionId={section.id} />

      <nav
        aria-label="NCS 모듈 이전/다음"
        className="mt-12 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800"
      >
        {prev ? (
          <Link
            href={prev.href}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700"
          >
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <ChevronLeft className="size-3.5" />
              이전 모듈
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.href}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-right transition hover:border-brand-300 hover:shadow-md sm:text-right dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700"
          >
            <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              다음 모듈
              <ChevronRight className="size-3.5" />
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
              {next.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <footer className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        <p>
          <span className="font-semibold">출처/라이선스:</span>{' '}
          {NCS_SEMI.attribution}
          {NCS_SEMI.publisher ? ` · ${NCS_SEMI.publisher}` : ''} ·{' '}
          {SOURCE_LICENSE_LABELS[NCS_SEMI.license]}
          {NCS_SEMI.url ? (
            <>
              {' · '}
              <a
                href={NCS_SEMI.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-brand-600 hover:underline dark:text-brand-300"
              >
                NCS 원문 사이트
                <ExternalLink className="size-3" />
              </a>
            </>
          ) : null}
        </p>
        <p className="mt-2 text-slate-500 dark:text-slate-500">
          NCS 학습모듈 원문을 고등학생 눈높이로 재구성했습니다. 원문 도판은 출처 표기와 함께 일부만
          실었으며(제3자 저작 표기 도판 제외), 각 모듈 하단에 원 학습모듈 코드를 표기합니다.
        </p>
      </footer>
    </article>
  );
}
