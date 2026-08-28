import type { ReactNode } from 'react';

/**
 * 도해 12종의 이름. `DiagramFrame`이 `data-diagram`으로 DOM에 내보낸다.
 *
 * ★**리터럴이어야 한다.** `LayerStack.name` 같은 식별자 유도는 프로덕션에서 죽는다 —
 * Next.js가 서버 번들도 최소화해서 `LayerStack.name`이 **`"J"`** 가 되는 것을 실측했다
 * (`render-gate-scope-floor` Design §0.1).
 *
 * ★**이름이 파일명과 달라지면 `verify:render`가 운다.** 그것이 이 값의 쓸모다 —
 * 관문은 파일시스템에서 유도한 **기대**와 브라우저가 본 **관측**을 대조하고,
 * 어긋나면 `exit 2`(범위 상실)로 끝낸다. 조용히 맞는 것보다 시끄럽게 어긋나는 편이 낫다.
 */
export type DiagramKind =
  | 'CompareCards'
  | 'CurvePlot'
  | 'FlowSteps'
  | 'LabeledFigure'
  | 'LatticeDiagram'
  | 'LayerStack'
  | 'NodeGraph'
  | 'ScaleRuler'
  | 'Timeline'
  | 'TreeBranch'
  | 'TruthTable'
  | 'ValueBars';

/**
 * 도해 컴포넌트 공통 props.
 * Design: docs/02-design/features/diagram-component-set.design.md §2.1
 */
export interface DiagramCommon {
  /** 도해 제목. SVG `<title>`에도 쓰인다. */
  caption?: string;
  /** 도해 아래 보조 설명. */
  note?: string;
  /** `<details>`에 넣을 동일 정보 표. 스크린리더·검색 대응. */
  altTable?: ReactNode;
}

/**
 * SVG를 렌더하는 도해의 공통 props.
 *
 * `idPrefix`가 필수인 이유: `<pattern>`·`<marker>`·`<clipPath>`는 문서 전역 id로
 * 참조된다(`fill="url(#…)"`). 한 페이지에 같은 종이 둘 이상 오면 뒤엣것이 앞엣것의
 * 정의를 참조한다. 서버 컴포넌트라 `useId()`를 쓸 수 없어 저작자가 MDX에서 지정한다.
 * 규약: 모듈 슬러그를 쓰고, 한 모듈에 같은 종이 둘이면 `-1`·`-2`를 붙인다.
 */
export interface SvgDiagramCommon extends DiagramCommon {
  idPrefix: string;
}
