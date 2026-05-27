import { cn } from '@/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md',
        'dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
      {...props}
    />
  );
}
