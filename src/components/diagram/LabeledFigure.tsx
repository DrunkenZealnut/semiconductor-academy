import type { ReactNode } from 'react';
import { DiagramFrame } from './DiagramFrame';
import { DIM, STROKE, TEXT_MUTED } from './tokens';
import type { DiagramCommon } from './types';

interface Label {
  /** viewBox 좌표. */
  x: number;
  y: number;
  text: string;
  /** 지시선을 그릴 대상 좌표. 생략하면 선 없이 글자만. */
  pointTo?: [number, number];
  anchor?: 'start' | 'middle' | 'end';
}

interface Props extends DiagramCommon {
  /** 인라인 SVG 내용. 좌표계는 viewBox를 따른다. */
  children: ReactNode;
  labels?: Label[];
  /** 기본 `0 0 640 320`. */
  viewBox?: string;
}

/**
 * 11종이 커버하지 못하는 예외 모듈의 탈출구 (2모듈: 055 CZ 인상 · 080 FinFET 입체).
 * Design §2.2 #12 · R-2 — 저작자가 인라인 SVG를 주고 라벨·지시선만 이 컴포넌트가 얹는다.
 *
 * 남용하면 전용 SVG 방식(Phase 2에서 탈락시킨 B안)으로 되돌아간다.
 * 새 패턴이 3모듈 이상에서 반복되면 전용 컴포넌트로 승격을 검토한다.
 */
export function LabeledFigure({
  children,
  labels = [],
  viewBox = `0 0 ${DIM.width} 320`,
  caption,
  note,
  altTable,
}: Props) {
  return (
    <DiagramFrame caption={caption} note={note} altTable={altTable} scrollable>
      <svg
        viewBox={viewBox}
        className="mx-auto h-auto w-full"
        role="img"
        aria-label={caption ?? '도해'}
      >
        <title>{caption ?? '도해'}</title>
        {children}
        {labels.map((l, i) => (
          <g key={`label-${i}`}>
            {l.pointTo && (
              <line
                x1={l.x}
                y1={l.y}
                x2={l.pointTo[0]}
                y2={l.pointTo[1]}
                className={STROKE}
                strokeWidth={DIM.stroke}
                strokeDasharray="3 2"
              />
            )}
            <text
              x={l.x}
              y={l.y}
              fontSize={DIM.fontSmall}
              textAnchor={l.anchor ?? 'start'}
              className={TEXT_MUTED}
            >
              {l.text.split('\n').map((line, j) => (
                <tspan key={j} x={l.x} dy={j === 0 ? 0 : DIM.fontSmall + 2}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
