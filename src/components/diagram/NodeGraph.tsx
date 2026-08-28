import { DiagramFrame } from './DiagramFrame';
import { DIM, STROKE, TEXT, TEXT_MUTED, splitLabel, NODE_KIND, type NodeKind, svgBox } from './tokens';
import type { SvgDiagramCommon } from './types';

interface Node {
  id: string;
  /** 소자는 접두어로 종류를 준다 — `nmos:` `pmos:` `R:` `C:`. 접두어는 배지로 렌더된다. */
  label: string;
  kind?: NodeKind;
  /** 격자 좌표 [col, row]. 0부터. */
  at: [number, number];
}

interface Edge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed';
}

interface Props extends SvgDiagramCommon {
  nodes: Node[];
  edges: Edge[];
  /** [cols, rows]. 생략하면 nodes의 at에서 산출. */
  grid?: [number, number];
}

const CELL_H = 72;
const NODE_H = 40;

const DEVICE_PREFIX = /^(nmos|pmos|R|C|D):\s*/;

/**
 * 회로도와 기능 블록도를 함께 담는다 (주 6 · 보조 7 = 13모듈).
 * Design §2.4 — 자동 배선을 하지 않는다. 저작자가 격자 좌표를 주고 경로는 L자로만 잇는다.
 * 곡선 배선·기호 자동 배치·교차 회피는 범위 밖이며, 필요하면 LabeledFigure로 내려간다.
 */
export function NodeGraph({ idPrefix, nodes, edges, grid, caption, note, altTable }: Props) {
  const cols = grid?.[0] ?? Math.max(...nodes.map((n) => n.at[0])) + 1;
  const rows = grid?.[1] ?? Math.max(...nodes.map((n) => n.at[1])) + 1;

  const cellW = (DIM.width - DIM.pad * 2) / cols;
  const nodeW = Math.min(cellW - 16, 140);
  const totalH = rows * CELL_H + DIM.pad * 2;

  const center = (n: Node) => ({
    x: DIM.pad + n.at[0] * cellW + cellW / 2,
    y: DIM.pad + n.at[1] * CELL_H + CELL_H / 2,
  });

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const ioLabels = nodes.filter((n) => n.kind === 'io').map((n) => n.label.replace(/\n/g, ' '));
  const arrowId = `${idPrefix}-arrow`;

  /** from → to 직교 경로. 같은 행/열이면 직선, 아니면 수평 → 수직 L자. */
  const pathOf = (a: Node, b: Node) => {
    const p = center(a);
    const q = center(b);
    const halfW = nodeW / 2;
    const halfH = NODE_H / 2;

    if (a.at[1] === b.at[1]) {
      const dir = q.x > p.x ? 1 : -1;
      return `M ${p.x + dir * halfW} ${p.y} L ${q.x - dir * halfW} ${q.y}`;
    }
    if (a.at[0] === b.at[0]) {
      const dir = q.y > p.y ? 1 : -1;
      return `M ${p.x} ${p.y + dir * halfH} L ${q.x} ${q.y - dir * halfH}`;
    }
    const vdir = q.y > p.y ? 1 : -1;
    const hdir = q.x > p.x ? 1 : -1;
    return `M ${p.x + hdir * halfW} ${p.y} L ${q.x} ${p.y} L ${q.x} ${q.y - vdir * halfH}`;
  };

  return (
    <DiagramFrame kind="NodeGraph" caption={caption} note={note} altTable={altTable} scrollable>
      <svg
        {...svgBox(`0 0 ${DIM.width} ${totalH}`)}
        className="h-auto w-full"
        role="img"
        aria-label={caption ?? '연결 구조도'}
      >
        <title>{caption ?? '연결 구조도'}</title>
        <desc>
          {`${nodes.length}개 요소가 ${edges.length}개 연결선으로 이어진 구조도.` +
            (ioLabels.length ? ` 입출력: ${ioLabels.join(', ')}` : '')}
        </desc>

        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 8 8"
            refX={7}
            refY={4}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 4 L 0 7 z" className="fill-slate-400 dark:fill-slate-500" />
          </marker>
        </defs>

        {edges.map((e, i) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          const p = center(a);
          const q = center(b);
          return (
            <g key={`e${i}`}>
              <path
                d={pathOf(a, b)}
                fill="none"
                className={STROKE}
                strokeWidth={DIM.stroke}
                strokeDasharray={e.style === 'dashed' ? '4 3' : undefined}
                markerEnd={`url(#${arrowId})`}
              />
              {e.label && (
                <text
                  x={(p.x + q.x) / 2}
                  y={(p.y + q.y) / 2 - 5}
                  fontSize={DIM.fontSmall}
                  textAnchor="middle"
                  className={TEXT_MUTED}
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((n) => {
          const { x, y } = center(n);
          const kind = n.kind ?? 'block';
          const m = DEVICE_PREFIX.exec(n.label);
          const badge = m?.[1];
          const label = badge ? n.label.replace(DEVICE_PREFIX, '') : n.label;
          const lines = splitLabel(label);

          return (
            <g key={n.id}>
              <rect
                x={x - nodeW / 2}
                y={y - NODE_H / 2}
                width={nodeW}
                height={NODE_H}
                rx={kind === 'io' ? NODE_H / 2 : DIM.radius}
                className={`${NODE_KIND[kind]} ${STROKE}`}
                strokeWidth={DIM.stroke}
              />
              {badge && (
                // TEXT_MUTED가 아니라 TEXT를 쓴다. 이유 둘: ⓐ9px 글자를 흐리게까지 하면 두 겹으로
                // 읽기 어렵다 ⓑ다크에서 TEXT_MUTED는 io 노드(brand-500/20) 위에서 3.84로 AA 미달이고
                // kind는 저작자가 정하므로 언제든 그 조합이 생긴다(C-19가 검출한 건).
                // 이 변경으로 **노드 안의 글자는 TEXT뿐**이 되어 C-19의 조합 집합이 닫힌다.
                <text
                  x={x - nodeW / 2 + 6}
                  y={y - NODE_H / 2 + 12}
                  fontSize={9}
                  className={TEXT}
                >
                  {badge}
                </text>
              )}
              <text
                x={x}
                y={y + (lines.length > 1 ? -2 : 4) + (badge ? 4 : 0)}
                fontSize={DIM.font}
                textAnchor="middle"
                className={TEXT}
              >
                {lines.map((line, i) => (
                  <tspan key={i} x={x} dy={i === 0 ? 0 : DIM.font + 1}>
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
