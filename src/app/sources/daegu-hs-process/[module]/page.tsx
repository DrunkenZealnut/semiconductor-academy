import { notFound } from 'next/navigation';
import { SourceModuleArticle } from '@/components/sources/SourceModuleArticle';
import { DAEGU_HS } from '@/lib/sources';
import { loadDaeguModuleMdx } from '@/lib/daeguMdx';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return DAEGU_HS.sections.map((s) => ({ module: s.id }));
}

function findModuleIndex(moduleId: string) {
  return DAEGU_HS.sections.findIndex((s) => s.id === moduleId);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const idx = findModuleIndex(module);
  if (idx < 0) return buildMetadata();
  const section = DAEGU_HS.sections[idx];
  return buildMetadata({
    title: `${section.title} | 반도체 공정기초`,
    description: section.summary ?? section.title,
    path: `/sources/daegu-hs-process/${module}/`,
  });
}

export default async function DaeguModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const idx = findModuleIndex(module);
  if (idx < 0) notFound();

  const Body = await loadDaeguModuleMdx(module);

  return (
    <SourceModuleArticle
      source={DAEGU_HS}
      sectionIndex={idx}
      Body={Body}
      disclosure="대구반도체고 교과서 「반도체 공정기초」(조우현·김준호 지음, 렛유인)의 내용을 고등학생 눈높이로 전면 재작성했습니다. 원문 문장·도판은 사용하지 않으며, 각 단원 하단에 원문 단원·페이지를 표기합니다."
    />
  );
}
