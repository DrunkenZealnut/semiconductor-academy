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
  'hs-basic-tech-1': {
    'electronic-devices': () =>
      import('@/content/sources/hs-basic-tech-1/electronic-devices.mdx'),
    'dc-circuits': () => import('@/content/sources/hs-basic-tech-1/dc-circuits.mdx'),
    measurement: () => import('@/content/sources/hs-basic-tech-1/measurement.mdx'),
    milling: () => import('@/content/sources/hs-basic-tech-1/milling.mdx'),
    'drafting-standards': () =>
      import('@/content/sources/hs-basic-tech-1/drafting-standards.mdx'),
    'drawing-methods': () => import('@/content/sources/hs-basic-tech-1/drawing-methods.mdx'),
    'sectional-views': () => import('@/content/sources/hs-basic-tech-1/sectional-views.mdx'),
    'pneumatics-basics': () =>
      import('@/content/sources/hs-basic-tech-1/pneumatics-basics.mdx'),
    'pneumatics-equipment': () =>
      import('@/content/sources/hs-basic-tech-1/pneumatics-equipment.mdx'),
    'hydraulics-equipment': () =>
      import('@/content/sources/hs-basic-tech-1/hydraulics-equipment.mdx'),
    'c-basics': () => import('@/content/sources/hs-basic-tech-1/c-basics.mdx'),
    'c-programming': () => import('@/content/sources/hs-basic-tech-1/c-programming.mdx'),
  },
  'hs-basic-tech-2': {
    'ac-circuits': () => import('@/content/sources/hs-basic-tech-2/ac-circuits.mdx'),
    'digital-circuits': () => import('@/content/sources/hs-basic-tech-2/digital-circuits.mdx'),
    'equipment-manufacturing': () =>
      import('@/content/sources/hs-basic-tech-2/equipment-manufacturing.mdx'),
    'machine-tools': () => import('@/content/sources/hs-basic-tech-2/machine-tools.mdx'),
    'special-projections': () =>
      import('@/content/sources/hs-basic-tech-2/special-projections.mdx'),
    'development-drawings': () =>
      import('@/content/sources/hs-basic-tech-2/development-drawings.mdx'),
    'cad-drafting': () => import('@/content/sources/hs-basic-tech-2/cad-drafting.mdx'),
    'electropneumatic-circuits': () =>
      import('@/content/sources/hs-basic-tech-2/electropneumatic-circuits.mdx'),
    'pneumatics-maintenance': () =>
      import('@/content/sources/hs-basic-tech-2/pneumatics-maintenance.mdx'),
    'pneumatics-practice': () =>
      import('@/content/sources/hs-basic-tech-2/pneumatics-practice.mdx'),
    'electrohydraulic-circuits': () =>
      import('@/content/sources/hs-basic-tech-2/electrohydraulic-circuits.mdx'),
    'hydraulics-practice': () =>
      import('@/content/sources/hs-basic-tech-2/hydraulics-practice.mdx'),
    'microprocessor-basics': () =>
      import('@/content/sources/hs-basic-tech-2/microprocessor-basics.mdx'),
    'microprocessor-practice': () =>
      import('@/content/sources/hs-basic-tech-2/microprocessor-practice.mdx'),
    'arduino-practice': () => import('@/content/sources/hs-basic-tech-2/arduino-practice.mdx'),
  },
};

export function listSchoolTextSourceIds(): string[] {
  return Object.keys(REGISTRY);
}

/** 공용 라우트가 이 자료원을 담당하는지 — REGISTRY 키 멤버십 */
export function isSchoolTextSource(sourceId: string): boolean {
  return Object.prototype.hasOwnProperty.call(REGISTRY, sourceId);
}

/** 이 모듈에 대한 로더가 등록돼 있는지 — sections↔REGISTRY 정합성 검증용 */
export function hasModuleLoader(sourceId: string, moduleId: string): boolean {
  const registry = REGISTRY[sourceId];
  return registry !== undefined && Object.prototype.hasOwnProperty.call(registry, moduleId);
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
