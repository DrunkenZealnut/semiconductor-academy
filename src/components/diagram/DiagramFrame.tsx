import type { ReactNode } from 'react';
import type { DiagramCommon } from './types';

/**
 * 12종이 공유하는 바깥 틀 — caption·note·altTable 처리를 한 곳에 모은다.
 * Design §4: 접근성(표 대체 텍스트)·반응형(넓은 도해는 자기 컨테이너에서만 스크롤).
 */
export function DiagramFrame({
  caption,
  note,
  altTable,
  scrollable = false,
  children,
}: DiagramCommon & { scrollable?: boolean; children: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div className={scrollable ? 'overflow-x-auto' : undefined}>{children}</div>

      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {caption}
        </figcaption>
      )}

      {note && (
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-500">{note}</p>
      )}

      {altTable && (
        <details className="mt-3 rounded-lg border border-slate-200 text-sm dark:border-slate-700">
          <summary className="cursor-pointer px-3 py-2 text-slate-600 dark:text-slate-400">
            표로 보기
          </summary>
          {/* not-prose 안이라 표 기본 스타일이 죽는다 — 최소 스타일을 여기서 준다. */}
          <div
            className="overflow-x-auto px-3 pb-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border-t [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1.5 [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold [&_thead]:text-slate-500 dark:[&_td]:border-slate-700 dark:[&_thead]:text-slate-400"
          >
            {altTable}
          </div>
        </details>
      )}
    </figure>
  );
}
