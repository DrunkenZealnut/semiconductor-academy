# Gap 분석 — hs-photo-etch (Check)

> **Feature**: `hs-photo-etch` · **분석일**: 2026-07-17 · **분석자**: gap-detector Agent + 오케스트레이터 종결 검증
> **기준**: `docs/02-design/features/hs-photo-etch.design.md` §1~7
> **구현**: `src/lib/sources.ts`(HS_PHOTO_ETCH) · `src/lib/schoolTextMdx.tsx` · `src/content/sources/hs-photo-etch/`(MDX 15 + `_links.json`)

## 결과 요약

```text
┌──────────────────────────────────────────────────────┐
│  Design Match Rate: 100%  (기준 90% 통과 ✅)         │
├──────────────────────────────────────────────────────┤
│  검증 항목 26 · ✅ 26 · ⚠️ 0 · ❌ 0                  │
│  Gap: High 0 · Medium 0 · Low 1(원문 대조로 종결)    │
│  Positive deviations: 4건                            │
└──────────────────────────────────────────────────────┘
```

최초 gap-detector 산출은 26항목 중 ⚠️ 1건(photo-practice의 원문 실습 전건 커버 미검증 — 에이전트는 원문 `data/`에 접근 불가)으로 **98.1%**였으나, 같은 세션에서 오케스트레이터가 원문을 직접 전수 대조해 종결 검증했다: Ⅲ.3 구간(2880~3195행)의 실습은 시너 필터 교환·디벨로퍼 컵 교환·현상 필터 교환 **3건이 전량**이며(각 실습의 평가표로 교차 확인), "실습과제 2~5" 라벨은 원문 7,242줄 전체에 존재하지 않는다(원문 연번 체계가 1·6~10만 존재하는 불연속 — 설계 시 "1~5" 추정이 잘못된 가정이었음). → photo-practice의 3종 커버 = 전건 커버 확정, ⚠️→✅.

Match Rate = (✅26×1) / 26 = **100%**

## 1. 항목별 매트릭스 (요약)

| Design 절 | 검증 항목 | 판정 | 비고 |
|---|---|:--:|---|
| §1 | 신규 라우트/컴포넌트 0 · 코어 7개 자료원 무수정(additive-only) | ✅ | |
| §2 | Source 11필드(attribution 박기주 외 4인·publisher 에이치앤지·order 8 등) 설계값 일치, SOURCES 배열 위치 | ✅ | subtitle까지 문자열 일치 |
| §3 | 15모듈 id·title·group·RT(합 171분) 완전 일치 · 등록순서=목차순서 · href 규칙 · REGISTRY 15↔sections 15 · title 보정(#10/#15) | ✅ ×5 | |
| §4 공통 | LayeredExplain 15/15 · 학습목표 Callout 15/15 · 출처 footer 15/15(단원·중단원 표기) · 원문 이미지 0 | ✅ ×4 | |
| §4-① | 장비 일반화 특칙(#7·8·9·13·14) — 조작 패널·화면·키 시퀀스 재현 0, 모델명 사례 수준, TE8500 표기 통일('TE 8500' 0건) | ✅ ×2 | 물리 공정 순서·PM 논리만 서술 |
| §4-② | "장비 기술자의 눈" 각도 — 공정 원리 리마인더+SourceRef 압축, daegu 중복 서술 없음 | ✅ | |
| §4-③ | 유해인자 ChapterRef — ch8 4모듈·ch9 5모듈 실사용 | ✅ | |
| §4-④ | 실습 압축 #10 — 형식(대표 상세+변형표+안전 개별/통합) · **전건 커버(3/3, 원문 전수 대조 종결)** | ✅ ×2 | 최초 ⚠️ → 원문 검증으로 해소 |
| §4-④ | 실습 압축 #15 — 7종 전건 커버(⑥⑩ 상세 + 5건 표), 안전 개별 2+통합 1 | ✅ | |
| §4-⑤ | #11 etch-process 5절 구성(에칭의 언어/습식/건식·플라스마/가스별 표/파라미터) | ✅ | |
| §5 | _links.json 후보표 정합(본문 실증 — photolithography 9·etching 5·cleanroom/ppe/wafer-fab, hmds·chlorine) | ✅ | 미실증 후보 정확 제외 |
| §5 | daegu SourceRef 3+(process-overview·photo·etch) · 책 ChapterRef 2 · NCS 5섹션 실사용 | ✅ ×3 | FR-7·FR-10 초과 충족 |
| §6 | SourceRef/ChapterRef id·order 전량 실존 | ✅ | |

## 2. Gap 목록 — High/Medium 0 · Low 1(종결)

| # | 심각도 | 내용 | 조치 |
|---|:--:|---|---|
| Low-1 | Low | photo-practice(#10)의 원문 실습 전건 커버가 gap-detector 단계에서 미검증(원문이 `.gitignore` 대상이라 에이전트 접근 불가, 설계 비고도 "1~5 추정") | ✅ **종결** — 오케스트레이터가 원문 2880~3195행 전수 대조: 실습 3건이 전량, '실습과제 2~5' 라벨 원문 전체 부재 확인. 설계 §3 #10·#15 비고를 실측값으로 갱신(2026-07-17) |

## 3. Positive Deviations (설계 초과·개선)

1. **etch-practice 실습 6→7종 확장** — 배정 라벨(⑥~⑩) 밖에 물리적으로 존재하던 2건(① 장비 구성도 그리기·Upper Chamber 분해·조립)을 전건 커버 원칙으로 편입, 안전 항목 8건 추가 보존, sources.ts summary 동기화
2. **Ⅴ.2 시작 경계 5836→5806 실측 보정** — PM 개요·Daily PM 도입부 커버 유지
3. **_links.json 본문 실증 확장** — track-operation·photo-practice에 liquid-chemicals, etcher-maintenance에 gas-safety(설계 후보표에 없던 근거 기반 추가)
4. **hmds 후보 정확 제외** — track-equipment는 본문 미서술로 제외(§5 "미실증 시 제외" 규칙의 정확한 적용, hmds는 photo-process 7회 서술에만 태깅)

## 4. 동적 검증 결과 (Do 단계 게이트, gap-detector 정성 재확인 포함)

- typecheck 0 · lint 신규 경고 0 · build 233페이지 SSG(15모듈+인덱스), 기존 자료원 회귀 0
- `build:cross-link` 8 sources · 118 sections · 752 bidirectional edges · unknown 0
- `quotes.json` 회귀 0 · 렌더 스모크 15/15 · 인덱스 5트랙 · 홈 교과서 그룹 5번째 카드 · ChapterRef ch8/ch9 렌더 · cross-link 자동 연결 섹션 렌더(photo-process·etch-process·fab-cleanroom 확인)
- 저작권: 원문 이미지 0 · 근접 패러프레이즈 스캔(공백 정규화 25자) 3건 중 1건 재작성(fab-cleanroom 정의문)·2건 허용(구성명 나열), 재스캔 0건
- 장비 특칙: 조작 시퀀스 grep 패턴 15모듈 0건(gap-detector 정성 재독으로 재확인)

## 5. 판정 및 권고

**Match Rate 100% → iterate 불필요, Report 진행.**

- 매트릭스 26항목 전부 ✅ (Low-1은 원문 전수 대조로 같은 세션 내 종결).
- 시리즈 계약(콘텐츠·압축·특칙)이 3권 연속 유효 — P4~P7 권에 동일 재사용 권장.
- 다음 단계: `/pdca report hs-photo-etch`

## 참고 문서

- Plan: `docs/01-plan/features/hs-photo-etch.plan.md`
- Design: `docs/02-design/features/hs-photo-etch.design.md`
- 선례: `docs/03-analysis/hs-basic-tech-2.analysis.md`(100%) · `hs-basic-tech-1.analysis.md`(94.8%)
