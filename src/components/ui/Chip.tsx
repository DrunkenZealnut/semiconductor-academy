import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

/**
 * Toggle-style chip for filter controls.
 *
 * Built-in:
 *  - `aria-pressed` from `pressed` prop (toggle semantics for screen readers)
 *  - focus-visible ring (brand-400 + offset 2 + dark offset)
 *  - active/inactive 디자인 토큰 (brand-500 / slate-300)
 *
 * Single `outlined` variant. If a different visual style is needed
 * (e.g. solid bg without border for `/chemicals`), introduce a
 * `variant` prop in a separate cycle — current scope is QuoteIndex.
 *
 * @example
 * <Chip pressed={sourceFilter === 'all'} onClick={() => setSourceFilter('all')}>
 *   전체 117
 * </Chip>
 */
interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'aria-pressed'> {
  pressed: boolean;
}

export function Chip({ pressed, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        'rounded-full border px-3 py-1 font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
        pressed
          ? 'border-brand-500 bg-brand-500 text-white shadow-sm'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
