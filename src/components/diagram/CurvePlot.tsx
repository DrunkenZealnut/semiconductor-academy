import { DiagramFrame } from './DiagramFrame';
import { DIM, STROKE, TEXT, TEXT_MUTED } from './tokens';
import type { DiagramCommon } from './types';

interface Axis {
  label: string;
  /** 눈금 이름. 생략이 기본 — 원문에 없는 수치를 축에 찍지 않는다(§2.3). */
  ticks?: string[];
}

interface Curve {
  label: string;
  /** 0~1로 정규화한 좌표. 정성적 형상만 표현한다. */
  points: [number, number][];
  emphasis?: boolean;
}

interface Props extends DiagramCommon {
  axes: { x: Axis; y: Axis };
  curves: Curve[];
  /** 원문이 이름으로 언급한 지점만 표시 (예: V_TH). */
  markers?: { at: [number, number]; label: string }[];
}

const PLOT_W = 420;
const PLOT_H = 240;
const LEFT = 56;
const TOP = 16;

/**
 * 특성 곡선 (주 1 · 보조 4 = 5모듈: 011 C-V · 022 출력특성 · 041 타이밍 · col-8 욕조곡선).
 * Design §2.2 #9 · §2.3 데이터 출처 규약 — 원서에 좌표는 없고 형상 서술만 있으므로
 * **정성적 형상만** 그린다. 눈금 수치를 창작하지 않는다.
 */
export function CurvePlot({ axes, curves, markers = [], caption, note, altTable }: Props) {
  const width = LEFT + PLOT_W + DIM.pad * 2;
  const height = TOP + PLOT_H + 56;
  const x0 = LEFT;
  const y0 = TOP + PLOT_H;

  const px = (v: number) => x0 + v * PLOT_W;
  const py = (v: number) => y0 - v * PLOT_H;

  const toPath = (points: [number, number][]) =>
    points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${px(x)} ${py(y)}`).join(' ');

  return (
    <DiagramFrame caption={caption} note={note} altTable={altTable} scrollable>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto h-auto w-full"
        style={{ minWidth: width }}
        role="img"
        aria-label={caption ?? `${axes.x.label} 대 ${axes.y.label} 특성`}
      >
        <title>{caption ?? `${axes.x.label} 대 ${axes.y.label} 특성`}</title>
        <desc>
          {`가로축 ${axes.x.label}, 세로축 ${axes.y.label}. 곡선 ${curves.length}개` +
            (curves.some((c) => c.label) ? ` (${curves.map((c) => c.label).filter(Boolean).join(', ')})` : '') +
            (markers.length ? `. 표시 지점: ${markers.map((m) => m.label).join(', ')}` : '')}
        </desc>

        {/* 축 */}
        <line x1={x0} y1={y0} x2={x0 + PLOT_W} y2={y0} className={STROKE} strokeWidth={DIM.stroke} />
        <line x1={x0} y1={y0} x2={x0} y2={TOP} className={STROKE} strokeWidth={DIM.stroke} />

        <text
          x={x0 + PLOT_W / 2}
          y={y0 + 34}
          fontSize={DIM.font}
          textAnchor="middle"
          className={TEXT}
        >
          {axes.x.label}
        </text>
        <text
          x={-(TOP + PLOT_H / 2)}
          y={16}
          fontSize={DIM.font}
          textAnchor="middle"
          transform="rotate(-90)"
          className={TEXT}
        >
          {axes.y.label}
        </text>

        {axes.x.ticks?.map((t, i, arr) => {
          const x = px(arr.length === 1 ? 0.5 : i / (arr.length - 1));
          return (
            <text key={`xt${i}`} x={x} y={y0 + 16} fontSize={DIM.fontSmall} textAnchor="middle" className={TEXT_MUTED}>
              {t}
            </text>
          );
        })}
        {axes.y.ticks?.map((t, i, arr) => {
          const y = py(arr.length === 1 ? 0.5 : i / (arr.length - 1));
          return (
            <text key={`yt${i}`} x={x0 - 8} y={y + 4} fontSize={DIM.fontSmall} textAnchor="end" className={TEXT_MUTED}>
              {t}
            </text>
          );
        })}

        {curves.map((c, i) => (
          <g key={`c${i}`}>
            <path
              d={toPath(c.points)}
              fill="none"
              className={c.emphasis ? 'stroke-brand-500' : STROKE}
              strokeWidth={c.emphasis ? DIM.stroke * 2 : DIM.stroke * 1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {c.points.length > 0 && (
              <text
                x={px(c.points[c.points.length - 1][0]) + 4}
                y={py(c.points[c.points.length - 1][1]) + 4}
                fontSize={DIM.fontSmall}
                className={TEXT_MUTED}
              >
                {c.label}
              </text>
            )}
          </g>
        ))}

        {markers.map((m, i) => (
          <g key={`m${i}`}>
            <line
              x1={px(m.at[0])}
              y1={y0}
              x2={px(m.at[0])}
              y2={py(m.at[1])}
              className={STROKE}
              strokeWidth={DIM.stroke}
              strokeDasharray="3 3"
            />
            <text
              x={px(m.at[0])}
              y={py(m.at[1]) - 6}
              fontSize={DIM.fontSmall}
              textAnchor="middle"
              className={TEXT_MUTED}
            >
              {m.label}
            </text>
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
