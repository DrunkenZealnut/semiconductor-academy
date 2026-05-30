import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { HazardBadge } from '@/components/content/HazardBadge';
import { Callout } from '@/components/content/Callout';
import { Tag } from '@/components/ui/Tag';
import { Card } from '@/components/ui/Card';
import { ChemicalSourceHub } from '@/components/cross-link/ChemicalSourceHub';
import {
  chemicals,
  getChemicalById,
  getProcessesByChemical,
} from '@/lib/content';
import { CATEGORY_LABELS } from '@/lib/types';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return chemicals.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chem = getChemicalById(id);
  if (!chem) return buildMetadata();
  return buildMetadata({
    title: `${chem.nameKo} (${chem.nameEn})`,
    description: chem.hazardSummary,
    path: `/chemicals/${id}/`,
  });
}

export default async function ChemicalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chem = getChemicalById(id);
  if (!chem) notFound();

  const usedProcesses = getProcessesByChemical(chem.id);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/chemicals/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400"
      >
        <ChevronLeft className="size-4" />
        유해물질 사전으로 돌아가기
      </Link>

      <header className="mb-8">
        <Tag variant="info" className="mb-3">
          {CATEGORY_LABELS[chem.category]}
        </Tag>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
          {chem.nameKo}
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          {chem.nameEn}
          {chem.formula && (
            <span className="ml-3 font-mono text-slate-700 dark:text-slate-300">
              {chem.formula}
            </span>
          )}
        </p>
        {chem.casNo && (
          <p className="mt-1 text-sm text-slate-500">
            CAS 번호: <span className="font-mono">{chem.casNo}</span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {chem.hazards.map((h) => (
            <HazardBadge key={h} type={h} />
          ))}
        </div>
      </header>

      <Callout type="warning" title={chem.hazardSummary}>
        이 물질은 위와 같은 위험이 있으니, 다룰 때는 반드시 보호 장비와 안전 절차를 따르세요.
      </Callout>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">쉽게 말하면</h2>
        <p className="mt-3 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          {chem.easyExplain}
        </p>
      </section>

      {usedProcesses.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
            이 공정에서 쓰여요
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {usedProcesses.map((p) => (
              <Link key={p.id} href={`/process/${p.slug}/`} className="block no-underline">
                <Card>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {p.nameKo}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.oneLine}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ChemicalSourceHub chemicalId={chem.id} />

      <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800">
        출처: 「반도체 산업의 유해인자」 p.{chem.sourceRef.page} —{' '}
        <span className="italic">{chem.sourceRef.section}</span>
      </footer>
    </article>
  );
}
