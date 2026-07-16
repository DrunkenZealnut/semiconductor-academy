import { notFound } from 'next/navigation';
import { SourceModuleArticle } from '@/components/sources/SourceModuleArticle';
import { getSource } from '@/lib/sources';
import {
  hasModuleLoader,
  isSchoolTextSource,
  listSchoolTextSourceIds,
  loadSchoolTextMdx,
} from '@/lib/schoolTextMdx';
import { buildMetadata } from '@/lib/seo';
import type { Source } from '@/lib/types';
import { SOURCE_CATEGORY_LABELS, SOURCE_KIND_LABELS } from '@/lib/types';

/**
 * 반도체고 교과서 카테고리 공용 모듈 라우트.
 * schoolTextMdx REGISTRY에 등록된 자료원만 params를 생성한다 — daegu·NCS·OSHA는
 * 전용 정적 세그먼트 라우트가 우선 매칭되므로 여기서 제외(출력 이중 생성 방지).
 * sections에 있는데 REGISTRY 로더가 없으면(수동 미러 drift) 여기서 빌드를 실패시킨다 —
 * 그렇지 않으면 "본문 준비 중" 자리표시 페이지가 조용히 배포된다(schoolTextMdx.tsx 참고).
 */
export function generateStaticParams() {
  return listSchoolTextSourceIds().flatMap((sourceId) => {
    const source = getSource(sourceId);
    if (!source) return [];
    return source.sections.map((s) => {
      if (!hasModuleLoader(sourceId, s.id)) {
        throw new Error(
          `[sources/[source]/[module]] ${sourceId}/${s.id}: sections에 등록됐지만 ` +
            `schoolTextMdx.tsx REGISTRY에 로더가 없습니다. 둘을 함께 등록하세요.`,
        );
      }
      return { source: sourceId, module: s.id };
    });
  });
}

function resolveModule(
  sourceId: string,
  moduleId: string,
): { source: Source; idx: number } | null {
  if (!isSchoolTextSource(sourceId)) return null;
  const source = getSource(sourceId);
  if (!source) return null;
  const idx = source.sections.findIndex((s) => s.id === moduleId);
  if (idx < 0) return null;
  return { source, idx };
}

/** daegu 고지문 패턴의 카테고리 공용 일반화 — 권 메타·카테고리 라벨에서 생성 */
function disclosureFor(source: Source): string {
  const groupLabel = source.category
    ? SOURCE_CATEGORY_LABELS[source.category]
    : SOURCE_KIND_LABELS[source.kind];
  const byline = source.publisher
    ? `(${source.attribution} 지음, ${source.publisher})`
    : `(${source.attribution})`;
  return `${groupLabel} 「${source.title}」${byline}의 내용을 고등학생 눈높이로 전면 재작성했습니다. 원문 문장·도판은 사용하지 않으며, 각 단원 하단에 원문 단원·페이지를 표기합니다.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ source: string; module: string }>;
}) {
  const { source: sourceId, module } = await params;
  const found = resolveModule(sourceId, module);
  if (!found) return buildMetadata();
  const section = found.source.sections[found.idx];
  return buildMetadata({
    title: `${section.title} | ${found.source.title}`,
    description: section.summary ?? section.title,
    path: `/sources/${sourceId}/${module}/`,
  });
}

export default async function SchoolTextModulePage({
  params,
}: {
  params: Promise<{ source: string; module: string }>;
}) {
  const { source: sourceId, module } = await params;
  const found = resolveModule(sourceId, module);
  if (!found) notFound();

  const Body = await loadSchoolTextMdx(sourceId, module);

  return (
    <SourceModuleArticle
      source={found.source}
      sectionIndex={found.idx}
      Body={Body}
      disclosure={disclosureFor(found.source)}
    />
  );
}
