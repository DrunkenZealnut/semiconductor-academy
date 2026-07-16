import type { ComponentType } from 'react';

/**
 * 반도체고 교과서 카테고리 공용 MDX 로더 (source → module 2단 레지스트리).
 * 공용 라우트 `/sources/[source]/[module]`은 여기 등록된 자료원만 params를 생성한다.
 * daegu-hs-process는 전용 라우트 + daeguMdx.tsx 유지 — 여기 등록 금지(라우트 이중 생성).
 * 새 권 추가: REGISTRY에 source 항목 + 모듈 로더 등록, sources.ts sections에도
 * 완성 모듈만 함께 등록. 주의 — sections에만 등록하고 로더를 빠뜨리면 빌드는 통과하고
 * "본문 준비 중" 자리표시 페이지가 공개 배포된다(반대로 REGISTRY 로더가 없는 MDX 경로를
 * 가리키면 빌드 실패). 등록 후 해당 모듈 페이지 렌더를 눈으로 확인할 것.
 */
const REGISTRY: Record<string, Record<string, () => Promise<{ default: ComponentType }>>> = {
  'hs-semicon-basics': {
    'semicon-overview': () => import('@/content/sources/hs-semicon-basics/semicon-overview.mdx'),
    'semicon-industry': () => import('@/content/sources/hs-semicon-basics/semicon-industry.mdx'),
    'semicon-careers': () => import('@/content/sources/hs-semicon-basics/semicon-careers.mdx'),
    'physical-properties': () =>
      import('@/content/sources/hs-semicon-basics/physical-properties.mdx'),
    'semicon-fundamentals': () =>
      import('@/content/sources/hs-semicon-basics/semicon-fundamentals.mdx'),
    'passive-components': () =>
      import('@/content/sources/hs-semicon-basics/passive-components.mdx'),
    diode: () => import('@/content/sources/hs-semicon-basics/diode.mdx'),
    bjt: () => import('@/content/sources/hs-semicon-basics/bjt.mdx'),
    mosfet: () => import('@/content/sources/hs-semicon-basics/mosfet.mdx'),
    'cmos-image-sensor': () =>
      import('@/content/sources/hs-semicon-basics/cmos-image-sensor.mdx'),
  },
};

export function listSchoolTextSourceIds(): string[] {
  return Object.keys(REGISTRY);
}

/** 공용 라우트가 이 자료원을 담당하는지 — REGISTRY 키 멤버십 */
export function isSchoolTextSource(sourceId: string): boolean {
  return Object.prototype.hasOwnProperty.call(REGISTRY, sourceId);
}

export async function loadSchoolTextMdx(
  sourceId: string,
  moduleId: string,
): Promise<ComponentType | null> {
  const loader = REGISTRY[sourceId]?.[moduleId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
