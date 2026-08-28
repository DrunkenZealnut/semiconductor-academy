import { DiagramFrame } from './DiagramFrame';
import { CARD } from './tokens';
import type { DiagramCommon } from './types';

type Leaf = string | { label: string; note?: string; children?: Leaf[] };

interface Branch {
  label: string;
  note?: string;
  children?: Leaf[];
}

interface Props extends DiagramCommon {
  root: string;
  branches: Branch[];
  /** 2 = 뿌리→가지, 3 = 뿌리→가지→잎. 기본 3. */
  depth?: 2 | 3;
}

const norm = (leaf: Leaf) => (typeof leaf === 'string' ? { label: leaf } : leaf);

/**
 * 분류 트리 (주 8 · 보조 1 = 9모듈). 002·016·024·026·042·076·col-5 등
 * "큰 갈래 → 세부 → 예" 구조를 담는다.
 * Design §2.2 #8 — V-1에서 신설된 4종 중 하나.
 *
 * SVG 대신 HTML 들여쓰기 + 테두리로 가지를 그린다. 한국어 라벨 길이가 제각각이라
 * 좌표 배치보다 흐름 배치가 깨지지 않는다.
 */
export function TreeBranch({ root, branches, depth = 3, caption, note, altTable }: Props) {
  return (
    <DiagramFrame kind="TreeBranch" caption={caption} note={note} altTable={altTable}>
      <div className="space-y-2">
        <div className={`${CARD} px-4 py-2 text-center text-sm font-semibold text-slate-800 dark:text-slate-100`}>
          {root}
        </div>

        <ul className="space-y-2">
          {branches.map((b) => (
            <li
              key={b.label}
              className="ml-3 border-l-2 border-slate-200 pl-4 dark:border-slate-700"
            >
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {b.label}
                </span>
                {b.note && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">{b.note}</span>
                )}
              </div>

              {depth === 3 && b.children && b.children.length > 0 && (
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {b.children.map((raw, i) => {
                    const c = norm(raw);
                    return (
                      <li
                        key={`${b.label}-${i}`}
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {c.label}
                        {c.note && (
                          <span className="ml-1 text-slate-400 dark:text-slate-500">{c.note}</span>
                        )}
                        {c.children && c.children.length > 0 && (
                          <span className="ml-1 text-slate-400 dark:text-slate-500">
                            ({c.children.map((g) => norm(g).label).join(', ')})
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </DiagramFrame>
  );
}
