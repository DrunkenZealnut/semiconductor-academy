'use client';

import { useState, type ReactNode } from 'react';
import { getTermById } from '@/lib/content';
import { cn } from '@/lib/cn';

interface TermProps {
  id: string;
  children: ReactNode;
}

export function Term({ id, children }: TermProps) {
  const [open, setOpen] = useState(false);
  const term = getTermById(id);

  if (!term) {
    return <span>{children}</span>;
  }

  return (
    <span className="relative inline">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-describedby={open ? `term-${id}` : undefined}
        className="cursor-help border-b border-dashed border-brand-500 text-brand-700 dark:text-brand-300"
      >
        {children}
      </button>
      {open && (
        <span
          id={`term-${id}`}
          role="tooltip"
          className={cn(
            'absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal text-slate-700 shadow-lg',
            'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
          )}
        >
          <span className="block font-semibold text-slate-900 dark:text-slate-100">
            {term.termKo}
            {term.termEn && (
              <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                ({term.termEn})
              </span>
            )}
          </span>
          <span className="mt-1 block">{term.shortDef}</span>
        </span>
      )}
    </span>
  );
}
