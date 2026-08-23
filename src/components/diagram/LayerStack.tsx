import { DiagramFrame } from './DiagramFrame';
import { DIM, TONE, STROKE, TEXT, TEXT_MUTED, splitLabel, type Tone, svgBox } from './tokens';
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
  /**
   * `vertical`(기본) = 재료 단면 — 세로축이 물리적 위치, 층 두께가 막 두께.
   * `band` = 에너지 띠 — 세로축이 **에너지**, 층 사이가 금지대역.
   * band에서는 모서리를 각지게 하고 에너지 축을 그리며 채움 패턴을 적용하지 않는다
   * (도핑 도해로 오독되는 것을 막는다).
   */
  orientation?: 'vertical' | 'band';
}

const ANNO_W = 172; // 오른쪽 지시선·텍스트 영역
const WELL_INSET = 10;
const AXIS_W = 26; // band 모드의 왼쪽 에너지 축 영역
const LABEL_INSET = 10;
const GAP_MARGIN = 6; // well 옆에 라벨을 놓을 때 띄우는 간격

/**
 * 배치용 글자 폭 근사. 한글은 폰트 크기와 거의 같고 ASCII는 절반쯤이다.
 * 정확할 필요가 없다 — 라벨이 well을 피할 자리가 있는지만 판단한다.
 */
function approxWidth(s: string, font: number) {
  return [...s].reduce((a, c) => a + (/[가-힣]/.test(c) ? font : font * 0.55), 0);
}

/**
 * 소자·막의 단면 적층도. 이 자료원 도해의 주력(주 19 · 보조 8 = 27모듈).
 * Design §2.2 #1
 */
export function LayerStack({
  idPrefix,
  layers,
  annotations = [],
  orientation = 'vertical',
  caption,
  note,
  altTable,
}: Props) {
  const isBand = orientation === 'band';
  const hasAnno = annotations.length > 0;
  const axis = isBand ? AXIS_W : 0;
  const bodyW = DIM.width - DIM.pad * 2 - axis - (hasAnno ? ANNO_W : 0);
  const bodyX = DIM.pad + axis;
  const radius = isBand ? 0 : DIM.radius;

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

  // 실제 쓰인 mark만 패턴으로 정의한다. band 모드는 채움 패턴을 쓰지 않는다.
  const marks = new Set<string>();
  if (!isBand) {
    for (const { layer } of geom) {
      if (TONE[layer.tone].mark) marks.add(layer.tone);
      for (const w of layer.wells ?? []) if (TONE[w.tone].mark) marks.add(w.tone);
    }
  }

  // <desc> — 데이터에서 자동 생성 (Design §5). 저작자 입력 없이 누락을 막는다.
  const wellLabels = geom.flatMap(({ layer }) =>
    (layer.wells ?? []).map((w) => w.label),
  );
  const desc =
    (isBand ? '아래에서 위로 에너지가 높아진다. ' : '위에서 아래로 ') +
    geom.map(({ layer }) => layer.label.replace(/\n/g, ' ')).join(' · ') +
    (wellLabels.length ? `. 내부 영역: ${wellLabels.join('·')}` : '');

  const patternId = (tone: string) => `${idPrefix}-pat-${tone}`;

  return (
    <DiagramFrame caption={caption} note={note} altTable={altTable} scrollable>
      <svg
        {...svgBox(`0 0 ${DIM.width} ${totalH}`)}
        className="h-auto w-full"
        role="img"
        aria-label={caption ?? (isBand ? '에너지 띠 도해' : '단면 적층도')}
      >
        <title>{caption ?? (isBand ? '에너지 띠 도해' : '단면 적층도')}</title>
        <desc>{desc}</desc>

        {isBand && (
          <g>
            <line
              x1={DIM.pad + 8}
              y1={totalH - DIM.pad}
              x2={DIM.pad + 8}
              y2={DIM.pad - 4}
              className={STROKE}
              strokeWidth={DIM.stroke}
            />
            <path
              d={`M ${DIM.pad + 4} ${DIM.pad + 2} L ${DIM.pad + 8} ${DIM.pad - 6} L ${DIM.pad + 12} ${DIM.pad + 2} z`}
              className="fill-slate-400 dark:fill-slate-500"
            />
            <text
              x={DIM.pad + 14}
              y={DIM.pad + 10}
              fontSize={DIM.fontSmall}
              textAnchor="start"
              className={TEXT_MUTED}
            >
              E
            </text>
          </g>
        )}

        <defs>
          {[...marks].map((tone) => (
            <pattern
              key={tone}
              id={patternId(tone)}
              width={16}
              height={16}
              patternUnits="userSpaceOnUse"
            >
              {/*
                TEXT_MUTED가 아니라 TEXT를 쓴다. 이 글리프는 장식이 아니라 **색각 이상 대비 장치**다
                (usage.md §3 "색만으로 구분하지 않는다") — 읽히지 않으면 그 장치가 무력해진다.
                이 패턴은 층 rect 위에 같은 기하로 덮이므로 배경이 tone 채움이고, TEXT_MUTED로는
                silicon-p-heavy 라이트 3.94 · 다크 3.01 · silicon-n-heavy 다크 2.86으로
                AA(4.5) 미달이었다(C-19 검출, 8건 5모듈에서 실제 렌더 중). TEXT는 6.86~14.28.
                `x`·`y`는 절대 좌표가 아니라 16×16 패턴 타일 안의 좌표다 — 이것을 좌상단 축 라벨로
                잘못 읽어 C-19가 TONE × TEXT_MUTED를 제외했던 것이 H-1의 원인이다.
              */}
              <text x={4} y={12} fontSize={11} className={TEXT}>
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
          const wellX = (side: Well['side']) =>
            side === 'left'
              ? bodyX + WELL_INSET
              : side === 'right'
                ? bodyX + bodyW - wellW - WELL_INSET
                : bodyX + (bodyW - wellW) / 2;

          // 층 라벨의 가로 자리. wells는 라벨보다 **나중에** 그려지므로 겹치면 라벨이 묻힌다.
          // 세로로 내리는 것(아래 `y`)만으로는 부족했다 — 층이 얕으면 내려도 well 안이다.
          // G-9(2026-08-16) 실측: `019-cmos`"소자 영역"·`021-mesfet`"전극"·`060-feol-1`"표면"·
          // `068-cmp`"CMP 전 …" 넷이 `side: 'left'` well에 덮여 아래 획만 보이거나 아예 사라졌다.
          // 높이를 키워 피하는 방법은 쓰지 않는다 — vertical 모드에서 **층 두께는 막 두께**라
          // 얇은 표면층을 두껍게 그리면 도해가 거짓말을 한다(usage.md §1).
          const labelLines = splitLabel(layer.label);
          const labelW = Math.max(...labelLines.map((l) => approxWidth(l, DIM.font)));
          const labelY = wells.length ? y + h - 8 : y + h / 2 + 4;
          let labelX = bodyX + LABEL_INSET;
          if (wells.length && labelY - DIM.font * 0.73 < y + 4 + wellH) {
            const spans = wells
              .map((w) => [wellX(w.side), wellX(w.side) + wellW] as const)
              .sort((a, b) => a[0] - b[0]);
            const gaps: [number, number][] = [];
            let cursor = bodyX + LABEL_INSET;
            for (const [a, b] of spans) {
              if (a - cursor > 0) gaps.push([cursor, a - GAP_MARGIN]);
              cursor = Math.max(cursor, b + GAP_MARGIN);
            }
            gaps.push([cursor, bodyX + bodyW - 4]);
            // **왼쪽부터 처음 들어가는** 빈 자리. '가장 넓은 곳'으로 골랐더니 이미 멀쩡하던
            // `065-etching`(center well 하나, 왼쪽이 비어 있다)의 라벨이 오른쪽으로 끌려갔다 —
            // 겹치지 않는 라벨은 움직이지 않아야 한다.
            const fit = gaps.find(([a, b]) => b - a >= labelW);
            if (fit) labelX = fit[0];
          }

          return (
            <g key={layer.id}>
              <rect
                x={bodyX}
                y={y}
                width={bodyW}
                height={h}
                rx={radius}
                className={`${tone.fill} ${STROKE}`}
                strokeWidth={DIM.stroke}
                strokeDasharray={layer.tone === 'band-gap' ? '5 4' : undefined}
              />
              {!isBand && tone.mark && (
                <rect
                  x={bodyX}
                  y={y}
                  width={bodyW}
                  height={h}
                  rx={radius}
                  fill={`url(#${patternId(layer.tone)})`}
                />
              )}

              {/* 층 라벨 — wells가 있으면 아래로 내리고, 그래도 겹치면 옆 빈 자리로 옮긴다. */}
              <text x={labelX} y={labelY} fontSize={DIM.font} className={TEXT}>
                {labelLines.map((line, i) => (
                  <tspan key={i} x={labelX} dy={i === 0 ? 0 : DIM.font + 2}>
                    {line}
                  </tspan>
                ))}
              </text>

              {wells.map((w, i) => {
                const wx = wellX(w.side);
                const wtone = TONE[w.tone];
                return (
                  <g key={`${layer.id}-well-${i}`}>
                    <rect
                      x={wx}
                      y={y + 4}
                      width={wellW}
                      height={wellH}
                      rx={radius}
                      className={`${wtone.fill} ${STROKE}`}
                      strokeWidth={DIM.stroke}
                    />
                    {!isBand && wtone.mark && (
                      <rect
                        x={wx}
                        y={y + 4}
                        width={wellW}
                        height={wellH}
                        rx={radius}
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
