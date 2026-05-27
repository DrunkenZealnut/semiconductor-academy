import type { ComponentType } from 'react';

/**
 * 공정별 MDX 본문 매핑.
 * MDX 파일이 있는 공정만 등록. 없는 공정은 JSON 메타데이터만으로 렌더링.
 *
 * 새 공정 MDX 추가 시: `src/content/processes/{slug}.mdx` 작성 후 여기에 import 추가.
 */
const processMdxLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  photolithography: () => import('@/content/processes/photolithography.mdx'),
  etching: () => import('@/content/processes/etching.mdx'),
  'ion-implantation': () => import('@/content/processes/ion-implantation.mdx'),
};

export async function loadProcessMdx(slug: string): Promise<ComponentType | null> {
  const loader = processMdxLoaders[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

export function hasProcessMdx(slug: string): boolean {
  return slug in processMdxLoaders;
}
