import type { ComponentType } from 'react';

/**
 * NCS 반도체 학습모듈 MDX 로더 레지스트리.
 * 동적 라우트(`/sources/ncs-semi/[module]`)에서 MDX를 직접 import할 수 없어 로더 맵을 쓴다.
 * 확장: 새 모듈 `{module}.mdx` 작성 후 여기에 한 줄 등록 (컴포넌트/페이지 코어 무수정).
 */
const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'photo-equipment': () => import('@/content/sources/ncs-semi/photo-equipment.mdx'),
  'quality-control': () => import('@/content/sources/ncs-semi/quality-control.mdx'),
  'productivity': () => import('@/content/sources/ncs-semi/productivity.mdx'),
  'equipment-design': () => import('@/content/sources/ncs-semi/equipment-design.mdx'),
  'equipment-assembly': () => import('@/content/sources/ncs-semi/equipment-assembly.mdx'),
};

export async function loadNcsModuleMdx(moduleId: string): Promise<ComponentType | null> {
  const loader = loaders[moduleId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
