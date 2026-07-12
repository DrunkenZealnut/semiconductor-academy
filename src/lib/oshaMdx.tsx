import type { ComponentType } from 'react';
import type { SourceLanguage } from '@/lib/types';

const enLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'part-1a': () => import('@/content/sources/osha-scs/part-1a.mdx'),
  'part-1b': () => import('@/content/sources/osha-scs/part-1b.mdx'),
  'part-2': () => import('@/content/sources/osha-scs/part-2.mdx'),
  'part-3': () => import('@/content/sources/osha-scs/part-3.mdx'),
  'part-4': () => import('@/content/sources/osha-scs/part-4.mdx'),
};

// 한글 번역이 준비된 Part만 등록한다.
// 확장: {partId}.ko.mdx 작성 후 여기에 한 줄 등록하면 토글이 자동 노출된다 (컴포넌트/페이지 코어 무수정).
const koLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'part-1a': () => import('@/content/sources/osha-scs/part-1a.ko.mdx'),
  'part-1b': () => import('@/content/sources/osha-scs/part-1b.ko.mdx'),
  'part-2': () => import('@/content/sources/osha-scs/part-2.ko.mdx'),
  'part-3': () => import('@/content/sources/osha-scs/part-3.ko.mdx'),
  'part-4': () => import('@/content/sources/osha-scs/part-4.ko.mdx'),
};

/** 한글 번역 가용 여부 — 토글 노출 판단 (FR-7) */
export function hasOshaScsKo(partId: string): boolean {
  return partId in koLoaders;
}

/**
 * OSHA SCS Part MDX 로더.
 * - `lang` 기본값 `'en'` → 기존 호출(`loadOshaScsPartMdx(part)`)과 호환.
 * - `ko` 요청 시 해당 Part 번역본이 없으면 `null` 반환 → 호출부에서 en fallback (FR-2/FR-3).
 */
export async function loadOshaScsPartMdx(
  partId: string,
  lang: SourceLanguage = 'en',
): Promise<ComponentType | null> {
  const registry = lang === 'ko' ? koLoaders : enLoaders;
  const loader = registry[partId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
