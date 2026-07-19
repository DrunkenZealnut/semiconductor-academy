import { Sparkles, Lightbulb } from 'lucide-react';
import { Disclosure } from '@/components/ui/Disclosure';
import type { ReactNode } from 'react';

// quote/summary는 상호배타 — 둘 다 지정하면(양쪽 disclosure 렌더) 타입 에러.
type DeepQuote = { quote: ReactNode; sourcePage?: number; sourceSection?: string; summary?: never };
type DeepSummary = { summary: ReactNode; sourceSection?: string; quote?: never };

interface LayeredExplainProps {
  hook: ReactNode;
  easy: {
    analogy: ReactNode;
    illustration?: ReactNode;
  };
  deep?: DeepQuote | DeepSummary;
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

      {/* Layer 3a: Deep — 원문 인용(verbatim) */}
      {deep && 'quote' in deep && deep.quote && (
        <Disclosure
          title={`📖 학술 원본 보기${
            deep.sourcePage ? ` (p.${deep.sourcePage})` : ''
          }${deep.sourceSection ? ` — ${deep.sourceSection}` : ''}`}
        >
          <blockquote className="border-l-4 border-brand-400 pl-4 italic text-slate-700 dark:text-slate-300">
            {deep.quote}
          </blockquote>
          {deep.sourcePage && (
            <p className="mt-2 text-right text-xs text-slate-500 dark:text-slate-400">
              — 「반도체 산업의 유해인자」 p.{deep.sourcePage}
            </p>
          )}
        </Disclosure>
      )}

      {/* Layer 3b: Deep — 요약/재서술(paraphrase) */}
      {deep && 'summary' in deep && deep.summary && (
        <Disclosure
          title={`📘 자료 정리 보기${
            deep.sourceSection ? ` — ${deep.sourceSection}` : ''
          }`}
        >
          <div className="border-l-4 border-slate-300 pl-4 text-slate-700 dark:border-slate-600 dark:text-slate-300">
            {deep.summary}
          </div>
        </Disclosure>
      )}
    </div>
  );
}
