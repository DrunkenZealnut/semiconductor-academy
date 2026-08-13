import { DiagramFrame } from './DiagramFrame';
import { DIM, TONE, STROKE, TEXT, TEXT_MUTED } from './tokens';
import type { DiagramCommon } from './types';

type Center = 'Si' | 'P' | 'B' | 'As' | 'Ga';
type Arrangement = 'crystal' | 'poly' | 'amorphous';

interface Props extends DiagramCommon {
  /** 가운데 원자. Si 외에는 불순물로 취급해 강조된다. */
  center?: Center;
  /** 결정(가지런) · 다결정(구역별) · 비정질(흐트러짐). 기본 crystal. */
  arrangement?: Arrangement;
  /** 남는 전자 또는 빈자리를 표시한다. */
  highlight?: 'free-electron' | 'hole' | null;
}

/** 최외각 전자 수 — 결합 손의 개수를 정한다. */
const VALENCE: Record<Center, number> = { Si: 4, P: 5, As: 5, B: 3, Ga: 3 };

const CELL = 96;
const R = 17;

/**
 * 이 도해만 viewBox를 잘라 쓴다. 격자가 실제로 쓰는 폭은 258(=이웃 간격±반지름±흔들림)뿐인데
 * 좌표계 폭은 640이라 좌우가 크게 빈다. 옛 `max-w-md`(448px)는 그 빈 폭까지 화면에 맞추느라
 * ×0.7로 눌렸고, 그래서 highlight 설명문(11px)이 데스크톱에서도 7.7px로 나왔다.
 * 빈 여백을 잘라내면 같은 폭에서 좌표가 1:1로 그려져 글자가 설계 크기를 유지한다.
 * (`VB_X`~`VB_X+VB_W`는 격자 191~449와 highlight 문장 약 170~470을 모두 담는다.)
 */
const VB_X = 145;
const VB_W = 350;

/** highlight 문장이 아래쪽 원자와 겹치지 않도록 확보하는 높이. */
const LABEL_H = 22;

/**
 * 실리콘 결정의 공유 결합 격자 (주 4 · 보조 1 = 5모듈: 003~006·079).
 * Design §2.2 #10 — V-1에서 신설. 003~006이 거의 같은 구조라 1회 제작으로 전부 커버된다.
 *
 * 가운데 원자와 이웃 4개를 놓고 손(결합)을 그린다. 불순물이면 손의 수가 달라져
 * 남는 전자(n형) 또는 빈자리(p형)가 눈에 보인다.
 */
export function LatticeDiagram({
  center = 'Si',
  arrangement = 'crystal',
  highlight = null,
  caption,
  note,
  altTable,
}: Props) {
  const cx = DIM.width / 2;
  const cy = CELL + DIM.pad;
  const height = CELL * 2 + DIM.pad * 2 + (highlight ? LABEL_H : 0);
  const valence = VALENCE[center];
  const isDopant = center !== 'Si';

  // 이웃 4개 (상·하·좌·우). 배열이 흐트러질수록 위치를 어긋나게 둔다.
  const jitter = arrangement === 'amorphous' ? 16 : arrangement === 'poly' ? 7 : 0;
  const neighbors = [
    { dx: 0, dy: -CELL, jx: -jitter, jy: jitter / 2 },
    { dx: CELL, dy: 0, jx: jitter / 2, jy: jitter },
    { dx: 0, dy: CELL, jx: jitter, jy: -jitter / 2 },
    { dx: -CELL, dy: 0, jx: -jitter / 2, jy: -jitter },
  ];

  // 손 4개는 이웃과 이어지고, 5번째(도너)는 남으며, 3개(억셉터)면 한 자리가 빈다.
  const bonded = Math.min(valence, 4);
  const spare = valence > 4;
  const vacancy = valence < 4;

  return (
    <DiagramFrame caption={caption} note={note} altTable={altTable} scrollable>
      <svg
        viewBox={`${VB_X} 0 ${VB_W} ${height}`}
        className="mx-auto h-auto"
        style={{ width: VB_W, minWidth: VB_W }}
        role="img"
        aria-label={caption ?? `${center} 원자의 결합 구조`}
      >
        <title>{caption ?? `${center} 원자의 결합 구조`}</title>
        <desc>
          {`${center} 원자와 이웃 실리콘 ${bonded}개의 공유 결합.` +
            (spare ? ' 다섯 번째 손의 전자가 결합에 쓰이지 않고 남는다.' : '') +
            (vacancy ? ' 손이 하나 모자라 빈자리(양공)가 생긴다.' : '') +
            (arrangement !== 'crystal' ? ` 배열: ${arrangement === 'poly' ? '다결정' : '비정질'}.` : '')}
        </desc>

        {neighbors.map((n, i) => {
          const nx = cx + n.dx + n.jx;
          const ny = cy + n.dy + n.jy;
          const linked = i < bonded;
          return (
            <g key={`n${i}`}>
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                className={STROKE}
                strokeWidth={linked ? DIM.stroke * 2 : DIM.stroke}
                strokeDasharray={linked ? undefined : '4 3'}
              />
              {!linked && vacancy && (
                <circle
                  cx={(cx + nx) / 2}
                  cy={(cy + ny) / 2}
                  r={7}
                  className="fill-transparent stroke-rose-400 dark:stroke-rose-500"
                  strokeWidth={DIM.stroke}
                  strokeDasharray="3 2"
                />
              )}
              <circle
                cx={nx}
                cy={ny}
                r={R}
                className={`${TONE.substrate.fill} ${STROKE}`}
                strokeWidth={DIM.stroke}
              />
              <text
                x={nx}
                y={ny + 4}
                fontSize={DIM.font}
                textAnchor="middle"
                className={TEXT}
              >
                Si
              </text>
            </g>
          );
        })}

        {spare && (
          <g>
            <line
              x1={cx}
              y1={cy}
              x2={cx + CELL * 0.62}
              y2={cy - CELL * 0.62}
              className="stroke-brand-500"
              strokeWidth={DIM.stroke * 2}
            />
            <circle
              cx={cx + CELL * 0.62}
              cy={cy - CELL * 0.62}
              r={8}
              className="fill-brand-500"
            />
          </g>
        )}

        <circle
          cx={cx}
          cy={cy}
          r={R + 3}
          className={`${isDopant ? 'fill-brand-500/20' : TONE.substrate.fill} ${STROKE}`}
          strokeWidth={isDopant ? DIM.stroke * 2 : DIM.stroke}
        />
        <text x={cx} y={cy + 5} fontSize={DIM.font + 1} textAnchor="middle" className={TEXT}>
          {center}
        </text>

        {highlight && (
          <text
            x={cx}
            y={height - 6}
            fontSize={DIM.fontSmall}
            textAnchor="middle"
            className={TEXT_MUTED}
          >
            {highlight === 'free-electron'
              ? '● 다섯 번째 손의 전자는 결합에 쓰이지 않아 자유롭게 움직인다'
              : '○ 손이 하나 모자라 생긴 빈자리 — 양공'}
          </text>
        )}
      </svg>
    </DiagramFrame>
  );
}
