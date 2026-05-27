import { Info, AlertTriangle, Lightbulb, BookOpen, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type CalloutType = 'info' | 'warning' | 'tip' | 'source';

const config: Record<CalloutType, { icon: LucideIcon; classes: string; label: string }> = {
  info: {
    icon: Info,
    classes: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100',
    label: '알아두세요',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100',
    label: '주의',
  },
  tip: {
    icon: Lightbulb,
    classes: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100',
    label: '쉽게 말하면',
  },
  source: {
    icon: BookOpen,
    classes: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
    label: '원본 인용',
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const { icon: Icon, classes, label } = config[type];
  return (
    <div className={cn('not-prose my-4 rounded-xl border p-4', classes)}>
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <Icon aria-hidden className="size-4" />
        <span>{title ?? label}</span>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
