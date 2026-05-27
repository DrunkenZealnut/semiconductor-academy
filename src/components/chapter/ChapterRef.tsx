import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getChapterByOrder } from '@/lib/chapters';

interface Props {
  order: number;
}

export function ChapterRef({ order }: Props) {
  const chapter = getChapterByOrder(order);
  if (!chapter) return null;
  return (
    <Link
      href={`/chapter/${chapter.slug}/`}
      className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-sm font-semibold text-brand-700 no-underline hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-300"
    >
      Chapter {chapter.order}. {chapter.shortTitle ?? chapter.title}
      <ChevronRight className="size-3" />
    </Link>
  );
}
