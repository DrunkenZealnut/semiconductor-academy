import type { ComponentType } from 'react';

/**
 * 대구반도체고 교과서 「반도체 공정기초」 MDX 로더 레지스트리.
 * 동적 라우트(`/sources/daegu-hs-process/[module]`)에서 MDX를 직접 import할 수 없어 로더 맵을 쓴다.
 * 확장: 새 모듈 `{module}.mdx` 작성 후 여기에 한 줄 등록 (컴포넌트/페이지 코어 무수정).
 */
const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'process-overview': () => import('@/content/sources/daegu-hs-process/process-overview.mdx'),
  'equipment-parameters': () => import('@/content/sources/daegu-hs-process/equipment-parameters.mdx'),
  photo: () => import('@/content/sources/daegu-hs-process/photo.mdx'),
  etch: () => import('@/content/sources/daegu-hs-process/etch.mdx'),
  'thin-film': () => import('@/content/sources/daegu-hs-process/thin-film.mdx'),
  metallization: () => import('@/content/sources/daegu-hs-process/metallization.mdx'),
  oxidation: () => import('@/content/sources/daegu-hs-process/oxidation.mdx'),
  doping: () => import('@/content/sources/daegu-hs-process/doping.mdx'),
  cmp: () => import('@/content/sources/daegu-hs-process/cmp.mdx'),
  cleaning: () => import('@/content/sources/daegu-hs-process/cleaning.mdx'),
};

export async function loadDaeguModuleMdx(moduleId: string): Promise<ComponentType | null> {
  const loader = loaders[moduleId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
