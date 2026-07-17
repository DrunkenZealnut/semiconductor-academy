# Design — 「반도체 박막·확산」(에이치앤지) 자료원 — 3대단원 8모듈

> **Feature**: `hs-thinfilm-diffusion` · Plan: `docs/01-plan/features/hs-thinfilm-diffusion.plan.md`
> 확정안(Plan §9 승계·승인): **8중단원 전량 편입 · 파일럿 "박막 공정의 개요" · 장비 일반화 특칙 강화판 · 실습과제 단위 재구성 · "장비 기술자의 눈" 각도**

---

## 1. 아키텍처 확장 — 신규 인프라 없음

카테고리 공용 골격(4권째 실증) 그대로. 코드 신규 파일 **0개**.

| 확장 지점 | 조치 |
|---|---|
| `sources.ts` | `HS_THINFILM_DIFFUSION`(order 9) 등록만 |
| `schoolTextMdx.tsx` REGISTRY | `'hs-thinfilm-diffusion': {8개 모듈}` 블록 추가 |
| 홈 `SourcePicker` | 무수정(교과서 그룹 6번째 카드 자동) |

## 2. Source 등록 (`sources.ts`)

```ts
/**
 * 반도체고 교과서 「반도체 박막·확산」 — 박막(증착)·확산 공정과 장비의
 * 구조·조작·유지보수 (2015 개정 교육과정, 충청북도교육청 인정 2019-12-26,
 * P3 「포토·에칭」과 같은 시리즈 자매편). 원자료
 * data/school-text/20260415_205038_반도체박막확산_에이치앤지_/ 전면 재작성.
 * ⚠️ 장비 매뉴얼 밀도 시리즈 최고(P-5000 CVD·TEL α-8 퍼니스, 터치 메뉴 시퀀스)
 * — "장비 일반화 특칙 강화판"(Design §4) 적용, 조작·터치 시퀀스 재현 금지.
 */
export const HS_THINFILM_DIFFUSION: Source = {
  id: 'hs-thinfilm-diffusion',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 박막·확산',
  subtitle:
    '반도체고 교과서 — 박막(증착)·확산 공정부터 CVD 클러스터·퍼니스 장비의 구조·운용·정비까지',
  attribution: '이재선 외 4인',
  publisher: '에이치앤지',
  license: 'fair-use',
  order: 9,
  accent: 'school',
  category: 'hs-textbook',
  sections: [ /* §3 표 순서대로 8개, 완성 모듈만 등록 */ ],
};
```

## 3. 섹션 전체 설계 — 8모듈

원문 정순(페이지 1~248 단조). Ⅰ·Ⅲ 경계는 페이지 마커 대조로 확정, **Ⅱ.2/Ⅱ.3 경계는 러닝 헤더 혼재로 원문상 모호** — 해당 두 모듈은 연속 구간으로 같은 배치에 배정하고 담당 에이전트가 실습 소단원 첫 표제("가. ~ 실습" 형태) 기준으로 자체 확정·보고한다(§7). 5577행 이후(찾아보기·참고문헌·판권) 재구성 비대상.

| # | id | title | group | 원문 라인 | RT | 비고 |
|:-:|---|---|---|---|:-:|---|
| 1 | `thinfilm-process` | 박막 공정의 개요 | 공정의 개요 | 51~347 | 12 | **파일럿**. 도체/부도체/반도체 재료, PVD vs CVD, 막질별 용도 |
| 2 | `diffusion-process` | 확산 공정의 개요 | 공정의 개요 | 348~466 | 9 | 확산·산화의 원리, 열처리 |
| 3 | `thinfilm-equipment` | 박막 장비의 구조 및 기능 | 박막 장비 | 467~2009 | 15 | **특칙** — 클러스터(멀티 챔버) CVD 장비의 보편 구조(P-5000은 사례). 시리즈 최대 모듈(1,543줄) |
| 4 | `thinfilm-maintenance` | 박막 장비의 조작 및 유지보수 | 박막 장비 | 2010~(C배치 자체 확정) | 13 | **특칙** — 기동·정지·레시피·PM의 논리 |
| 5 | `thinfilm-practice` | 박막 장비의 실습 | 박막 장비 | (C배치 자체 확정)~3172 | 11 | **특칙+압축** — 실습과제 단위 추출(챔버 벤트·리크 체크·MFC 교환·P/T 및 두께 테스트 등, 전수는 Do 확정) |
| 6 | `diffusion-equipment` | 확산 장비의 구조 및 기능 | 확산 장비 | 3173~3541 | 11 | **특칙** — 수직형 퍼니스의 보편 구조(TEL α-8은 사례), 배치식 vs 매엽식 대비 |
| 7 | `diffusion-maintenance` | 확산 장비의 조작 및 유지보수 | 확산 장비 | 3542~4870 | 14 | **특칙** — 레시피 스텝·온도 프로파일·PM (1,329줄) |
| 8 | `diffusion-practice` | 확산 장비의 실습 | 확산 장비 | 4871~5576 | 11 | **특칙+압축** — 오토셔터 분해·조립 등(전수는 Do 확정) |

- RT 합계 **96분**. href `/sources/hs-thinfilm-diffusion/{id}/`. 등록 순서 = 목차 순서.
- 실습 모듈 title은 원문 그대로("박막/확산 장비의 실습" — 트랙명으로 구분 충분, P3식 구분어 불필요).

## 4. 콘텐츠 재구성 계약 (시리즈 계약 승계)

전역 컴포넌트·MDX 안전 규칙·화학식 유니코드(SiH₄·NH₃·TEOS·SiO₂)·footer 템플릿("「반도체 박막·확산」(이재선 외 4인 지음, 에이치앤지) {단원} '{중단원명}'…") 시리즈 동일.

### 이 권 특유 규칙

1. **장비 일반화 특칙 — 강화판**(#3~8 전 모듈): P3 3축(보편 구조/운용 개념/PM 사고방식)에 더해 ⑴ **터치스크린 메뉴·설정화면·버튼 시퀀스 재현 금지** — "Vacuum Service를 터치하고 … 메뉴를 선택" 류의 UI 조작 연쇄는 "장비 소프트웨어에서 해당 기능을 실행한다" 수준으로 추상화 ⑵ 모델명(P-5000·TEL α-8/ALPHA-805CN)은 대표 사례로 모듈당 2~3회 이내, 표기는 **P-5000·TEL α-8** 통일 ⑶ **배치식(퍼니스, 수십 장 일괄) vs 매엽식(클러스터, 한 장씩)** 대비를 Ⅱ·Ⅲ 트랙을 관통하는 학습 축으로 활용. 공정 파라미터 수치(온도·압력·리크율 기준치 등)는 "이 유형 장비의 대표 조건" 문맥으로 보존.
2. **실습과제 단위 재구성**(#5·#8): 원문 실습은 독립 워크시트가 아니라 조작·유지보수 절차와 상호 참조로 얽혀 있다("[실습과제 1 챔버 벤트 점검 참조]"). 실습 모듈은 **실습과제 단위**(벤트·리크 체크·MFC 교환·P/T 및 두께 테스트·오토셔터 분해조립 등 — 담당 배치가 전수 확정·보고)로 추출해 대표 상세+변형표 압축을 적용하고, 조작·유지보수 모듈(#4·#7)과는 **같은 소스 SourceRef로 상호 연결**(본문에는 절차의 논리, 실습에는 목표·핵심 절차·확인 사항). 안전 유의사항 전건 보존(대표 개별+통합 warning Callout, 고유 항목 없으면 통합 단독).
3. **"장비 기술자의 눈"**: 공정 원리(증착 화학·확산 물리)는 리마인더+daegu/책 참조로 압축(§5), 본문은 장비가 "어떻게 구현·운용·유지되는가".
4. **유해인자 연결 우선**: 실란(자연발화성)·아르신·TEOS·NH₃ 대목에서 ChapterRef(ch10 증착·ch7 확산)로 안내, 위험 상세는 책이 담당.
5. **P3 권 간 연결(시리즈 첫 적용)**: 진공 계통·게이트 밸브·리크 체크 등 P3와 공통 개념은 `hs-photo-etch`의 `etch-equipment`·`etcher-maintenance`로 SourceRef — 중복 재서술 대신 "에칭 장비에서 본 그 구조" 연결.
6. **OCR 오식 대응**: 러닝 헤더("#### 3. 박막 장비의 실습" 반복)·"라크 업"→리크 업·"콘텐서"→콘덴서 등 교정, 애매 구간 보류(시리즈 원칙).

## 5. cross-link 태깅 전략 (`hs-thinfilm-diffusion/_links.json`)

본문 실증 기준(Do 확정) — 후보표:

| 모듈 | topics 후보 | chemicals 후보 |
|---|---|---|
| `thinfilm-process` | `deposition`, `gas-safety` | `silane`, `ammonia` (SiH₄ 5·NH₃ 2 실증, TEOS는 chemicals DB 부재로 제외) |
| `diffusion-process` | `diffusion` | (아르신 1회 — 실증 미달 시 제외) |
| `thinfilm-equipment` | `deposition`, `gas-safety`, `engineering-controls` | |
| `thinfilm-maintenance` | `deposition`, `engineering-controls` | |
| `thinfilm-practice` | `deposition` | |
| `diffusion-equipment` | `diffusion`, `engineering-controls` | |
| `diffusion-maintenance` | `diffusion`, `engineering-controls`, `gas-safety` | |
| `diffusion-practice` | `diffusion` | |

`deposition`·`diffusion` 태그로 책(ch10·ch7)·daegu(thin-film·doping·oxidation)·NCS(thinfilm 계열)와 자동 상호 연결.

**직접 연결 매핑**:

| 이 권 모듈 | 연결 대상 | 수단 |
|---|---|---|
| `thinfilm-process` | daegu `thin-film` + 책 ch10(증착 유해인자) + ncs `thinfilm-precursor`(전구체 재료) | SourceRef + ChapterRef(order 10) |
| `diffusion-process` | daegu `doping`·`oxidation` + 책 ch7(확산 유해인자) | SourceRef ×2 + ChapterRef(order 7) |
| `thinfilm-equipment` | ncs `thinfilm-diffusion-equipment`(박막·확산 장비 운영) + `hs-photo-etch` `etch-equipment`(진공·가스 계통 공통 — 권 간) | SourceRef |
| `thinfilm-maintenance` | ncs `vacuum-plasma-maintenance` + 같은 소스 `thinfilm-equipment`·`thinfilm-practice` | SourceRef |
| `diffusion-equipment` | ncs `thinfilm-diffusion-equipment` | SourceRef |
| `diffusion-maintenance` | ncs `chemical-gas-maintenance` + 같은 소스 상호 | SourceRef |
| 실습 2모듈 | 같은 소스 maintenance 모듈 상호 | SourceRef |

→ FR-7(daegu 3건: thin-film·doping·oxidation) 충족, FR-10(책 2 + NCS 3+ + P3 1) 초과.

## 6. 검증 계획

- `typecheck`+`lint`+`build` — 인덱스 3트랙+8모듈 SSG, 기존 8자료원 회귀 0.
- `build:cross-link`(9 sources 예상)·`quotes.json` 회귀 0.
- 렌더 실측: 홈 6번째 교과서 카드·파일럿 3단 레이어·ChapterRef ch7/ch10·권 간 SourceRef(P3) 동작.
- 저작권: 원문 이미지 0·근접 패러프레이즈 스캔(시리즈 표준)·출처 표기 8/8.
- **조작·터치 시퀀스 스캔(강화판)**: "터치", "선택한다", "메뉴", "화면에서" 연쇄 패턴 부재 확인(#3~8) + 모델명 빈도.
- 실습 커버리지: 실습과제 전수(담당 배치 보고 기준) 누락 0·안전 항목 누락 0·본문↔실습 상호 참조 정합.

## 7. 구현 순서

1. `sources.ts`·`schoolTextMdx.tsx` 등록(파일럿부터 점증)
2. 파일럿 `thinfilm-process.mdx`(51~347행 — daegu thin-film·ch10 연결 실증) → **검증 게이트**
3. 잔여 7모듈 병렬 서브에이전트 **4배치**(공통 스펙 파일, 시리즈 표준):
   - A: `diffusion-process`(348~466) + `diffusion-equipment`(3173~3541) — 확산 축 소형 2모듈
   - B: `thinfilm-equipment`(467~2009) **단독** — 시리즈 최대 모듈
   - C: `thinfilm-maintenance`+`thinfilm-practice`(2010~3172 연속 배정 — **경계 자체 확정·보고**, 실습과제 전수 보고)
   - D: `diffusion-maintenance`+`diffusion-practice`(3542~5576 연속 배정 — 실습과제 전수 보고)
4. `_links.json`(본문 실증) → 전체 게이트(§6) + 렌더 실측
