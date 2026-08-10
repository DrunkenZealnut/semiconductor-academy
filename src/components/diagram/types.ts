import type { ReactNode } from 'react';

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
