import type { Source } from '@/lib/types';

/**
 * accent별 카드 테두리 클래스 — PerspectiveCatalog(홈 카드)·RelatedItemCard(cross-link 카드) 공용.
 * accent 추가 시 여기 한 곳만 수정 (typed Record라 누락은 typecheck가 잡음).
 */
export const SOURCE_ACCENT_BORDER: Record<NonNullable<Source['accent']>, string> = {
  book: 'border-brand-200 hover:border-brand-400 dark:border-brand-900 dark:hover:border-brand-700',
  osha: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-900 dark:hover:border-emerald-700',
  standard:
    'border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500',
  school: 'border-amber-200 hover:border-amber-400 dark:border-amber-900 dark:hover:border-amber-700',
};
