import type { ComponentType } from 'react';

const chapterMdxLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  '01-risks-of-new-tech': () => import('@/content/chapters/01-risks-of-new-tech.mdx'),
  '02-semiconductor': () => import('@/content/chapters/02-semiconductor.mdx'),
  '03-process-overview': () => import('@/content/chapters/03-process-overview.mdx'),
  '04-cleanroom': () => import('@/content/chapters/04-cleanroom.mdx'),
  '05-wafer': () => import('@/content/chapters/05-wafer.mdx'),
  '06-cleaning': () => import('@/content/chapters/06-cleaning.mdx'),
  '07-diffusion': () => import('@/content/chapters/07-diffusion.mdx'),
  '08-photolithography': () => import('@/content/chapters/08-photolithography.mdx'),
  '09-etching': () => import('@/content/chapters/09-etching.mdx'),
  '10-deposition': () => import('@/content/chapters/10-deposition.mdx'),
  '11-ion-implantation': () => import('@/content/chapters/11-ion-implantation.mdx'),
  '12-cmp': () => import('@/content/chapters/12-cmp.mdx'),
  '13-packaging': () => import('@/content/chapters/13-packaging.mdx'),
  '14-chemicals-usage': () => import('@/content/chapters/14-chemicals-usage.mdx'),
  '15-electromagnetic': () => import('@/content/chapters/15-electromagnetic.mdx'),
  '16-occupational-disease': () => import('@/content/chapters/16-occupational-disease.mdx'),
  '17-industrial-health-view': () => import('@/content/chapters/17-industrial-health-view.mdx'),
};

export async function loadChapterMdx(chapterId: string): Promise<ComponentType | null> {
  const loader = chapterMdxLoaders[chapterId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
