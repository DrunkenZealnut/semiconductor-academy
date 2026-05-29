'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg';

const SIZES: { key: Size; label: string; px: number }[] = [
  { key: 'sm', label: '작게', px: 16 },
  { key: 'md', label: '보통', px: 18 },
  { key: 'lg', label: '크게', px: 21 },
];

export function FontSizeToggle() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Size>('md');
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem('font-size') as Size) ?? 'md';
    setCurrent(stored);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const apply = (k: Size) => {
    setCurrent(k);
    localStorage.setItem('font-size', k);
    const html = document.documentElement;
    html.classList.remove('font-sm', 'font-md', 'font-lg');
    html.classList.add('font-' + k);
    setOpen(false);
  };

  if (!mounted) return <div className="size-9" aria-hidden />;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="글자 크기 조정"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <span className="font-semibold leading-none">
          A<span className="text-[10px]">a</span>
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {SIZES.map((s) => (
            <button
              key={s.key}
              type="button"
              role="menuitem"
              onClick={() => apply(s.key)}
              className={cn(
                'flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition',
                current === s.key
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800',
              )}
            >
              <span style={{ fontSize: s.px }}>{s.label}</span>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                {s.px}px
                {current === s.key && <Check aria-hidden className="size-4 text-brand-600" />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
