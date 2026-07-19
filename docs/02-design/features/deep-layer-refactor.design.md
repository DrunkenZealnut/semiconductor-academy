# deep 레이어 인용/요약 분리 리팩터링 — Design

- **작성일**: 2026-07-19
- **브랜치**: `DrunkenZealnut/refactor-deep-layer` (현재 HEAD `f265a56`에서 분기)
- **관련**: CodeRabbit PR #24 인라인 지적 `safety-backend-chemical.mdx:56` (deep.quote 재서술) — 별도 PR로 분리
- **상태**: 설계 승인 대기

## 1. 문제

`LayeredExplain`의 3단(Deep) 레이어는 `deep.quote`를 **무조건** "📖 학술 원본 보기" 제목 + **italic `<blockquote>`**로 렌더한다. 즉 어떤 내용이 들어가든 UI는 "학술 원본(verbatim)"으로 프레이밍한다.

그러나 `deep={{ quote }}` 사용처 207개 중 **106개(9개 textbook 자료원)는 원문이 아닌 재서술(요약)**이며, 유일한 구분 신호는 `sourceSection` 문자열의 `(재서술)` 표기뿐이다. 결과적으로:

- **활성 문제 — UI 오표기**: 요약문이 "학술 원본 보기" italic 인용 블록으로 노출되어, 교육 콘텐츠의 출처 정확성을 훼손한다. `📖 학술 원본 보기 — … (재서술)`은 라벨 자체가 모순된다.
- **잠재 위험 — 추출 오염**: `scripts/extract-quotes.mjs`가 `deep.quote`를 `quotes.json`으로 추출한다. 현재는 chapters·osha-scs만 스캔해 textbook 소스는 비대상이라 오염이 없지만(quotes 214 무회귀), 향후 스캔 대상이 확장되면 재서술이 원문 인용으로 추출될 구조적 위험이 남는다.

## 2. 목표 / 비목표

**목표**
- `deep` 레이어에서 **원문 인용(verbatim)** 과 **요약/재서술(paraphrase)** 을 데이터 모델·UI 양쪽에서 명확히 구분한다.
- 요약은 "학술 원본"이 아닌 별도 프레임으로 렌더한다.
- 인용 추출 시 요약 블록을 property-position 가드로 제외한다 (라인 스캐너 방침 유지).

**비목표**
- 챕터 17개(책 원문 verbatim, `sourcePage` 보유) — 불변. 정확히 표기됨.
- ncs-semi 84개(NCS 능력단위 목표 원문 인용) — 불변. `deep.quote` 유지. (근거: §3)
- 콘텐츠 문구 자체의 재작성/보강 — 이번 범위 밖. 필드/프레임만 변경.
- cross-link 시스템 — 무관(topic/hazard는 `_links.json` 기반, deep 본문과 독립).

## 3. 현황 분석

| 그룹 | 파일 | `deep.quote` 내용 | 표기 | extract 대상 | 판정 |
|------|------|------------------|------|-------------|------|
| chapters | 17 | 책 원문 verbatim | `sourcePage` + 장·절 | ✅ | 인용(유지) |
| ncs-semi | 84 | NCS 능력단위 목표("…할 수 있다") | `sourceSection`만 | ❌ | 인용(유지) |
| **textbook** (daegu, hs-assembly/basic-1/basic-2/equipment/photo-etch/semicon-basics/semicon-infra/thinfilm) | **106** | **재서술** | `(재서술)` 표기 | ❌ | **요약(대상)** |

**경계의 근거**
- `(재서술)` 표기 파일 = 106개, textbook 9개 소스의 `deep={{` 블록 = 106개로 **정확히 1:1** 일치. 모든 textbook deep 블록이 재서술이고, 모든 재서술이 textbook에 있다.
- ncs-semi 샘플(`package-materials.mdx`): `"…패키지 재료의 요구사항을 파악하여 선정하고, 제조 및 검증할 수 있다."` + `핵심 용어: …` — NCS 능력단위 목표의 표준 서술을 거의 원문 인용한 형태. 재서술 아님 → `quote` 유지.

**컴포넌트** (`src/components/content/LayeredExplain.tsx`)
- `deep?.quote`가 truthy일 때만 Disclosure 렌더. 제목 `📖 학술 원본 보기${sourcePage?}${sourceSection?}`, 본문 italic `<blockquote>`, `sourcePage` 있으면 책 출처 각주.

**추출** (`scripts/extract-quotes.mjs`)
- `CHAPTERS_DIR`(chapters) + `OSHA_DIR`(osha-scs)만 스캔. `deep={{` 블록에서 `quote:` JSX를 텍스트로 추출. textbook·ncs-semi 디렉터리는 미스캔.

## 4. 설계 (접근 B — 필드 분리)

`deep`를 **discriminated union**으로 만든다. 필드명이 곧 의미를 갖고, 추출은 property-position 가드로 요약 블록을 건너뛴다.

### 4.1 데이터 모델 (`LayeredExplain.tsx`)

```ts
type DeepQuote = { quote: ReactNode; sourcePage?: number; sourceSection?: string };
type DeepSummary = { summary: ReactNode; sourceSection?: string };

interface LayeredExplainProps {
  hook: ReactNode;
  easy: { analogy: ReactNode; illustration?: ReactNode };
  deep?: DeepQuote | DeepSummary;
}
```

### 4.2 컴포넌트 렌더 분기

- `'quote' in deep` → **현행 유지**: 제목 `📖 학술 원본 보기 (p.N) — {sourceSection}`, italic `<blockquote>`, 책 출처 각주.
- `'summary' in deep` → **신규**: 제목 `📘 자료 정리 보기 — {sourceSection}`, **non-italic 일반 프로즈**(blockquote 인용 스타일·페이지 각주 없음). 시각적으로 "인용"이 아니라 "정리/배경"임을 드러낸다.
- 둘 다 없으면 렌더 안 함(현행과 동일).

라벨 문구 `"📘 자료 정리 보기"`는 컴포넌트 내 단일 문자열 → 변경 비용 최소.

### 4.3 콘텐츠 마이그레이션 (106개, 코드모드)

결정론적 2단계 치환. 각 파일 deep 블록당 `quote:` 1회·`sourcePage` 0회로 확인됨(엣지 없음).

1. **필드 개명**: `deep={{` 블록 내 `quote:` → `summary:` (106개, 각 1회)
2. **`(재서술)` 마커 제거** (프레임이 대체하므로 중복):
   - 접미형: sourceSection 끝의 `(재서술)`(앞 공백 포함) 제거 — **102개**
   - embedded형 `, 재서술)'` → `)'` — **4개** (예: `(확산 장비의 실습, 재서술)` → `(확산 장비의 실습)`)

코드모드는 `scripts/`에 일회용 스크립트로 작성 후 실행하고, 커밋에는 결과 diff만 포함(스크립트는 폐기 또는 별도 보관).

### 4.4 추출 가드 (`extract-quotes.mjs`)

기능 변경 불필요(chapters·osha만 스캔, 둘 다 `quote` 유지). **방어적 가드** 추가: deep 블록에 property-position `quote:`(줄 시작)가 없으면(=`summary` 전용) skip. 라인 스캐너 방침에 맞춘 휴리스틱 가드로, 완전 파싱은 아니지만 산문의 `quote:` 오탐을 피하고 향후 textbook 스캔이 추가돼도 요약 블록을 건너뛴다.

## 5. 범위 & 브랜치 시퀀싱

**대상 파일**: 106개 = main의 8개 소스(96개) + `hs-semicon-infra`(10개, PR #24 신규) + `LayeredExplain.tsx` + `extract-quotes.mjs`.

**의존성**: `hs-semicon-infra`는 `main`(be832e2)에 없고 PR #24(f265a56)에만 존재.

**전략**: 리팩터링 브랜치를 **f265a56(#24 HEAD)에서 분기** → 106개 전부 한 번에 처리(#24 위에 스택). PR base를 `DrunkenZealnut/safedata-injection`으로 두면 리팩터링 diff만 노출. **#24 머지 후 base를 `main`으로 retarget/rebase**.

- 대안(비채택): main에서 분기 → hs-semicon-infra 10개 누락, #24 머지 시 관례 불일치 → 후속 PR 필요. 불완전.

## 6. 검증 게이트

- `npm run typecheck` 0
- `npm run lint` 신규 0
- `npm run build` 성공(정적 export)
- **`quotes.json` 214 무회귀** (요약 미추출 확인)
- `cross-link.json` unknown 0
- **육안 확인**: 마이그레이션된 textbook 페이지 1개에서 Deep 레이어가 non-italic "📘 자료 정리 보기"로 렌더되고 "학술 원본"·italic 인용 스타일이 사라졌는지. 챕터 페이지 1개는 "📖 학술 원본 보기"가 그대로인지(무회귀).

## 7. 리스크 & 롤백

- **대량 기계 치환 오류**: 106개 일괄 변경. → 코드모드는 정규식 2규칙으로 한정, diff 전수 리뷰 + build로 검출. 각 파일 `quote:` 1회·`sourcePage` 0회로 예외 없음 확인 완료.
- **union 타입과 MDX**: MDX props는 authoring 시 강타입 검사가 얕음 → 타입은 문서화·런타임 분기가 실효. 컴포넌트 렌더 로직이 안전망.
- **롤백**: 단일 리팩터링 브랜치이므로 브랜치 폐기로 즉시 원복. 콘텐츠 diff는 순수 필드/문자열 치환이라 역치환도 가능.

## 8. 결정 로그

1. **접근 B(필드 분리)** 채택 — CodeRabbit 제안과 일치, 필드명=의미, 추출은 property-position 가드로 요약 제외. (A 판별필드·C 문자열 스니핑 반려: 각각 이름/내용 불일치·취약성)
2. **요약 라벨** = `"📘 자료 정리 보기"` (대안 "원문 요약 보기"/"자세히 보기"는 단일 문자열 변경으로 대체 가능)
3. **ncs-semi(84)** = `quote` 유지 (능력단위 목표 원문 인용 판정)
4. **`(재서술)` 마커** = 제거 (프레임이 비-verbatim을 이미 표기)

## 9. 후속(writing-plans에서 상세화)

- 단계: ① 컴포넌트 타입/렌더 → ② 코드모드 작성·실행(106) → ③ extract 가드 → ④ 게이트 검증 → ⑤ PR(base=#24 브랜치).
