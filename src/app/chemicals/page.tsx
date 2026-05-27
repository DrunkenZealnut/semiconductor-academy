import { ChemicalSearch } from '@/components/chemicals/ChemicalSearch';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '유해물질 사전',
  description: '반도체 공정에서 쓰이는 화학물질을 이름·화학식·CAS번호로 검색하고, 어디에 쓰이는지 알아봐요.',
  path: '/chemicals/',
});

export default function ChemicalsPage() {
  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">유해물질 사전</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
          반도체 공장에서 쓰는 화학물질
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          이름·화학식·CAS번호로 검색하고, 어느 공정에 쓰이는지, 어떤 위험이 있는지 알아봐요.
        </p>
      </header>

      <ChemicalSearch />
    </article>
  );
}
