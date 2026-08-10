import { DiagramFrame } from './DiagramFrame';
import { DIM, TONE, STROKE, TEXT, TEXT_MUTED, splitLabel, type Tone } from './tokens';
import type { SvgDiagramCommon } from './types';

interface Well {
  label: string;
  tone: Tone;
  /** 층 안에서의 가로 위치. 기본 center. */
  side?: 'left' | 'right' | 'center';
}

interface Layer {
  /** annotations의 `at`이 참조하는 식별자. */
  id: string;
  label: string;
  tone: Tone;
  /** viewBox 단위 높이. 기본 DIM.layerHeight. */
  height?: number;
  /** 층 안에 박히는 영역 (소스·드레인·웰 등). */
  wells?: Well[];
}

interface Annotation {
  /** 층 id(`'oxide'`) 또는 두 층의 경계(`'oxide/substrate'`). */
  at: string;
  text: string;
}

interface Props extends SvgDiagramCommon {
  layers: Layer[];
  annotations?: Annotation[];
}

const ANNO_W = 172; // 오른쪽 지시선·텍스트 영역
const WELL_INSET = 10;

/**
 * 소자·막의 단면 적층도. 이 자료원 도해의 주력(주 19 · 보조 8 = 27모듈).
 * Design §2.2 #1
 */
export function LayerStack({
  idPrefix,
  layers,
  annotations = [],
  caption,
  note,
  altTable,
}: Props) {
  const hasAnno = annotations.length > 0;
  const bodyW = DIM.width - DIM.pad * 2 - (hasAnno ? ANNO_W : 0);
  const bodyX = DIM.pad;

  // 층별 y 좌표를 미리 계산해 annotation이 참조할 수 있게 한다.
  const geom: { layer: Layer; y: number; h: number }[] = [];
  let cursor = DIM.pad;
  for (const layer of layers) {
    const h = layer.height ?? DIM.layerHeight;
    geom.push({ layer, y: cursor, h });
    cursor += h;
  }
  const totalH = cursor + DIM.pad;

  const findY = (at: string): number | null => {
    if (at.includes('/')) {
      const [a, b] = at.split('/');
      const ga = geom.find((g) => g.layer.id === a);
      const gb = geom.find((g) => g.layer.id === b);
      if (!ga || !gb) return null;
      // 두 층의 경계 = 위층의 아래 모서리
      return ga.y + ga.h <= gb.y ? ga.y + ga.h : gb.y + gb.h;
    }
    const g = geom.find((x) => x.layer.id === at);
    return g ? g.y + g.h / 2 : null;
  };

  // 실제 쓰인 mark만 패턴으로 정의한다.
  const marks = new Set<string>();
  for (const { layer } of geom) {
    if (TONE[layer.tone].mark) marks.add(layer.tone);
    for (const w of layer.wells ?? []) if (TONE[w.tone].mark) marks.add(w.tone);
  }

  const patternId = (tone: string) => `${idPrefix}-pat-${tone}`;

  return (
    <DiagramFrame caption={caption} note={note} altTable={altTable}>
      <svg
        viewBox={`0 0 ${DIM.width} ${totalH}`}
        className="h-auto w-full"
        role="img"
        aria-label={caption ?? '단면 적층도'}
      >
        <title>{caption ?? '단면 적층도'}</title>

        <defs>
          {[...marks].map((tone) => (
            <pattern
              key={tone}
              id={patternId(tone)}
              width={16}
              height={16}
              patternUnits="userSpaceOnUse"
            >
              <text x={4} y={12} fontSize={11} className={TEXT_MUTED}>
                {TONE[tone as Tone].mark}
              </text>
            </pattern>
          ))}
        </defs>

        {geom.map(({ layer, y, h }) => {
          const tone = TONE[layer.tone];
          const wells = layer.wells ?? [];
          const wellH = Math.min(h * 0.55, DIM.layerHeight * 0.6);
          const wellW = bodyW * 0.26;

          return (
            <g key={layer.id}>
              <rect
                x={bodyX}
                y={y}
                width={bodyW}
                height={h}
                rx={DIM.radius}
                className={`${tone.fill} ${STROKE}`}
                strokeWidth={DIM.stroke}
              />
              {tone.mark && (
                <rect
                  x={bodyX}
                  y={y}
                  width={bodyW}
                  height={h}
                  rx={DIM.radius}
                  fill={`url(#${patternId(layer.tone)})`}
                />
              )}

              {/* 층 라벨 — wells가 있으면 아래쪽으로 내려 겹침을 피한다. */}
              <text
                x={bodyX + 10}
                y={wells.length ? y + h - 8 : y + h / 2 + 4}
                fontSize={DIM.font}
                className={TEXT}
              >
                {splitLabel(layer.label).map((line, i) => (
                  <tspan key={i} x={bodyX + 10} dy={i === 0 ? 0 : DIM.font + 2}>
                    {line}
                  </tspan>
                ))}
              </text>

              {wells.map((w, i) => {
                const wx =
                  w.side === 'left'
                    ? bodyX + WELL_INSET
                    : w.side === 'right'
                      ? bodyX + bodyW - wellW - WELL_INSET
                      : bodyX + (bodyW - wellW) / 2;
                const wtone = TONE[w.tone];
                return (
                  <g key={`${layer.id}-well-${i}`}>
                    <rect
                      x={wx}
                      y={y + 4}
                      width={wellW}
                      height={wellH}
                      rx={DIM.radius}
                      className={`${wtone.fill} ${STROKE}`}
                      strokeWidth={DIM.stroke}
                    />
                    {wtone.mark && (
                      <rect
                        x={wx}
                        y={y + 4}
                        width={wellW}
                        height={wellH}
                        rx={DIM.radius}
                        fill={`url(#${patternId(w.tone)})`}
                      />
                    )}
                    <text
                      x={wx + wellW / 2}
                      y={y + 4 + wellH / 2 + 4}
                      fontSize={DIM.fontSmall}
                      textAnchor="middle"
                      className={TEXT}
                    >
                      {w.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {annotations.map((a, i) => {
          const y = findY(a.at);
          if (y === null) return null;
          const x1 = bodyX + bodyW;
          const x2 = x1 + 24;
          return (
            <g key={`anno-${i}`}>
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                className={STROKE}
                strokeWidth={DIM.stroke}
                strokeDasharray="3 2"
              />
              <text x={x2 + 6} y={y + 4} fontSize={DIM.fontSmall} className={TEXT_MUTED}>
                {splitLabel(a.text).map((line, j) => (
                  <tspan key={j} x={x2 + 6} dy={j === 0 ? 0 : DIM.fontSmall + 2}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </DiagramFrame>
  );
}
