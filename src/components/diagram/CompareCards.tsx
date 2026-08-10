import type { ReactNode } from 'react';
import { DiagramFrame } from './DiagramFrame';
import { CARD, TONE, type Tone } from './tokens';
import type { DiagramCommon } from './types';

interface Column {
  title: string;
  tone?: Tone;
}

interface Row {
  aspect: string;
  /** columns와 같은 길이. */
  values: ReactNode[];
}

interface Props extends DiagramCommon {
  columns: Column[];
  rows: Row[];
  /** 강조할 rows 인덱스. */
  emphasis?: number[];
}

/**
 * 2~3열 대조. 실측 최다 사용 2위(주 20 · 보조 6 = 26모듈).
 * Design §2.2 #3
 *
 * 모바일에서는 열 단위로 세로 스택되어 각 열이 독립 카드로 읽힌다 —
 * 좁은 화면에서 3열 표가 뭉개지는 것을 피하려는 것이다.
 */
export function CompareCards({ columns, rows, emphasis = [], caption, note, altTable }: Props) {
  const strong = new Set(emphasis);

  return (
    <DiagramFrame caption={caption} note={note} altTable={altTable}>
      {/* 좁은 화면: 열별 카드 */}
      <div className="space-y-3 sm:hidden">
        {columns.map((col, ci) => (
          <div key={col.title} className={`${CARD} p-4`}>
            <ColumnTitle col={col} />
            <dl className="mt-2 space-y-1.5">
              {rows.map((row, ri) => (
                <div key={row.aspect} className="flex gap-2 text-sm">
                  <dt className="w-24 shrink-0 text-slate-500 dark:text-slate-400">{row.aspect}</dt>
                  <dd
                    className={
                      strong.has(ri)
                        ? 'font-semibold text-slate-900 dark:text-slate-50'
                        : 'text-slate-700 dark:text-slate-200'
                    }
                  >
                    {row.values[ci]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* 넓은 화면: 대조 격자 */}
      <div className="hidden sm:block">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `minmax(5rem, 8rem) repeat(${columns.length}, 1fr)` }}
        >
          <div aria-hidden />
          {columns.map((col) => (
            <div key={col.title} className={`${CARD} px-3 py-2 text-center`}>
              <ColumnTitle col={col} />
            </div>
          ))}

          {rows.map((row, ri) => (
            <div key={row.aspect} className="contents">
              <div className="self-center py-2 text-sm text-slate-500 dark:text-slate-400">
                {row.aspect}
              </div>
              {row.values.map((v, ci) => (
                <div
                  key={`${row.aspect}-${ci}`}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    strong.has(ri)
                      ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-50'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DiagramFrame>
  );
}

function ColumnTitle({ col }: { col: Column }) {
  const accent = col.tone ? TONE[col.tone].fill.replace(/fill-/g, 'bg-') : '';
  return (
    <>
      {col.tone && <span className={`mb-1 block h-1 w-full rounded ${accent}`} aria-hidden />}
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{col.title}</span>
    </>
  );
}
