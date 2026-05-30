import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { SourceBadge } from '@/components/sources/SourceBadge';
import { RelatedFromOtherSources } from '@/components/cross-link/RelatedFromOtherSources';
import { OSHA_SCS } from '@/lib/sources';
import { loadOshaScsPartMdx } from '@/lib/oshaMdx';
import { buildMetadata } from '@/lib/seo';
import { SOURCE_LICENSE_LABELS } from '@/lib/types';

export function generateStaticParams() {
  return OSHA_SCS.sections.map((s) => ({ part: s.id }));
}

function getPartByIndex(idx: number) {
  return OSHA_SCS.sections[idx];
}

function findPartIndex(partId: string) {
  return OSHA_SCS.sections.findIndex((s) => s.id === partId);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const { part } = await params;
  const idx = findPartIndex(part);
  if (idx < 0) return buildMetadata();
  const section = getPartByIndex(idx);
  return buildMetadata({
    title: `${section.title} | OSHA SCS`,
    description: section.summary ?? section.title,
    path: `/sources/osha-scs/${part}/`,
  });
}

export default async function OshaScsPartPage({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const { part } = await params;
  const idx = findPartIndex(part);
  if (idx < 0) notFound();

  const section = getPartByIndex(idx);
  const MdxBody = await loadOshaScsPartMdx(part);
  const prev = idx > 0 ? getPartByIndex(idx - 1) : undefined;
  const next = idx < OSHA_SCS.sections.length - 1 ? getPartByIndex(idx + 1) : undefined;

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
            href="/sources/osha-scs/"
            className="hover:text-brand-600 dark:hover:text-brand-300"
          >
            OSHA SCS
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{section.title}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={OSHA_SCS} variant="lang" />
          <SourceBadge source={OSHA_SCS} variant="license" />
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
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
          OSHA · 미국 노동부 산업안전보건청 · 본 페이지의 영어 본문은 원본 transcript입니다.
        </p>
      </header>

      <div className="prose prose-lg max-w-none dark:prose-invert prose-h2:mt-10 prose-h3:mt-6">
        {MdxBody ? <MdxBody /> : (
          <p className="text-slate-600 dark:text-slate-400">본문 준비 중입니다.</p>
        )}
      </div>

      <RelatedFromOtherSources sourceId="osha-scs" sectionId={section.id} />

      <nav
        aria-label="OSHA Part 이전/다음"
        className="mt-12 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800"
      >
        {prev ? (
          <Link
            href={prev.href}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700"
          >
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <ChevronLeft className="size-3.5" />
              이전 Part
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
              다음 Part
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
          {OSHA_SCS.attribution}
          {OSHA_SCS.publisher ? ` · ${OSHA_SCS.publisher}` : ''} ·{' '}
          {SOURCE_LICENSE_LABELS[OSHA_SCS.license]}
          {OSHA_SCS.url ? (
            <>
              {' · '}
              <a
                href={OSHA_SCS.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-brand-600 hover:underline dark:text-brand-300"
              >
                원문 사이트
                <ExternalLink className="size-3" />
              </a>
            </>
          ) : null}
        </p>
      </footer>
    </article>
  );
}
