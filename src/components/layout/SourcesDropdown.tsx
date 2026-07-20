'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getGroupedSources } from '@/lib/sources';

const { standalone, groups } = getGroupedSources();

const itemClass =
  'block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100';

export function SourcesDropdown() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        자료원
        <ChevronDown
          aria-hidden
          className={cn('size-4 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="자료원 목록"
          className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          {standalone.map((s) => (
            <Link
              key={s.id}
              role="menuitem"
              href={`/sources/${s.id}/`}
              onClick={close}
              className={itemClass}
            >
              {s.title}
            </Link>
          ))}

          {groups.map((g) => (
            <Fragment key={g.category}>
              <div className="mt-1 border-t border-slate-100 px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800">
                {g.label}
              </div>
              {g.sources.map((s) => (
                <Link
                  key={s.id}
                  role="menuitem"
                  href={`/sources/${s.id}/`}
                  onClick={close}
                  className={itemClass}
                >
                  {s.title}
                </Link>
              ))}
            </Fragment>
          ))}

          <div className="mt-1 border-t border-slate-100 pt-1 dark:border-slate-800">
            <Link
              role="menuitem"
              href="/#sources"
              onClick={close}
              className="block rounded-md px-3 py-2 text-sm font-medium text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              전체 자료원 보기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
