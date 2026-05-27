import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

interface TagProps extends ComponentPropsWithoutRef<'span'> {
  variant?: 'default' | 'critical' | 'high' | 'moderate' | 'low' | 'info';
}

const variantClasses: Record<NonNullable<TagProps['variant']>, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  high: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  low: 'bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
};

export function Tag({ variant = 'default', className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
