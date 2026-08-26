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
 * 채움 패턴 타일 크기. 아래 pattern 요소의 width/height와 **반드시 같아야** 한다.
 * (주석에 그 태그 이름을 리터럴로 쓰지 않는다 — C-19가 문자열로 훑어 여는 태그로 오인한다.)
 */
const TILE = 16;

/**
 * 라벨 글자 자리에서 채움 글리프를 비우는 **구멍**을 낸다.
 *
 * 왜 필요한가: `+`/`−` 글리프는 라벨과 같은 `TEXT` 색·비슷한 굵기라 letterform에 섞인다.
 * `012-pn-diode`의 "애노드"가 "애노두"로 읽혔다. 글리프를 지울 수는 없다 — 색각 이상
 * 대비 장치이기 때문이다(usage.md §3). 그래서 **글자 자리에서만** 비운다.
 *
 * 네 변을 **타일 격자에 바깥쪽 스냅**한다. 스냅하지 않으면 경계가 타일 중간을 지나
 * 글리프가 반만 남고, 라벨 옆에 점 같은 잔여물이 생긴다(Design §0.3 실측).
 */
function glyphHole(box: { x: number; y: number; w: number; h: number }) {
  const x0 = Math.floor(box.x / TILE) * TILE;
  const y0 = Math.floor(box.y / TILE) * TILE;
  const x1 = Math.ceil((box.x + box.w) / TILE) * TILE;
  const y1 = Math.ceil((box.y + box.h) / TILE) * TILE;
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
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

  // ── 라벨 기하 전처리 ──
  // 마스크를 최상위 <defs>에 두므로 좌표를 여기서 미리 잡는다 — 본문과 defs가 **같은 값**을 쓴다.
  //
  // ★defs 배치가 **106건 오탐을 고친 것은 아니다.** 그때 세운 가설("그리기 영역에 두면
  // 렌더 검사가 마스크 내부 사각형을 배경으로 읽는다")은 옮겨 보고 **틀린 것으로 판명**됐다 —
  // querySelectorAll은 defs도 훑는다. 실제 고침은 verify-diagram-render.mjs 쪽에서
  // 배경 후보를 **그려지는 도형**으로 한정한 것이다. defs 배치는 SVG 정석이라 유지할 뿐,
  // 검사기에 대한 방어가 아니다. (이 문단을 근거로 구조를 바꾸지 마라.)
  const place = geom.map(({ layer, y, h }) => {
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
    // 세로로 내리는 것만으로는 부족했다 — 층이 얕으면 내려도 well 안이다.
    // G-9(2026-08-16) 실측: `019-cmos`·`021-mesfet`·`060-feol-1`·`068-cmp` 넷이
    // `side: 'left'` well에 덮여 아래 획만 보이거나 아예 사라졌다.
    // 높이를 키워 피하지 않는다 — vertical에서 **층 두께는 막 두께**다(usage.md §1).
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
      // `065-etching`의 라벨이 오른쪽으로 끌려갔다 — 겹치지 않는 라벨은 움직이지 않아야 한다.
      const fit = gaps.find(([a, b]) => b - a >= labelW);
      if (fit) labelX = fit[0];
    }

    const wellPlaces = wells.map((w, i) => {
      const wx = wellX(w.side);
      const wLabelW = approxWidth(w.label, DIM.fontSmall);
      const wLabelY = y + 4 + wellH / 2 + 4;
      return {
        wx,
        wLabelY,
        maskId: `${idPrefix}-wm-${layer.id}-${i}`,
        // wells 라벨은 textAnchor="middle"이라 중심 기준으로 좌우 절반씩 잡는다.
        hole: glyphHole({
          x: wx + wellW / 2 - wLabelW / 2 - 4,
          y: wLabelY - DIM.fontSmall * 0.82 - 2,
          w: wLabelW + 8,
          h: DIM.fontSmall * 0.82 + 5,
        }),
      };
    });

    // ★순서가 계약이다 — `labelX`는 위에서 wells 회피로 **옮겨진 뒤**의 값이어야 한다.
    // 아래 `hole`을 그 확정보다 먼저 계산하면 구멍은 `bodyX + LABEL_INSET`에, 라벨은
    // 옮겨진 자리에 남는다. 세 정적 조건(mask 수·glyphHole 수·리터럴)은 전부 그대로라
    // C-20은 통과한다 — 잡는 것은 verify:render의 글리프 구멍 규칙뿐이다.
    return {
      wells, wellH, wellW, wellPlaces,
      labelLines, labelW, labelX, labelY,
      maskId: `${idPrefix}-lm-${layer.id}`,
      hole: glyphHole({
        x: labelX - 4,
        y: labelY - DIM.font * 0.82 - 2,
        w: labelW + 8,
        h: (labelLines.length - 1) * (DIM.font + 2) + DIM.font * 0.82 + 5,
      }),
    };
  });

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
              width={TILE}
              height={TILE}
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

          {/* 라벨 자리에서 채움 글리프를 비우는 마스크. 그리기 영역이 아니라 여기 둔다(위 주석). */}
          {!isBand && geom.map(({ layer, y, h }, gi) => {
            const p = place[gi];
            const nodes = [];
            if (TONE[layer.tone].mark) {
              nodes.push(
                <mask key={p.maskId} id={p.maskId}>
                  <rect x={bodyX} y={y} width={bodyW} height={h} fill="white" />
                  <rect {...p.hole} fill="black" />
                </mask>,
              );
            }
            for (let i = 0; i < p.wells.length; i += 1) {
              if (!TONE[p.wells[i].tone].mark) continue;
              const wp = p.wellPlaces[i];
              nodes.push(
                <mask key={wp.maskId} id={wp.maskId}>
                  <rect x={wp.wx} y={y + 4} width={p.wellW} height={p.wellH} fill="white" />
                  <rect {...wp.hole} fill="black" />
                </mask>,
              );
            }
            return nodes;
          })}
        </defs>

        {geom.map(({ layer, y, h }, gi) => {
          const tone = TONE[layer.tone];
          const p = place[gi];

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
                  mask={`url(#${p.maskId})`}
                />
              )}

              {/* 층 라벨 — wells가 있으면 아래로 내리고, 그래도 겹치면 옆 빈 자리로 옮긴다. */}
              <text x={p.labelX} y={p.labelY} fontSize={DIM.font} className={TEXT}>
                {p.labelLines.map((line, i) => (
                  <tspan key={i} x={p.labelX} dy={i === 0 ? 0 : DIM.font + 2}>
                    {line}
                  </tspan>
                ))}
              </text>

              {p.wells.map((w, i) => {
                const wtone = TONE[w.tone];
                const wp = p.wellPlaces[i];
                return (
                  <g key={`${layer.id}-well-${i}`}>
                    <rect
                      x={wp.wx}
                      y={y + 4}
                      width={p.wellW}
                      height={p.wellH}
                      rx={radius}
                      className={`${wtone.fill} ${STROKE}`}
                      strokeWidth={DIM.stroke}
                    />
                    {!isBand && wtone.mark && (
                      <rect
                        x={wp.wx}
                        y={y + 4}
                        width={p.wellW}
                        height={p.wellH}
                        rx={radius}
                        fill={`url(#${patternId(w.tone)})`}
                        mask={`url(#${wp.maskId})`}
                      />
                    )}
                    <text
                      x={wp.wx + p.wellW / 2}
                      y={wp.wLabelY}
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
