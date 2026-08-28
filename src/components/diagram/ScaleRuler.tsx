import { DiagramFrame } from './DiagramFrame';
import { DIM, STROKE, TEXT, TEXT_MUTED, svgBox } from './tokens';
import type { DiagramCommon } from './types';

interface Mark {
  label: string;
  /** 미터 단위 크기. 로그 축에 배치된다. */
  meters: number;
}

interface Props extends DiagramCommon {
  /** 본문이 말하는 대상 (예: 7nm 공정). */
  marks: Mark[];
  /** 일상 기준 (예: 머리카락·적혈구) — 감각을 잡아 주는 참조점. */
  refs?: Mark[];
}

const AXIS_Y = 74;
const PLOT_W = DIM.width - DIM.pad * 2 - 24;

const SI = [
  { p: -9, s: 'nm' },
  { p: -6, s: 'μm' },
  { p: -3, s: 'mm' },
  { p: 0, s: 'm' },
];

/**
 * 크기 감각 (주 1 · 보조 3 = 4모듈: 050·071·078·082).
 * Design §2.2 #6 — nm~mm를 일상 기준과 나란히 두어 미세화의 규모를 잡아 준다.
 */
export function ScaleRuler({ marks, refs = [], caption, note, altTable }: Props) {
  const all = [...marks, ...refs];
  const logs = all.map((m) => Math.log10(m.meters));
  const lo = Math.floor(Math.min(...logs)) - 0.5;
  const hi = Math.ceil(Math.max(...logs)) + 0.5;

  const px = (m: number) => DIM.pad + 12 + ((Math.log10(m) - lo) / (hi - lo)) * PLOT_W;
  const height = AXIS_Y + 56;

  return (
    <DiagramFrame kind="ScaleRuler" caption={caption} note={note} altTable={altTable} scrollable>
      <svg
        {...svgBox(`0 0 ${DIM.width} ${height}`)}
        className="h-auto w-full"
        role="img"
        aria-label={caption ?? '크기 비교 눈금'}
      >
        <title>{caption ?? '크기 비교 눈금'}</title>
        <desc>
          {`로그 눈금 위 ${marks.map((m) => m.label).join(', ')}` +
            (refs.length ? `. 참조: ${refs.map((r) => r.label).join(', ')}` : '')}
        </desc>

        <line
          x1={DIM.pad}
          y1={AXIS_Y}
          x2={DIM.width - DIM.pad}
          y2={AXIS_Y}
          className={STROKE}
          strokeWidth={DIM.stroke}
        />

        {/* SI 접두어 눈금 — 로그 축임을 알려 주는 기준선 */}
        {SI.filter(({ p }) => p >= lo && p <= hi).map(({ p, s }) => (
          <g key={s}>
            <line
              x1={px(10 ** p)}
              y1={AXIS_Y - 5}
              x2={px(10 ** p)}
              y2={AXIS_Y + 5}
              className={STROKE}
              strokeWidth={DIM.stroke}
            />
            <text
              x={px(10 ** p)}
              y={AXIS_Y + 20}
              fontSize={DIM.fontSmall}
              textAnchor="middle"
              className={TEXT_MUTED}
            >
              1{s}
            </text>
          </g>
        ))}

        {/* 참조점은 축 아래, 대상은 축 위 — 섞이지 않게 */}
        {refs.map((r, i) => (
          <g key={`ref-${r.label}`}>
            <circle cx={px(r.meters)} cy={AXIS_Y} r={4} className="fill-slate-300 dark:fill-slate-600" />
            <text
              x={px(r.meters)}
              y={AXIS_Y + 38 + (i % 2) * 14}
              fontSize={DIM.fontSmall}
              textAnchor="middle"
              className={TEXT_MUTED}
            >
              {r.label}
            </text>
          </g>
        ))}

        {marks.map((m, i) => (
          <g key={`mark-${m.label}`}>
            <line
              x1={px(m.meters)}
              y1={AXIS_Y}
              x2={px(m.meters)}
              y2={AXIS_Y - 26 - (i % 2) * 18}
              className="stroke-brand-500"
              strokeWidth={DIM.stroke}
            />
            <circle cx={px(m.meters)} cy={AXIS_Y} r={5} className="fill-brand-500" />
            <text
              x={px(m.meters)}
              y={AXIS_Y - 32 - (i % 2) * 18}
              fontSize={DIM.font}
              textAnchor="middle"
              className={TEXT}
            >
              {m.label}
            </text>
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
