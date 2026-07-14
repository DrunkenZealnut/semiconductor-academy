import { notFound } from 'next/navigation';
import { SourceHeader } from '@/components/sources/SourceHeader';
import { SourceSectionList } from '@/components/sources/SourceSectionList';
import { getOrderedSources, getSource } from '@/lib/sources';
import { buildMetadata } from '@/lib/seo';
import { SOURCE_KIND_UNIT_LABELS, SOURCE_LICENSE_LABELS } from '@/lib/types';

export function generateStaticParams() {
  return getOrderedSources().map((s) => ({ source: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ source: string }>;
}) {
  const { source: sourceId } = await params;
  const source = getSource(sourceId);
  if (!source) return buildMetadata();
  return buildMetadata({
    title: source.title,
    description: source.subtitle ?? `${source.attribution} · ${source.sections.length}개 섹션`,
    path: `/sources/${sourceId}/`,
  });
}

export default async function SourceIndexPage({
  params,
}: {
  params: Promise<{ source: string }>;
}) {
  const { source: sourceId } = await params;
  const source = getSource(sourceId);
  if (!source) notFound();

  const unitLabel = SOURCE_KIND_UNIT_LABELS[source.kind];

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SourceHeader source={source} />
      <SourceSectionList
        sections={source.sections}
        heading={`${unitLabel} 목록`}
        unitLabel={unitLabel}
      />

      <footer className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        <p>
          <span className="font-semibold">출처/라이선스:</span>{' '}
          {source.attribution}
          {source.publisher ? ` · ${source.publisher}` : ''}
          {source.year ? ` (${source.year})` : ''} · {SOURCE_LICENSE_LABELS[source.license]}
        </p>
      </footer>
    </article>
  );
}
