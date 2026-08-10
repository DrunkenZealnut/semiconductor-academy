/**
 * 자체 도해 컴포넌트 세트.
 * Design: docs/02-design/features/diagram-component-set.design.md
 *
 * 전부 서버 컴포넌트다 — 'use client' 없이 SVG/HTML을 서버에서 렌더해
 * First Load JS 증가를 0으로 유지한다.
 */

// 1차 5종 — 주 도해 71/97 (73%) 커버
export { LayerStack } from './LayerStack';
export { CompareCards } from './CompareCards';
export { FlowSteps } from './FlowSteps';
export { NodeGraph } from './NodeGraph';
export { TruthTable } from './TruthTable';

// 2차 7종 — 나머지 26/97 커버
export { ValueBars } from './ValueBars';
export { TreeBranch } from './TreeBranch';
export { LatticeDiagram } from './LatticeDiagram';
export { CurvePlot } from './CurvePlot';
export { Timeline } from './Timeline';
export { ScaleRuler } from './ScaleRuler';
export { LabeledFigure } from './LabeledFigure';

export { DiagramFrame } from './DiagramFrame';
export { DIM, TONE, type Tone } from './tokens';
export type { DiagramCommon, SvgDiagramCommon } from './types';
