# Gap 분석 — safedata-injection (Check)

> **Feature**: `safedata-injection` · **분석일**: 2026-07-18 · **방식**: gap-detector 읽기 전용 정적 대조(표본 MDX 3종 실독) + 게이트 재실측
> **기준**: `docs/02-design/features/safedata-injection.design.md` (권위) · **대상**: `hs-semicon-infra` 산업안전 트랙 10모듈
> **Match Rate**: **~99%** (gap-detector 최초 97% → Minor 2건 즉시 반영 후)

---

## 종합

| 범주 | 점수 | 상태 |
|------|:----:|:----:|
| Design 정합(FR-1~7) | 100% | ✅ |
| 아키텍처 정합(인프라 재사용·미러) | 100% | ✅ |
| 규약 정합(slug·group·통제어휘) | 100% | ✅ |
| 문서 정합(Design §5 표) | 해소 | ✅ |
| **Overall** | **~99%** | ✅ |

## 항목별 판정

| # | 항목 | 판정 | 근거 |
|---|------|:---:|------|
| 1 | FR-1 자료원 등록·홈 교과서 그룹(hs-textbook·order 12) | ✅ | `sources.ts` `HS_SEMICON_INFRA` category=hs-textbook·order=12, SOURCES 12번째 = 교과서 9권째 카드 |
| 2 | FR-2 10모듈·로더↔sections 짝(자리표시 0) | ✅ | sections 10 = REGISTRY 10로더 = MDX 10파일 slug 완전 일치, "본문 준비 중" 0 |
| 3 | FR-3 3부 구조(유해요인·건강영향·작업환경관리) | ✅ | 공정 9모듈 전부 `## 1~3` 3부. management는 그룹A(안전보건 기초)라 3부 비대상 — Design §3 분류 일치 |
| 4 | FR-4 안전 정확성·지어낸 물질 0 | ✅ | arsine→용혈성빈혈·phosphine→폐부종·HF→지연/전신독성·벤젠→백혈병·강산미스트→후두암 기전 정합. _links.json 화학물질 26종 전부 chemicals.json 실재 |
| 5 | FR-5 양방향 cross-link | ✅ | 통제어휘 공유 자동 역방향 + 본문 SourceRef/ChapterRef(hs-thinfilm-diffusion·osha part-2/3·ch07·11·13·14·16·hs-assembly-inspection) 이중 |
| 6 | FR-6 unknownChemicals 0·edges 증가 | ✅ | 재실측: `unknownChemicals: []`·edges 857→**1107**(+250)·162 sections·12 sources |
| 7 | FR-7 출처·교육용 고지 | ✅ | 10모듈 전부 교육용 Callout + 출처 div(서울시교육청·OSHA·책 페이지) |
| 8 | §3.2 모듈 구성표 vs sources.ts | ✅ | slug·group·순서 완전 일치(안전보건1·전공정6·후공정3) |
| 9 | §4 콘텐츠 계약(3단 레이어·이미지0·import·Term 금지) | ✅ | LayeredExplain 전 모듈, 원문 이미지 0, import 0, Term 0 |
| 10 | §5 태깅표 vs _links.json | ✅(해소) | 본문 실증 원칙 준수. Design §5 표에 "illustrative·_links.json 권위" 주석 추가로 문서 정합 |

## Gap 목록 (심각도별)

- 🔴 Critical: 없음
- 🟡 Major: 없음
- 🔵 Minor: **2건 즉시 반영·해소**
  1. Design §5 예시표 stale → §5에 "설계 예시, 실제 태깅은 본문 실증 `_links.json` 권위" 주석 1줄 추가.
  2. `safety-deposition`에 `flammable` 누락(실란 자연발화 본문 서술) → `_links.json` hazards에 `flammable` 추가, cross-link 재빌드(edges 1105→1107) 확인.

## 본문 실증 반영으로 Design 예시와 갈린 지점 (결함 아님 — 구현이 옳음)

| 모듈 | Design §5 예시 | 실제(원문 대조) | 사유 |
|------|----------------|-----------------|------|
| safety-diffusion | arsine·phosphine·diborane | 원문 사용물질 10종(+silane·dichlorosilane·fluorine·ammonia·옥시염화인·HF·황산·과산화수소). diborane은 diffusion 본문 미서술→deposition | 본문 실증 확대 |
| safety-etch | HF·fluorine·chlorine | HF·황산·과산화수소·ammonia·chlorine·ozone | 본문 기준 교체 |
| safety-backend-chemical | lead 포함 | lead 제외(원문=무연솔더 Sn-Ag-Cu) | 지어낸 물질 방지 |
| safety-photo/backend-mechanical | (에틸렌글리콜에테르 근사) | 제외 | 원문 에틸렌글리콜 ≠ 에틸렌글리콜에테르류(화학적 상이) |
| safety-backend-test | benzene | chemicals 없음 | VOC(톨루엔·n-헥산)은 chemicals.json 부재 |

## 범위 외 / 후속 (gap 아님)
- **D-4 OSHA part-1a/1b/4 물질 태그 보강**: Design상 선택(부수 목표). 안전 허브 태깅으로 다리는 이미 대폭 강화(edges +250) → 별도 후속 여지.
- **D-5 전리방사선 어휘**: `exposure-monitoring`+`occupational-disease` 재사용(신규 radiation 어휘 회피) — Design 기본안 준수 ✅.
- **홈 렌더 실물 화면**: 데이터 모델(category·order) 확인, 상속 인프라라 저위험.

## 결론
Match Rate **~99% (≥90%)** — Critical/Major 0, Minor 2건 즉시 해소. iterate 불필요. **`/pdca report safedata-injection` 진행 권고**.
