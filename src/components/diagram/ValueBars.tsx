import { DiagramFrame } from './DiagramFrame';
import { TONE, type Tone } from './tokens';
import type { DiagramCommon } from './types';

interface Row {
  label: string;
  /** 단일 값. range와 택일. */
  value?: number;
  /** 구간 값 [min, max]. 001 저항률·067 온도대처럼 구간이 논지일 때. */
  range?: [number, number];
  note?: string;
  tone?: Tone;
}

interface Props extends DiagramCommon {
  rows: Row[];
  unit: string;
  /** 자릿수 차가 크면 log. 기본 linear. */
  scale?: 'linear' | 'log';
  /** diverging은 기준선을 가운데 두고 양쪽으로 뻗는다 (088 유전율 상승/하강). */
  direction?: 'up' | 'down' | 'diverging';
}

const EPS = 1e-30;

/** log 스케일에서 0 이하 값은 표현할 수 없으므로 최솟값으로 눌러 둔다. */
const safeLog = (v: number) => Math.log10(Math.max(Math.abs(v), EPS));

/**
 * 자릿수 차가 큰 수치를 막대 길이로 (주 7 · 보조 4 = 11모듈).
 * Design §2.2 #5 — value·range 택일. 001 저항률(13자리)·067 온도대가 range를 쓴다.
 */
export function ValueBars({
  rows,
  unit,
  scale = 'linear',
  direction = 'up',
  caption,
  note,
  altTable,
}: Props) {
  const bounds = rows.flatMap((r) => (r.range ? r.range : r.value !== undefined ? [r.value] : []));
  const rawMin = Math.min(...bounds);
  const rawMax = Math.max(...bounds);

  const project = (v: number) => {
    if (scale === 'log') {
      const lo = safeLog(rawMin);
      const hi = safeLog(rawMax);
      return hi === lo ? 100 : ((safeLog(v) - lo) / (hi - lo)) * 100;
    }
    // diverging은 0을 반드시 축에 포함해 양수·음수가 기준선 양쪽으로 갈리게 한다.
    const lo = direction === 'diverging' ? Math.min(rawMin, 0) : rawMin;
    const hi = direction === 'diverging' ? Math.max(rawMax, 0) : rawMax;
    return hi === lo ? 100 : ((v - lo) / (hi - lo)) * 100;
  };

  const fmt = (v: number) =>
    Math.abs(v) >= 1e4 || (Math.abs(v) > 0 && Math.abs(v) < 1e-2)
      ? v.toExponential(1)
      : String(v);

  return (
    <DiagramFrame kind="ValueBars" caption={caption} note={note} altTable={altTable}>
      <ul className="space-y-2">
        {rows.map((r) => {
          const bar = r.tone ? TONE[r.tone].fill.replace(/fill-/g, 'bg-') : 'bg-brand-500';
          const start = r.range ? project(r.range[0]) : 0;
          const end = r.range ? project(r.range[1]) : project(r.value ?? 0);
          const width = Math.max(end - start, 1.5);

          return (
            <li key={r.label} className="grid grid-cols-[minmax(5rem,9rem)_1fr] items-center gap-3">
              <span className="text-sm text-slate-600 dark:text-slate-300">{r.label}</span>
              <div className="flex items-center gap-2">
                <div className="relative h-4 flex-1 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`absolute inset-y-0 rounded ${bar}`}
                    style={{ left: `${start}%`, width: `${width}%` }}
                  />
                </div>
                <span className="w-28 shrink-0 text-right font-mono text-xs text-slate-500 dark:text-slate-400">
                  {r.range ? `${fmt(r.range[0])}~${fmt(r.range[1])}` : fmt(r.value ?? 0)}
                  {r.note ? ` ${r.note}` : ''}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {/*
        단위는 **note와 독립으로** 항상 보여 준다.
        예전에는 `note={note ?? `단위: ${unit}`}`이었는데, note를 주면 단위가 조용히
        사라졌다 — 사이트 전체 ValueBars 29건 중 20건이 무단위로 렌더되고 있었고
        네 번의 Check와 세 번의 gap-detector를 모두 통과했다. `unit`이 필수 prop인데
        표시가 선택적이었던 것이 원인이다.
      */}
      {/* 대비: 단위·로그 눈금은 값 해석에 필요한 정보라 note와 같은 slate-500을 쓴다. */}
      {(unit || scale === 'log') && (
        <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          {unit && `단위: ${unit}`}
          {unit && scale === 'log' && ' · '}
          {scale === 'log' && '가로축은 로그 눈금 — 막대 한 칸이 자릿수 하나에 해당한다'}
        </p>
      )}
    </DiagramFrame>
  );
}
