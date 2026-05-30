import { cn } from '@/lib/cn';
import {
  SOURCE_KIND_LABELS,
  SOURCE_LANGUAGE_LABELS,
  SOURCE_LICENSE_LABELS,
} from '@/lib/types';
import type { Source } from '@/lib/types';

interface SourceBadgeProps {
  source: Source;
  /** 'lang' = 언어만 / 'kind' = 자료원 종류 / 'license' = 라이선스 / 'all' = 셋 다 */
  variant?: 'lang' | 'kind' | 'license' | 'all';
  className?: string;
}

const langStyle: Record<Source['language'], string> = {
  ko: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200',
  en: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200',
};

export function SourceBadge({ source, variant = 'lang', className }: SourceBadgeProps) {
  const base =
    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide';

  if (variant === 'lang') {
    return (
      <span
        className={cn(base, langStyle[source.language], className)}
        aria-label={`언어: ${source.language === 'ko' ? '한국어' : '영어'}`}
      >
        {SOURCE_LANGUAGE_LABELS[source.language]}
      </span>
    );
  }

  if (variant === 'kind') {
    return (
      <span
        className={cn(
          base,
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
          className,
        )}
      >
        {SOURCE_KIND_LABELS[source.kind]}
      </span>
    );
  }

  if (variant === 'license') {
    return (
      <span
        className={cn(
          base,
          'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
          className,
        )}
      >
        {SOURCE_LICENSE_LABELS[source.license]}
      </span>
    );
  }

  // variant === 'all'
  return (
    <span className={cn('inline-flex flex-wrap items-center gap-1.5', className)}>
      <SourceBadge source={source} variant="lang" />
      <SourceBadge source={source} variant="kind" />
      <SourceBadge source={source} variant="license" />
    </span>
  );
}
