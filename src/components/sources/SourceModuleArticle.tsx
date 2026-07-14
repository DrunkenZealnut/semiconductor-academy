import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { SourceBadge } from '@/components/sources/SourceBadge';
import { RelatedFromOtherSources } from '@/components/cross-link/RelatedFromOtherSources';
import type { Source } from '@/lib/types';
import { SOURCE_KIND_UNIT_LABELS, SOURCE_LICENSE_LABELS } from '@/lib/types';

interface SourceModuleArticleProps {
  source: Source;
  /** source.sections 내 현재 섹션 인덱스 (호출측에서 존재 검증 후 전달) */
  sectionIndex: number;
  /** 로더 레지스트리에서 가져온 MDX 본문 (없으면 준비 중 문구) */
  Body: ComponentType | null;
  /** footer 하단 자료원별 고지문 (저작권·재구성 안내) */
  disclosure?: ReactNode;
}

/**
 * 자료원 섹션 상세 페이지 공용 레이아웃 — breadcrumb → 배지 → 본문(prose) →
 * cross-link → 이전/다음 내비 → 출처/라이선스 footer.
 * 이전/다음 라벨·aria-label은 SOURCE_KIND_UNIT_LABELS에서 파생 (모듈/단원/Part).
 * 신규 자료원 라우트는 이 컴포넌트를 소비하는 thin wrapper로 작성한다.
 * (기존 ncs-semi·osha-scs 라우트는 코어 무수정 원칙에 따라 유지 — 후속 마이그레이션 후보.)
 */
export function SourceModuleArticle({
  source,
  sectionIndex,
  Body,
  disclosure,
}: SourceModuleArticleProps) {
  const section = source.sections[sectionIndex];
  const prev = sectionIndex > 0 ? source.sections[sectionIndex - 1] : undefined;
  const next =
    sectionIndex < source.sections.length - 1 ? source.sections[sectionIndex + 1] : undefined;
  const unitLabel = SOURCE_KIND_UNIT_LABELS[source.kind];

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
            href={`/sources/${source.id}/`}
            className="hover:text-brand-600 dark:hover:text-brand-300"
          >
            {source.title}
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{section.title}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={source} variant="kind" />
          <SourceBadge source={source} variant="license" />
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

      <RelatedFromOtherSources sourceId={source.id} sectionId={section.id} />

      <nav
        aria-label={`${source.title} ${unitLabel} 이전/다음`}
        className="mt-12 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800"
      >
        {prev ? (
          <Link
            href={prev.href}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700"
          >
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <ChevronLeft className="size-3.5" />
              이전 {unitLabel}
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
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-right transition hover:border-brand-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700"
          >
            <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              다음 {unitLabel}
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
          {source.attribution}
          {source.publisher ? ` · ${source.publisher}` : ''} ·{' '}
          {SOURCE_LICENSE_LABELS[source.license]}
          {source.url ? (
            <>
              {' · '}
              <a
                href={source.url}
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
        {disclosure ? (
          <p className="mt-2 text-slate-500 dark:text-slate-500">{disclosure}</p>
        ) : null}
      </footer>
    </article>
  );
}
