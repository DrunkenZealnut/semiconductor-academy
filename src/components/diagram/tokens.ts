/**
 * 도해 공통 색·치수 토큰.
 * Design: docs/02-design/features/diagram-component-set.design.md §3
 *
 * 12종이 전부 이 값을 참조한다. 나란히 놓았을 때 선 굵기·글자·색이 어긋나지 않게
 * 하는 것이 목적이므로, 개별 컴포넌트에서 색을 하드코딩하지 않는다.
 */

/** viewBox 좌표계 기준 치수. */
export const DIM = {
  width: 640,
  layerHeight: 40,
  stroke: 1.5,
  radius: 4,
  pad: 16,
  font: 13,
  fontSmall: 11,
} as const;

export type Tone =
  | 'silicon-p'
  | 'silicon-n'
  | 'silicon-p-heavy'
  | 'silicon-n-heavy'
  | 'oxide'
  | 'metal'
  | 'poly'
  | 'resist'
  | 'substrate'
  | 'accent'
  // 에너지 밴드 전용 — 재료가 아니라 에너지 축을 나타낸다.
  // 재료 tone과 색 계열을 겹치지 않게 골랐고, mark가 없어 채움 패턴이 적용되지 않는다
  // (p/n 도핑 도해로 오독되는 것을 막는다).
  | 'band-conduction'
  | 'band-gap'
  | 'band-valence';

interface ToneStyle {
  /** SVG 채움 클래스 (라이트/다크 쌍). */
  fill: string;
  /** 한국어 재료명 — 범례·`altTable`에 쓴다. */
  label: string;
  /** 색각 이상 대비용 채움 패턴 기호. 없으면 패턴을 겹치지 않는다. */
  mark?: '+' | '−';
}

export const TONE: Record<Tone, ToneStyle> = {
  'silicon-p': { fill: 'fill-rose-100 dark:fill-rose-950', label: 'p형 실리콘', mark: '+' },
  'silicon-n': { fill: 'fill-sky-100 dark:fill-sky-950', label: 'n형 실리콘', mark: '−' },
  'silicon-p-heavy': { fill: 'fill-rose-300 dark:fill-rose-800', label: 'p⁺ 고농도', mark: '+' },
  'silicon-n-heavy': { fill: 'fill-sky-300 dark:fill-sky-800', label: 'n⁺ 고농도', mark: '−' },
  oxide: { fill: 'fill-amber-100 dark:fill-amber-950', label: '절연막' },
  metal: { fill: 'fill-zinc-400 dark:fill-zinc-500', label: '금속' },
  poly: { fill: 'fill-violet-200 dark:fill-violet-900', label: '폴리실리콘' },
  resist: { fill: 'fill-emerald-200 dark:fill-emerald-900', label: '감광제' },
  substrate: { fill: 'fill-slate-200 dark:fill-slate-700', label: '기판' },
  'band-conduction': { fill: 'fill-teal-50 dark:fill-teal-950', label: '전도띠' },
  'band-gap': { fill: 'fill-transparent', label: '금지대역' },
  'band-valence': { fill: 'fill-indigo-50 dark:fill-indigo-950', label: '충만띠' },
  accent: { fill: 'fill-brand-500', label: '강조' },
};

/**
 * `NodeGraph`의 노드 종류별 채움. 재료(`TONE`)와는 다른 축이라 병합하지 않고 나란히 둔다.
 * 컴포넌트 안에 두면 tokens를 우회하게 되므로 여기서 관리한다.
 */
export type NodeKind = 'block' | 'device' | 'io';

export const NODE_KIND: Record<NodeKind, string> = {
  block: 'fill-slate-100 dark:fill-slate-800',
  device: 'fill-violet-100 dark:fill-violet-950',
  io: 'fill-brand-500/10 dark:fill-brand-500/20',
};

/** 공통 선·글자 클래스. */
export const STROKE = 'stroke-slate-400 dark:stroke-slate-500';
export const TEXT = 'fill-slate-800 dark:fill-slate-100';
export const TEXT_MUTED = 'fill-slate-500 dark:fill-slate-400';

/** 카드형(HTML) 도해가 공유하는 테두리·배경. */
export const CARD = 'rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900';

/**
 * 라벨을 `\n` 기준으로 나눈다. SVG `<text>`는 자동 줄바꿈이 없어 `<tspan>`으로 쪼갠다.
 * Design §3.2 — 라벨은 12자 이내가 원칙이고, 넘치면 저작자가 `\n`을 넣는다.
 */
export function splitLabel(label: string): string[] {
  return label.split('\n');
}
