import { notFound } from 'next/navigation';
import { ChapterHeader } from '@/components/chapter/ChapterHeader';
import { ChapterFooterNav } from '@/components/chapter/ChapterFooterNav';
import { chapters, getAdjacentChapters, getChapterBySlug } from '@/lib/chapters';
import { loadChapterMdx } from '@/lib/chaptersMdx';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return buildMetadata();
  return buildMetadata({
    title: `Chapter ${chapter.order}. ${chapter.shortTitle ?? chapter.title}`,
    description: chapter.subtitle ?? `「반도체 산업의 유해인자」 제${chapter.order}장`,
    path: `/chapter/${slug}/`,
  });
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const MdxBody = await loadChapterMdx(chapter.id);
  const { prev, next } = getAdjacentChapters(chapter.order);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <ChapterHeader chapter={chapter} />

      <div className="prose prose-lg max-w-none dark:prose-invert">
        {MdxBody ? <MdxBody /> : (
          <p className="text-slate-600 dark:text-slate-400">본문 준비 중입니다.</p>
        )}
      </div>

      <ChapterFooterNav prev={prev} next={next} />
    </article>
  );
}
