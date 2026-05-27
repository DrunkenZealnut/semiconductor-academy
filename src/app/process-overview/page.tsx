import Link from 'next/link';
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

      <section className="mt-14">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
          공정별 위험 한눈에
        </h2>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          각 공정의 핵심 유해인자를 미리 살펴봐요. 카드를 클릭하면 자세한 설명과 화학물질로 이동해요.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {processes.map((p) => (
            <Link key={p.id} href={`/process/${p.slug}/`} className="block no-underline">
              <Card className="h-full hover:border-brand-500">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {p.order}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {p.nameKo}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {p.oneLine}
                    </p>
                    {p.hazardKeywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.hazardKeywords.slice(0, 2).map((kw) => (
                          <span
                            key={kw}
                            className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
