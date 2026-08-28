import { DiagramFrame } from './DiagramFrame';
import type { DiagramCommon } from './types';

type Bit = 0 | 1;

interface Props extends DiagramCommon {
  inputs: string[];
  outputs: string[];
  /** 각 행은 [...inputs, ...outputs] 길이의 0/1 배열. */
  rows: Bit[][];
  /** 이 값을 내는 출력 칸을 강조한다. 기본 1. */
  highlight?: Bit | null;
}

const BIT: Record<Bit, string> = {
  0: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  1: 'bg-brand-500 text-white',
};

/**
 * 논리 게이트·가산기 진리표. 8모듈(027~033·041).
 * Design §2.2 #4 — 0/1만 담는다. 정성값 표('0 (GND에 연결)' 등)는
 * NodeGraph 라벨이나 CompareCards로 보낸다.
 */
export function TruthTable({
  inputs,
  outputs,
  rows,
  highlight = 1,
  caption,
  note,
  altTable,
}: Props) {
  const nIn = inputs.length;

  return (
    <DiagramFrame kind="TruthTable" caption={caption} note={note} altTable={altTable} scrollable>
      <table className="mx-auto border-separate border-spacing-1 text-center text-sm">
        <thead>
          <tr>
            {inputs.map((h) => (
              <th
                key={`in-${h}`}
                scope="col"
                className="px-3 py-1 font-medium text-slate-500 dark:text-slate-400"
              >
                {h}
              </th>
            ))}
            {outputs.map((h) => (
              <th
                key={`out-${h}`}
                scope="col"
                className="border-l border-slate-200 px-3 py-1 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={`r${ri}`}>
              {row.map((bit, ci) => {
                const isOutput = ci >= nIn;
                const lit = isOutput && highlight !== null && bit === highlight;
                return (
                  <td
                    key={`r${ri}c${ci}`}
                    className={`${isOutput ? 'border-l border-slate-200 dark:border-slate-700' : ''} px-1`}
                  >
                    <span
                      className={`inline-flex size-7 items-center justify-center rounded-md font-mono ${
                        lit ? BIT[1] : BIT[0]
                      }`}
                    >
                      {bit}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </DiagramFrame>
  );
}
