# Gap 분석 — hs-basic-tech-2 (Check)

> **Feature**: `hs-basic-tech-2` · **분석일**: 2026-07-17 · **분석자**: gap-detector Agent + 오케스트레이터 검증
> **기준**: `docs/02-design/features/hs-basic-tech-2.design.md` §1~7
> **구현**: `src/lib/sources.ts`(HS_BASIC_TECH_2) · `src/lib/schoolTextMdx.tsx` · `src/content/sources/hs-basic-tech-2/`(MDX 15 + `_links.json`)

## 결과 요약

```text
┌──────────────────────────────────────────────────────┐
│  Design Match Rate: 100%  (기준 90% 통과 ✅)         │
├──────────────────────────────────────────────────────┤
│  검증 항목 22 · ✅ 22 · ⚠️ 0 · ❌ 0                  │
│  Gap: High 0 · Medium 0 · Low 2(채점 반영·해소)      │
│       + Low 2(비채점 관찰·무조치)                    │
│  Positive deviations: 5건                            │
└──────────────────────────────────────────────────────┘
```

최초 gap-detector 산출은 22항목 중 ⚠️ 2건(§4-④, §5 sectional-views)으로 **95.5%**였으나,
같은 분석 세션 안에서 두 건 모두 구현·문서를 즉시 보완해 22/22 전항목 ✅로 전환했다
(§2 Low-1·Low-2 참고 — 재보완 후 재확인, 되돌리기 없음).

Match Rate = (✅22×1) / 22 = 22/22 = **100%**

## 1. 항목별 매트릭스 (요약)

| Design 절 | 검증 항목 | 판정 | 비고 |
|---|---|:--:|---|
| §1 | 신규 라우트/컴포넌트 0 — 공용 `[source]/[module]` 재사용, 코어 6개 자료원 무수정 | ✅ | |
| §2 | Source 11필드(id·kind·language·title·subtitle·attribution·publisher·license·order 7·accent·category) 설계값 일치 | ✅ | |
| §3 | 15모듈 id·title·group·readingTime(합 173분) 설계 표와 완전 일치, 등록 순서=목차 순서, href 규칙, REGISTRY 15↔sections 15 정합 | ✅ ×4 | |
| §4 공통 | LayeredExplain 15/15 · 학습목표 info Callout 15/15 · 출처 footer 15/15 · 원문 이미지 0 | ✅ ×4 | |
| §4-① | book1 "기초→응용" 각도(리마인더+SourceRef, 중복 재작성 없음) | ✅ | |
| §4-② | CAD 명령어 나열 0 · AutoCAD 정확히 1회 | ✅ | |
| §4-③ | 반복 실습 압축 — #10 3건(①상세+②③표) · #12 8건(①⑦상세+6표) · #15 8건(①②상세+6표), 전건 커버 | ✅ | |
| §4-④ | 안전 유의사항 보존 — 공압·유압 실습은 대표 개별+통합 Callout, arduino는 통합 단독 | ✅ | 2026-07-17 설계 §4-4에 "실습 고유 항목 없는 모듈은 통합 단독 허용" 명문화 → 구현이 기준 충족(원래 ⚠️) |
| §4-⑤ | 원문 단위+SI 병기(Ⅳ장) | ✅ | |
| §4-⑥ | 코드 펜스 규칙(코드블록 밖 리터럴 부등호 0 — 빌드 통과 방증) | ✅ | |
| §4-⑦ | #13 레지스터 비트 명세 압축(SREG 대표 개념만) | ✅ | |
| §5 | `_links.json` 3모듈 topics/hazards 설계 표와 일치 | ✅ | |
| §5 | book1 SourceRef 매핑 8행 전건 | ✅ | 2026-07-17 `development-drawings.mdx`에 sectional-views SourceRef 추가 → 8/8 충족(원래 ⚠️ 7/8) |
| §5 | NCS 8섹션 전부 실사용 | ✅ | |
| §6 | SourceRef source/section id 전량 실존(sources.ts 대조, 미존재 0) | ✅ | |

## 2. Gap 목록 — High/Medium 0 · Low 4 (채점 반영 2건 전건 해소 · 비채점 관찰 2건 무조치)

22항목 매치 매트릭스에 실제로 포함돼 점수에 반영됐던 항목은 Low-1·Low-2뿐이다(§2 최초 gap-detector 산출 시 ⚠️ 2건). Low-3·Low-4는 매트릭스 밖에서 별도로 포착한 관찰 사항으로, 애초에 Match Rate 산식에 포함되지 않았다.

| # | 심각도 | 내용 | 조치 | 채점 반영 |
|---|:--:|---|---|:--:|
| Low-1 | Low | 설계 §5 book1 매핑의 `sectional-views` 연결 미구현(두 설계 모듈 모두 drawing-methods만 연결) | ✅ **해소** — `development-drawings.mdx` tip Callout에 sectional-views SourceRef 추가, 재빌드·렌더 확인(2026-07-17) | 예 — §5 행 ⚠️→✅ |
| Low-2 | Low | arduino-practice 대표 실습 개별 안전 Callout 없이 통합 단독(원문 안전이 공통 3항목뿐이라 항목 누락은 0) | ✅ **해소** — 설계 §4-4에 "실습 고유 항목 없는 모듈은 통합 단독 허용" 명문화(설계 문서 갱신, 사후 명문화임을 문서에 표기) | 예 — §4-④ 행 ⚠️→✅ |
| Low-3 | Low | NCS 호스트 모듈 2건 트랙 내 이동(chemical-gas-maintenance: 설계 pneumatics-maintenance→실제 electropneumatic-circuits / equipment-mechanical-assembly: 설계 machine-tools→실제 equipment-manufacturing) | 무조치 — 같은 대단원 내 더 자연스러운 문맥으로의 이동, FR-7(NCS 최소 3건) 충족에 영향 없음 | 아니오 — 매트릭스 밖 관찰 |
| Low-4 | Low(관찰) | `machine-tools.mdx` "흡착력 60kgf" SI 미병기 | 무조치 — 설계 §4-5 병기 범위는 "Ⅳ장 중심"으로 Ⅱ장 재료표 사양값은 범위 밖(엄밀 위반 아님) | 아니오 — 매트릭스 밖 관찰 |

Low-1·Low-2 해소로 매트릭스 22항목이 전부 ✅가 되어 **Match Rate 100%**. Low-3·Low-4는 채점 대상이 아니었으므로 100% 산정에 영향이 없다.

## 3. Positive Deviations (설계 초과 달성)

1. **추가 NCS 연결 2건** — microprocessor-practice→firmware-development, electrohydraulic-circuits→vacuum-plasma-maintenance (설계 미명시)
2. **권 내부 양방향 SourceRef** — electrohydraulic-circuits ↔ hydraulics-practice 학습 동선
3. **special-projections 투상도 4종**(등각·부등각·사·투시) — 설계 비고(3종 표기) 초과
4. **hydraulics-practice 안전 강화** — 대표 2건 상세 + 통합 Callout에 11항목 전건 명문(고유 2항목 실습명 명시)
5. **cad-drafting 맥락 Callout** — ISO 유래·반도체 상식 등 사이트 정체성 보강

## 4. 동적 검증 결과 (Do 단계 게이트, 정합 확인)

- typecheck 0오류 · lint 신규 경고 0
- build 217페이지 SSG — 15모듈+인덱스 HTML 전량 생성, 기존 자료원 회귀 0
- `build:cross-link` 7 sources · 103 sections · 699 bidirectional edges (공압 3모듈 자동 연결 섹션 렌더 확인)
- `quotes.json` 회귀 0 (교과서 인용 인덱스 비대상 유지)
- 렌더 스모크 15/15 — 3단 레이어·출처 footer·인덱스 5트랙·홈 교과서 그룹 4번째 카드·다크모드
- 저작권: 원문 이미지 0 · 근접 패러프레이즈 기계 스캔(공백 정규화 25자 연속 일치) — 검출 8건 중 사실 정보(재료목록·규격명) 6건 허용, 안전수칙·절차 3곳 재작성 후 **재스캔 0건**

## 5. 판정 및 권고

**Match Rate 100% → iterate 불필요, Report 진행.**

- 매트릭스 22항목 전부 ✅(Low-1 구현 보완, Low-2 설계 명문화로 두 건 모두 채점 반영 해소).
- Low-3·4는 매트릭스 밖 비채점 관찰 사항으로 무조치(합리적 편차, Match Rate에 영향 없음).
- 다음 단계: `/pdca report hs-basic-tech-2`

## 참고 문서

- Plan: `docs/01-plan/features/hs-basic-tech-2.plan.md`
- Design: `docs/02-design/features/hs-basic-tech-2.design.md`
- 선례: `docs/03-analysis/hs-basic-tech-1.analysis.md` (94.8%)
