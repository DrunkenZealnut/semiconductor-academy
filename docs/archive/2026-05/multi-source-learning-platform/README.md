# Archive: multi-source-learning-platform

> 단일 책 사이트 → 다중 자료원 학습 플랫폼 재편의 **1단계** (Phase A+B). OSHA SCS 5 Part 통합 완료. Phase C(cross-link)는 별 cycle로 분리.

**Archived**: 2026-05-30
**Phase**: completed (Phase A + Phase B)
**Match Rate**: 96% (Phase A+B 분모 한정)
**Iteration**: 0 (첫 통과)
**Duration**: ~3시간 (Plan → Report)
**Level**: Dynamic
**Branch**: `feat/multi-source-learning-platform`
**Commit**: `acd234e`

---

## 결과 요약

| 지표 | 결과 |
|------|:---:|
| Design Match Rate (Phase A+B) | 96% |
| FR coverage | 6/6 ✅ |
| Architecture decisions 반영 | 6/6 ✅ |
| Convention Compliance | 100% |
| Critical / Major / Minor | 0 / 0 / 4 |
| typecheck / build | 모두 통과 (무경고) |
| 기존 URL 회귀 | 0건 (17 챕터 100% 호환) |

---

## 구현 산출물

### Phase A — IA 재편

| 종류 | 파일 | 비고 |
|------|------|------|
| 수정 | `src/lib/types.ts` (+75) | `Source`, `SourceSection`, `SourceKind`, `SourceLanguage`, `SourceLicense` + 라벨 enum |
| 신규 | `src/lib/sources.ts` (109줄) | `EPI_BOOK` + `OSHA_SCS` 레지스트리, `chapterToSection` 어댑터 |
| 신규 | `src/components/sources/SourceBadge.tsx` | lang/kind/license/all 4 variants |
| 신규 | `src/components/sources/SourcePicker.tsx` | 메인 페이지 자료원 카드 (책+OSHA, accent별 색상) |
| 신규 | `src/components/sources/SourceHeader.tsx` | source index 헤더 (breadcrumb + meta) |
| 신규 | `src/components/sources/SourceSectionList.tsx` | section 카드 그리드 |
| 신규 | `src/app/sources/[source]/page.tsx` | Source Index 라우트 (2 prerendered) |
| 수정 | `src/app/page.tsx` (+3) | `<SourcePicker />` BookHero 직후 삽입 |

### Phase B — OSHA 5 Part 통합

| 종류 | 파일 | 비고 |
|------|------|------|
| 신규 | `src/content/sources/osha-scs/part-1a.mdx` | Introduction to GHS (264줄) |
| 신규 | `src/content/sources/osha-scs/part-1b.mdx` | Communication, Controls, Emergency (228줄) |
| 신규 | `src/content/sources/osha-scs/part-2.mdx` | Chemical Hazards, Controls (324줄) |
| 신규 | `src/content/sources/osha-scs/part-3.mdx` | Extremely Hazardous Chemicals (234줄) |
| 신규 | `src/content/sources/osha-scs/part-4.mdx` | Hazardous Gas Systems (181줄) |
| 신규 | `src/lib/oshaMdx.tsx` | 5 Part dynamic import 로더 |
| 신규 | `src/app/sources/osha-scs/[part]/page.tsx` | OSHA Part 동적 라우트 (5 prerendered) + Prev/Next + 라이선스 푸터 |

### Phase C — 분리 (별 cycle 예정)

- `cross-link-system` cycle에서 처리: schema.ts, _links.json, build-cross-link-index.mjs, RelatedFromOtherSources, ChemicalSourceHub, 검색 source 필터

### 합계

- 신규: 13 파일 / 수정: 2 파일 / 총 변경량: **+3,232 / -8 (19 files)**
- 신규 prerendered routes: 7

---

## PDCA 타임라인

| Phase | 산출물 |
|-------|--------|
| **Plan** | plan.md — 3 Phase 구성 (A: IA / B: OSHA / C: cross-link), 10 FR, sub-PDCA 분할 옵션 명시 |
| **Design** | design.md — Source 모델 인터페이스, 통제 어휘 enum 결정, 빌드 인덱스 결정, mockup 5개 |
| **Do** | Phase A (Source 모델 + 4 컴포넌트 + 1 라우트) → Phase B (5 MDX + 로더 + 1 라우트) 순차 진행 |
| **Check** | analysis.md — gap-detector 96% (Phase A+B scope), Critical/Major 0 |
| **Report** | report.md (19,911 bytes) — Executive Summary 3개 표, 학습 포인트 5가지 |
| **Archive** | 본 폴더 |

---

## 핵심 학습

1. **Phase split (scope split)** — Plan/Design에서 사전 옵션 제시 + Do 도중 사용자가 선택한 패턴. 큰 작업의 검증 주기 단축, scope creep 방지에 효과적. Phase A+B만 1 cycle, Phase C는 별 cycle로 분리.
2. **OSHA transcript 재활용** — 이미 markdown으로 정리되어 있어 `tail -n +7` 한 줄로 5 MDX 변환 완료. 자료 사전 정리의 가치.
3. **디자인 토큰 100% 재사용** — 직전 PDCA `homepage-book-centric`의 카드 패턴 그대로 활용. 신규 Tailwind 토큰 0개, 디자인 일관성 + 속도 모두 확보.
4. **하위호환 우선 원칙** — `chapterToSection` 어댑터가 `legacyUrl ?? /chapter/${slug}/` 우선 사용. 정체성 변경 PDCA에서도 17 챕터 URL이 하나도 깨지지 않음.
5. **gap-detector scope 명시** — 부분 구현 평가 시 prompt에 "Phase C는 의도적 deferral" 명시 → false negative 회피. agent 호출 시 scope를 명확히 전달하는 것이 critical.

---

## Minor 4건 (후속 처리 가능)

본 cycle에서는 처리하지 않았으나 cross-link cycle 또는 polish에서 통합 가능:

1. `EPI_BOOK.year: 2021` — 실제 책 발행연도 재확인 후 보정
2. `OSHA_SCS.url: 'https://www.osha.gov/'` — SCS 공식 deep link로 교체
3. OSHA Part 헤더의 "transcript 안내문" 위치 (헤더 vs 푸터)
4. `OshaCallouts` MDX 컴포넌트 도입 여부 (현재는 일반 `### Learning Objectives` 헤딩 처리)

---

## 신규 라우트

- `/sources/epi-semi-hazards` — 책 17 챕터 인덱스
- `/sources/osha-scs` — OSHA SCS 5 Part 인덱스
- `/sources/osha-scs/part-1a` — Introduction to GHS
- `/sources/osha-scs/part-1b` — Communication, Controls, Emergency
- `/sources/osha-scs/part-2` — Chemical Hazards, Controls
- `/sources/osha-scs/part-3` — Extremely Hazardous Chemicals (silane 등)
- `/sources/osha-scs/part-4` — Hazardous Gas Systems

---

## 다음 cycle 상속점

`cross-link-system` cycle에서 본 cycle의 다음을 그대로 상속:

- Plan §3.1 FR-04 ~ FR-08 (topic/hazard/chemical 3축, RelatedFromOtherSources, ChemicalSourceHub, 빌드 인덱스, source 필터)
- Design §3.1.2 Cross-link Schema (Topic/Hazard enum 22+12)
- Design §6.2 cross-link 저장소 결정 (빌드 인덱스)
- Design §11.2 step 12 ~ 21 (Phase C 구현 순서)

---

## 참고

- 원본 책: 「반도체 산업의 유해인자」 윤충식 외 6인 공저, 에피스테메
- OSHA 원본: U.S. OSHA Semiconductor Chemical Safety Part 1A/1B/2/3/4 (U.S. Government Work · Public Domain)
- Archive 시점: 2026-05-30
