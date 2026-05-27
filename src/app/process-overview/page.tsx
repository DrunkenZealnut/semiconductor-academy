import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProcessDiagram } from '@/components/process/ProcessDiagram';
import { Card } from '@/components/ui/Card';
import { getOrderedProcesses } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '반도체 제조 공정 한눈에',
  description: '웨이퍼부터 패키징까지, 반도체가 만들어지는 9단계 공정을 한 눈에 살펴봐요.',
  path: '/process-overview/',
});

export default function ProcessOverviewPage() {
  const processes = getOrderedProcesses();

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          공정 한눈에 보기
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
          반도체는 어떻게 만들까요?
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          모래에서 시작해 우리 손 안의 칩이 되기까지, 9단계 여정을 따라가 봅시다.
        </p>
      </header>

      <ProcessDiagram />

      <div className="mt-12 space-y-4">
        {processes.map((p) => (
          <Link key={p.id} href={`/process/${p.slug}/`} className="block no-underline">
            <Card className="hover:border-brand-500">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {p.order}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {p.nameKo}
                    <span className="ml-2 text-sm font-normal text-slate-500">{p.nameEn}</span>
                  </h2>
                  <p className="mt-1 text-slate-700 dark:text-slate-300">{p.oneLine}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{p.analogy}</p>
                </div>
                <ChevronRight aria-hidden className="mt-2 size-5 shrink-0 text-slate-400" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </article>
  );
}
