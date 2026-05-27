import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProcessDiagram } from '@/components/process/ProcessDiagram';
import { ChemicalCard } from '@/components/chemicals/ChemicalCard';
import { LayeredExplain } from '@/components/content/LayeredExplain';
import { Callout } from '@/components/content/Callout';
import { Card } from '@/components/ui/Card';
import { getOrderedProcesses, getProcessBySlug } from '@/lib/content';
import { loadProcessMdx } from '@/lib/processMdx';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getOrderedProcesses().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const process = getProcessBySlug(slug);
  if (!process) return buildMetadata();
  return buildMetadata({
    title: `${process.nameKo} 공정`,
    description: process.oneLine,
    path: `/process/${slug}/`,
  });
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const process = getProcessBySlug(slug);
  if (!process) notFound();

  const all = getOrderedProcesses();
  const idx = all.findIndex((p) => p.id === process.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const MdxBody = await loadProcessMdx(slug);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          {process.order}단계 공정
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
          {process.nameKo}
          <span className="ml-2 text-xl font-normal text-slate-500">{process.nameEn}</span>
        </h1>
      </header>

      <ProcessDiagram activeId={process.id} variant="compact" />

      <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
        <LayeredExplain
          hook={process.oneLine}
          easy={{ analogy: process.analogy }}
        />

        <h2>이 공정은 어떻게 진행되나요?</h2>
        <ol className="not-prose mt-4 space-y-3">
          {process.steps.map((step, i) => (
            <li key={step.id}>
              <Card>
                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {step.nameKo}
                    </h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>

        {/* MDX 본문이 있는 경우 깊이 있는 설명 렌더 */}
        {MdxBody ? (
          <MdxBody />
        ) : (
          <>
            <h2>어떤 위험이 있나요?</h2>

            {process.hazardKeywords.length > 0 && (
              <Callout type="warning" title="이 공정의 주요 위험">
                <ul className="mt-1 list-disc pl-5">
                  {process.hazardKeywords.map((kw) => (
                    <li key={kw}>{kw}</li>
                  ))}
                </ul>
              </Callout>
            )}

            <h3 className="mt-8">이 공정에서 쓰는 주요 화학물질</h3>
            {process.chemicals.length > 0 ? (
              <div className="not-prose mt-4 grid gap-4 sm:grid-cols-2">
                {process.chemicals.map((id) => (
                  <ChemicalCard key={id} id={id} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">관련 화학물질 정보가 곧 추가됩니다.</p>
            )}
          </>
        )}
      </div>

      {/* Prev/Next */}
      <nav
        aria-label="공정 탐색"
        className="mt-16 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800"
      >
        {prev ? (
          <Link
            href={`/process/${prev.slug}/`}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-brand-500 dark:border-slate-800"
          >
            <ChevronLeft aria-hidden className="size-5 text-slate-400 group-hover:text-brand-600" />
            <div>
              <div className="text-xs text-slate-500">이전 공정</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">{prev.nameKo}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/process/${next.slug}/`}
            className="group flex items-center justify-end gap-3 rounded-xl border border-slate-200 p-4 text-right hover:border-brand-500 dark:border-slate-800"
          >
            <div>
              <div className="text-xs text-slate-500">다음 공정</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">{next.nameKo}</div>
            </div>
            <ChevronRight aria-hidden className="size-5 text-slate-400 group-hover:text-brand-600" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
