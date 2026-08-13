/**
 * 도해 공통 색·치수 토큰.
 * Design: docs/02-design/features/diagram-component-set.design.md §3
 *
 * 12종이 전부 이 값을 참조한다. 나란히 놓았을 때 선 굵기·글자·색이 어긋나지 않게
 * 하는 것이 목적이므로, 개별 컴포넌트에서 색을 하드코딩하지 않는다.
 */

/**
 * viewBox 좌표계 기준 치수.
 *
 * `width`는 '설계 폭'이자 SVG 도해의 **최소 렌더 폭**이다. viewBox가 컨테이너에 맞춰
 * 줄어들면 좌표계 전체가 눌려 글자도 같이 줄어들기 때문이다 — 375px 화면(가용 343px)에서
 * 640이 눌리면 ×0.54가 되어 라벨 13px이 7.0px, 부라벨 11px이 5.9px로 읽히지 않는다.
 * 그래서 SVG 6종은 아래 `svgBox()`로 이 폭 아래로 줄지 않게 하고,
 * 좁은 화면에서는 `DiagramFrame scrollable`이 프레임 안에서만 가로로 스크롤되게 한다.
 * (G-9 육안 확인에서 드러난 결함. 데스크톱 본문은 832px라 오히려 ×1.3로 확대된다.)
 */
export const DIM = {
  width: 640,
  layerHeight: 40,
  stroke: 1.5,
  radius: 4,
  pad: 16,
  font: 13,
  fontSmall: 11,
} as const;

/**
 * SVG 도해의 크기 계약을 한 곳에서 만든다.
 *
 * `viewBox`와 `minWidth`가 **같은 인자에서** 나오므로 둘이 어긋난 상태를 만들 수 없다 —
 * 컴포넌트마다 각자 맞추게 하면 어긋날 수 있고, 여기서 만들면 어긋날 수 없다.
 * (`diagram-set-finishing`이 `<desc>`를 prop이 아니라 자동 생성으로 정한 것과 같은 논리:
 * 저작자 입력 0 · 누락 구조적 불가.)
 *
 * 폭은 유한·양수만 받는다. 음수나 `Infinity`가 `minWidth`로 가면 CSS가 그 선언을 버려
 * **축소 방지가 조용히 사라진다** — 예외보다 나쁜 거짓 통과다(CodeRabbit PR #33 지적).
 *
 * `fixed`는 좌표계보다 좁게 그려야 하는 도해용이다(`LatticeDiagram` — viewBox를 잘라 쓴다).
 *
 * 검사기는 이 헬퍼를 썼는지만 본다(C-18). Design: `docs/archive/2026-08/diagram-render-gate/diagram-render-gate.design.md` §1 D-8.
 */
export function svgBox(viewBox: string, opts?: { fixed?: boolean }) {
  const parsed = Number(viewBox.trim().split(/\s+/)[2]);
  const width = Number.isFinite(parsed) && parsed > 0 ? parsed : DIM.width;
  return {
    viewBox,
    style: opts?.fixed ? { width, minWidth: width } : { minWidth: width },
  };
}

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
  // 대비: 다크의 zinc-500은 TEXT와 4.40으로 AA(4.5)에 못 미쳤다(C-19 검출, 사용 36건).
  // zinc-600은 7.05이고 휘도 0.086으로 다른 다크 tone(rose-950 0.017 · violet-900 0.045 ·
  // slate-700 0.052)보다 여전히 밝아 '가장 밝은 층 = 금속'이라는 시각 성격이 유지된다.
  // zinc-700(9.54)은 휘도 0.050으로 slate-700과 구분이 안 돼 기판과 섞인다.
  metal: { fill: 'fill-zinc-400 dark:fill-zinc-600', label: '금속' },
  poly: { fill: 'fill-violet-200 dark:fill-violet-900', label: '폴리실리콘' },
  resist: { fill: 'fill-emerald-200 dark:fill-emerald-900', label: '감광제' },
  substrate: { fill: 'fill-slate-200 dark:fill-slate-700', label: '기판' },
  'band-conduction': { fill: 'fill-teal-50 dark:fill-teal-950', label: '전도띠' },
  'band-gap': { fill: 'fill-transparent', label: '금지대역' },
  'band-valence': { fill: 'fill-indigo-50 dark:fill-indigo-950', label: '충만띠' },
  // 대비: brand-500은 라이트·다크 어느 쪽에서도 TEXT와 4.5:1을 못 넘긴다(실측 3.97 / 3.36).
  // 다른 12개 톤과 같은 '라이트=틴트 / 다크=셰이드' 패턴으로 맞춰 양쪽 8:1 이상을 얻는다.
  // 라이트를 100이 아니라 300으로 두는 이유: 100은 band-valence(indigo-50)와 구분이 안 돼
  // '강조색으로 구분했다'는 note가 거짓이 된다. 300이면 채도로 확실히 갈린다.
  accent: { fill: 'fill-brand-300 dark:fill-brand-900', label: '강조' },
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
// 대비: slate-500은 흰 배경에서는 4.76:1이지만 채운 노드 위(violet-100 등)에서 4.01:1로 떨어진다.
// 도해 안에서는 가장 어두운 배경이 아니라 '칠해진 배경' 위에 놓이는 것이 기본이라 slate-600으로 둔다.
export const TEXT_MUTED = 'fill-slate-600 dark:fill-slate-400';

/** 카드형(HTML) 도해가 공유하는 테두리·배경. */
export const CARD = 'rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900';

/**
 * 라벨을 `\n` 기준으로 나눈다. SVG `<text>`는 자동 줄바꿈이 없어 `<tspan>`으로 쪼갠다.
 * Design §3.2 — 라벨은 12자 이내가 원칙이고, 넘치면 저작자가 `\n`을 넣는다.
 */
export function splitLabel(label: string): string[] {
  return label.split('\n');
}
