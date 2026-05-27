'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getOrderedProcesses } from '@/lib/content';
import type { Process, ProcessId } from '@/lib/types';

interface ProcessDiagramProps {
  activeId?: ProcessId;
  variant?: 'full' | 'compact';
}

const colorBg: Record<string, string> = {
  'process-wafer': 'bg-slate-500',
  'process-cleaning': 'bg-cyan-500',
  'process-diffusion': 'bg-orange-500',
  'process-photolithography': 'bg-purple-500',
  'process-etching': 'bg-red-500',
  'process-deposition': 'bg-green-500',
  'process-ion-implantation': 'bg-yellow-500',
  'process-cmp': 'bg-blue-500',
  'process-packaging': 'bg-pink-500',
};

export function ProcessDiagram({ activeId, variant = 'full' }: ProcessDiagramProps) {
  const processes = getOrderedProcesses();
  const [hoverId, setHoverId] = useState<ProcessId | null>(null);
  const focused = processes.find((p) => p.id === hoverId);

  return (
    <section
      aria-label="반도체 제조 8대 공정 다이어그램"
      className="not-prose"
    >
      <div className="overflow-x-auto pb-4">
        <ol className="flex min-w-max items-stretch gap-2 px-1">
          {processes.map((p, idx) => (
            <li key={p.id} className="flex items-center gap-2">
              <ProcessNode
                process={p}
                active={p.id === activeId}
                hovered={p.id === hoverId}
                onHover={setHoverId}
                variant={variant}
              />
              {idx < processes.length - 1 && (
                <ChevronRight
                  aria-hidden
                  className="size-5 shrink-0 text-slate-400 dark:text-slate-600"
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* 모바일 시트: 호버된 공정 정보 */}
      {focused && variant === 'full' && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {focused.nameKo}
            <span className="ml-2 text-sm font-normal text-slate-500">
              {focused.nameEn}
            </span>
          </h3>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{focused.oneLine}</p>
          {focused.hazardKeywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                주요 위험:
              </span>
              {focused.hazardKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-800 dark:bg-red-950 dark:text-red-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/process/${focused.slug}/`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            자세히 보기
            <ChevronRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}

interface ProcessNodeProps {
  process: Process;
  active: boolean;
  hovered: boolean;
  onHover: (id: ProcessId | null) => void;
  variant: 'full' | 'compact';
}

function ProcessNode({ process: p, active, hovered, onHover, variant }: ProcessNodeProps) {
  return (
    <Link
      href={`/process/${p.slug}/`}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(p.id)}
      onBlur={() => onHover(null)}
      aria-label={`${p.order}단계: ${p.nameKo}. ${p.oneLine}`}
      className={cn(
        'group flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-3 text-center transition',
        variant === 'compact' ? 'min-w-[110px]' : 'min-w-[130px]',
        'hover:-translate-y-1 hover:shadow-md',
        active
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
          : hovered
            ? 'border-slate-400 bg-slate-50 dark:bg-slate-800'
            : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
      )}
    >
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full text-white text-sm font-bold',
          colorBg[p.color] ?? 'bg-slate-500',
        )}
      >
        {p.order}
      </div>
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {p.nameKo}
      </div>
      {variant === 'full' && (
        <div className="text-xs text-slate-500 dark:text-slate-400">{p.nameEn}</div>
      )}
    </Link>
  );
}
