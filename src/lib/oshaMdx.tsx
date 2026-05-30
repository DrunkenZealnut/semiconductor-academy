import type { ComponentType } from 'react';

const oshaScsMdxLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'part-1a': () => import('@/content/sources/osha-scs/part-1a.mdx'),
  'part-1b': () => import('@/content/sources/osha-scs/part-1b.mdx'),
  'part-2': () => import('@/content/sources/osha-scs/part-2.mdx'),
  'part-3': () => import('@/content/sources/osha-scs/part-3.mdx'),
  'part-4': () => import('@/content/sources/osha-scs/part-4.mdx'),
};

export async function loadOshaScsPartMdx(partId: string): Promise<ComponentType | null> {
  const loader = oshaScsMdxLoaders[partId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
