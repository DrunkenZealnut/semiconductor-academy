import { Sparkles, Lightbulb } from 'lucide-react';
import { Disclosure } from '@/components/ui/Disclosure';
import type { ReactNode } from 'react';

interface LayeredExplainProps {
  hook: ReactNode;
  easy: {
    analogy: ReactNode;
    illustration?: ReactNode;
  };
  deep?: {
    quote?: ReactNode;
    sourcePage?: number;
    sourceSection?: string;
  };
}

export function LayeredExplain({ hook, easy, deep }: LayeredExplainProps) {
  return (
    <div className="not-prose my-6 space-y-3">
      {/* Layer 1: Hook */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-4 text-white shadow-md">
        <div className="flex items-start gap-2">
          <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0" />
          <p className="text-lg font-semibold leading-snug">{hook}</p>
        </div>
      </div>

      {/* Layer 2: Easy */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
          <Lightbulb aria-hidden className="size-4" />
          쉽게 말하면
        </div>
        <div className="text-base leading-relaxed text-slate-800 dark:text-slate-100">
          {easy.analogy}
        </div>
        {easy.illustration && (
          <div className="mt-4 flex justify-center">{easy.illustration}</div>
        )}
      </div>

      {/* Layer 3: Deep (optional, collapsed) */}
      {deep && (deep.quote || deep.sourcePage) && (
        <Disclosure
          title={`📖 학술 원본 보기${
            deep.sourcePage ? ` (p.${deep.sourcePage})` : ''
          }${deep.sourceSection ? ` — ${deep.sourceSection}` : ''}`}
        >
          {deep.quote ?? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              원본 자료에서 해당 페이지를 참고하세요.
            </p>
          )}
        </Disclosure>
      )}
    </div>
  );
}
