import { ChevronRight, ChevronDown, RotateCcw } from 'lucide-react';
import { DiagramFrame } from './DiagramFrame';
import { CARD, TONE, type Tone } from './tokens';
import type { DiagramCommon } from './types';

interface Step {
  id: string;
  label: string;
  sub?: string;
  tone?: Tone;
}

interface Branch {
  /** 이 단계 아래에 하위 흐름을 편다. */
  at: string;
  label: string;
  steps: Step[];
}

interface Props extends DiagramCommon {
  steps: Step[];
  loop?: { from: string; to: string; label: string };
  branch?: Branch[];
  /** auto = 모바일 세로 / sm 이상 가로. 기본 auto. */
  orientation?: 'auto' | 'row' | 'column';
}

const WRAP: Record<NonNullable<Props['orientation']>, string> = {
  auto: 'flex flex-col items-stretch gap-2 sm:flex-row sm:items-center',
  row: 'flex flex-row items-center gap-2',
  column: 'flex flex-col items-stretch gap-2',
};

function StepCard({ step, dense = false }: { step: Step; dense?: boolean }) {
  const accent = step.tone ? TONE[step.tone].fill.replace(/fill-/g, 'bg-') : '';
  return (
    <div className={`${CARD} ${dense ? 'px-3 py-2' : 'px-4 py-3'} flex-1 text-center`}>
      {step.tone && <span className={`mb-1 block h-1 w-full rounded ${accent}`} aria-hidden />}
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{step.label}</div>
      {step.sub && (
        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{step.sub}</div>
      )}
    </div>
  );
}

function Arrow({ orientation }: { orientation: NonNullable<Props['orientation']> }) {
  const cls = 'size-4 shrink-0 self-center text-slate-400 dark:text-slate-500';
  if (orientation === 'row') return <ChevronRight aria-hidden className={cls} />;
  if (orientation === 'column') return <ChevronDown aria-hidden className={cls} />;
  return (
    <>
      <ChevronDown aria-hidden className={`${cls} sm:hidden`} />
      <ChevronRight aria-hidden className={`${cls} hidden sm:block`} />
    </>
  );
}

/**
 * 공정·동작의 순서 흐름. 주 18 · 보조 1 = 19모듈.
 * Design §2.2 #2 — 분기 자식은 `branch`에만 두고 최상위 `steps`와 중복 기재하지 않는다.
 */
export function FlowSteps({
  steps,
  loop,
  branch = [],
  orientation = 'auto',
  caption,
  note,
  altTable,
}: Props) {
  const branchOf = (id: string) => branch.filter((b) => b.at === id);

  return (
    <DiagramFrame caption={caption} note={note} altTable={altTable}>
      <div className="space-y-3">
        <div className={WRAP[orientation]}>
          {steps.map((step, i) => (
            <div key={step.id} className="contents">
              {i > 0 && <Arrow orientation={orientation} />}
              <StepCard step={step} />
            </div>
          ))}
        </div>

        {loop && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <RotateCcw aria-hidden className="size-3.5" />
            {loop.label}
          </div>
        )}

        {steps.map((step) =>
          branchOf(step.id).map((b, bi) => (
            <div
              key={`${step.id}-b${bi}`}
              className="ml-4 border-l-2 border-dashed border-slate-300 pl-4 dark:border-slate-600"
            >
              <div className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">{b.label}</div>
              <div className={WRAP[orientation]}>
                {b.steps.map((s, i) => (
                  <div key={s.id} className="contents">
                    {i > 0 && <Arrow orientation={orientation} />}
                    <StepCard step={s} dense />
                  </div>
                ))}
              </div>
            </div>
          )),
        )}
      </div>
    </DiagramFrame>
  );
}
