'use client';

import { useState, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DisclosureProps {
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function Disclosure({ title, defaultOpen = false, children, className }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('rounded-xl border border-slate-200 dark:border-slate-800', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-100"
      >
        <span>{title}</span>
        <ChevronRight
          aria-hidden
          className={cn('size-4 shrink-0 transition-transform', open && 'rotate-90')}
        />
      </button>
      {open && (
        <div className="border-t border-slate-200 px-4 py-3 text-slate-700 dark:border-slate-800 dark:text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
}
