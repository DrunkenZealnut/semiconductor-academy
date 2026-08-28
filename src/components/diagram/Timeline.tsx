import { DiagramFrame } from './DiagramFrame';
import type { DiagramCommon } from './types';

interface Event {
  year: string;
  label: string;
  note?: string;
}

interface Props extends DiagramCommon {
  events: Event[];
  /** 강조할 events 인덱스. */
  emphasis?: number[];
}

/**
 * 연표 (3모듈: 025 집적도 · 050 최소치수 세대 · col-2 트랜지스터 탄생 · col-3 ENIAC).
 * Design §2.2 #11 — V-1에서 신설.
 *
 * 세로 축으로 흐르게 둔다. 한국어 설명이 길어 가로 축에 얹으면 좁은 화면에서 겹친다.
 */
export function Timeline({ events, emphasis = [], caption, note, altTable }: Props) {
  const strong = new Set(emphasis);

  return (
    <DiagramFrame kind="Timeline" caption={caption} note={note} altTable={altTable}>
      <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6 dark:border-slate-700">
        {events.map((e, i) => (
          <li key={`${e.year}-${i}`} className="relative">
            <span
              className={`absolute -left-[1.9rem] top-1 size-3 rounded-full ring-4 ring-white dark:ring-slate-950 ${
                strong.has(i) ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span
                className={`font-mono text-sm ${
                  strong.has(i)
                    ? 'font-semibold text-brand-700 dark:text-brand-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {e.year}
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {e.label}
              </span>
            </div>
            {e.note && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{e.note}</p>
            )}
          </li>
        ))}
      </ol>
    </DiagramFrame>
  );
}
