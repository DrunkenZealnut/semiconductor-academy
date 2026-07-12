import type { ComponentType } from 'react';

/**
 * NCS 반도체 학습모듈 MDX 로더 레지스트리.
 * 동적 라우트(`/sources/ncs-semi/[module]`)에서 MDX를 직접 import할 수 없어 로더 맵을 쓴다.
 * 확장: 새 모듈 `{module}.mdx` 작성 후 여기에 한 줄 등록 (컴포넌트/페이지 코어 무수정).
 */
const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'product-planning': () => import('@/content/sources/ncs-semi/product-planning.mdx'),
  'architecture-design': () => import('@/content/sources/ncs-semi/architecture-design.mdx'),
  'digital-circuit-design': () => import('@/content/sources/ncs-semi/digital-circuit-design.mdx'),
  'custom-layout-verification': () => import('@/content/sources/ncs-semi/custom-layout-verification.mdx'),
  'system-process-development': () => import('@/content/sources/ncs-semi/system-process-development.mdx'),
  'firmware-development': () => import('@/content/sources/ncs-semi/firmware-development.mdx'),
  'package-product-design': () => import('@/content/sources/ncs-semi/package-product-design.mdx'),
  'flip-package-development': () => import('@/content/sources/ncs-semi/flip-package-development.mdx'),
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
