import { CHAPTER_CATEGORY_LABELS, CHAPTER_CATEGORY_COLOR, type ChapterCategory } from '@/lib/types';
import { cn } from '@/lib/cn';

interface Props {
  category: ChapterCategory;
  className?: string;
}

export function ChapterCategoryBadge({ category, className }: Props) {
  const c = CHAPTER_CATEGORY_COLOR[category];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        c.bg, c.text, c.bgDark, c.textDark,
        className,
      )}
    >
      {CHAPTER_CATEGORY_LABELS[category]}
    </span>
  );
}
