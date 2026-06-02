# Gap Analysis — osha-ko-part-1b

| 항목 | 값 |
|------|----|
| **분석 일자** | 2026-06-02 |
| **대상 Feature** | osha-ko-part-1b (OSHA SCS Part 1B 한글 번역 확장) |
| **Phase** | Check (PDCA) — Design skip, **Plan이 비교 기준** |
| **Match Rate** | **99%** |
| **권고** | ✅ report 진행 (≥ 90% 통과) — iterate 불필요 |
| **분석 도구** | bkit:gap-detector |

---

## Executive Summary

Plan FR-1~6 / NFR-1~6 **전 항목 충족**. 영문↔한글 섹션 8개 + 개요/요약 + 표 3개가 누락·추가 없이 1:1 대응. 안전·법규 수치 직역 정확(GHS/NFPA 역방향, 15분 세척, 470mL 기준). 코어 무수정 확장 실증 완료. **P0/P1 Gap 0건**, P2(개선 권고) 2건뿐. 번역 품질이 핵심인 사이클로서 **의미 왜곡 0건**.

---

## FR / NFR 대조표

| ID | 명세 | 상태 | 비고 |
|----|------|:---:|------|
| FR-1 | 영문과 헤딩·열거·표 구조 1:1 | ✅ | 섹션 8개 + 개요/요약, `##`/`###` 레벨·`---` 7개 완전 대응 |
| FR-2 | 표 3개 행·열 보존 변환 | ✅ | SDS 4범주(4행)·NFPA 색상(4행)·응급처치(3행) 셀 정확 |
| FR-3 | `koLoaders`에 `'part-1b'` 등록 | ✅ | `oshaMdx.tsx:16` 정확 경로 1줄 |
| FR-4 | 안전·법규 수치 직역 왜곡 0 | ✅ | GHS 1~5(1=최고)·NFPA 0~4(0=무위험)·15분·470mL·16섹션 정확 |
| FR-5 | 전문 용어 일관 + 영문 병기 | ✅ | 파일럿(1a)과 일관, 첫 등장 병기 (P2-1 미세 권고) |
| FR-6 | 토글 자동 노출 + page 무수정 | ✅ | `hasOshaScsKo('part-1b')` true, page/컴포넌트 0줄 |
| NFR-1 | 정적 export 호환, 서버 의존 0 | ✅ | MDX 추가만, `/part-1b` SSG |
| NFR-2 | typecheck+lint+build 무오류 | ✅ | 실측: typecheck 0에러, build export 성공 |
| NFR-3 | quotes/cross-link 산출물 회귀 0 | ✅ | 실측: quotes.json diff 0 (`.ko.mdx` 스캔 비대상) |
| NFR-4 | 코어 무수정 (컴포넌트/page 0줄) | ✅ | git: 변경 = part-1b.ko.mdx 신규 + oshaMdx 1줄 |
| NFR-5 | 안전 오역 0, 용어 일관, 가독성 | ✅ | 오역 0, 중·고생 수준 가독성 양호 |
| NFR-6 | 다크모드·prose 영/한 동일 | ✅ | 표준 마크다운 표 → 기존 prose 자동 적용 |

---

## 영문 ↔ 한글 섹션 1:1 대조

| 영문 | 한글 | 대응 |
|------|------|:---:|
| Course Overview / Learning Objectives (4) | 강의 개요 / 학습 목표 (4) | ✅ |
| 1. Hazardous Materials | 1. 유해물질 (핵심 질문 3개) | ✅ |
| 2. SDS (2.1 구조 / 2.2 요건) | 2. 물질안전보건자료 (16섹션·4범주·요건 6) | ✅ |
| 3. Labels (3.1/3.2/3.3) | 3. 라벨 (GHS 분류·NFPA 표·HMIS) | ✅ |
| 4. Hierarchy of Control (4.1~4.5) | 4. 유해성 통제 위계 (제거~PPE, 예시 5) | ✅ |
| 5. Safe Handling (9) | 5. 안전한 취급 관행 (9) | ✅ |
| 6. Chemical Storage (8) | 6. 화학물질 저장 (8) | ✅ |
| 7. Emergency (7.1~7.4) | 7. 비상 절차 (응급처치 표·가스·유출) | ✅ |
| 8. Hazardous Waste Disposal | 8. 유해폐기물 처리 (종류 4·요건 4) | ✅ |
| Course Summary (4) | 강의 요약 (4) | ✅ |

**누락 0 · 추가 0 · 오역 0.** `---` 구분선 7개 동일 위치.

---

## 표 3개 정합성

| 표 | 검증 |
|----|:---:|
| SDS 4범주 (§2.1) — 식별/비상·노출/특성/추가 정보 | ✅ 셀 내용 정확 |
| NFPA 색상 (§3.2) — 파랑·빨강·노랑·하양, W취소선=물 반응성·OX=산화제 | ✅ 매핑 정확 |
| 응급처치 (§7.2) — 눈/몸·화상/흡입, 15분×2 | ✅ 정확 |

---

## 안전·법규 수치 직역 정확성

| 항목 | 영문 | 한글 | 정확 |
|------|------|------|:---:|
| GHS 등급 방향 | 1=highest, 5=lowest | 1=최고, 5=최저 | ✅ |
| NFPA 등급 방향 | 0=no hazard, 4=high | 0=무위험, 4=고위험 | ✅ |
| GHS↔NFPA 역방향 | "opposite of NFPA" | "NFPA…와 반대" | ✅ |
| 세척 시간 | 15 minutes ×2 | 15분 ×2 | ✅ |
| 대량 유출 기준 | over 1 pint / 470 mL | 1파인트(470mL) 초과 | ✅ |
| cradle to grave | from cradle to grave | 요람에서 무덤까지(발생~최종 처리) | ✅ |

**안전·법규 의미 왜곡 0건** — R-1(GHS/NFPA 역방향 오역) 리스크 완전 회피.

---

## Gap 리스트 (총 2건 — 전부 P2)

> **P0 / P1: 0건.**

| ID | 우선 | 위치 | 설명 | 권장 조치 |
|----|:---:|------|------|------|
| P2-1 | P2 | `part-1b.ko.mdx` SDS 병기 | SDS 첫 등장 시 "물질안전보건자료(SDS)" 순서. 파일럿(1a)은 일부 "SDS(물질안전보건자료)" 혼용 → 양식 미세 불일치(의미 영향 0). 1a 자체도 혼용 중이라 엄격 규칙 아님 | 선택 — 후속 검수 시 일괄 정렬 (deferred) |
| P2-2 | P2 | `part-1b.ko.mdx:70` | NFPA/HMIS 한글 풀이("미국방화협회"/"위험물질 식별 시스템")를 1b에서 보강 — 영문·1a에 없던 **유익한 추가**(왜곡 아님) | 유지 권장, 후속 part에도 동일 패턴 적용 |

---

## 프로젝트 제약 — 위반 0건

| 제약 | 상태 |
|------|:---:|
| 정적 export (서버 의존 0, `/part-1b` SSG) | ✅ |
| 미러 동기화 (schema-enum / OSHA_PART_META 무관) | ✅ |
| 빌드 산출물 직접 수정 금지 (quotes/cross-link diff 0) | ✅ |
| 로더 레지스트리 등록 규약 | ✅ |
| NFR-4 코어 무수정 (LanguageToggle·page 0줄) | ✅ |

---

## 다음 단계 권장

**Match Rate 99% ≥ 90% → `/pdca report osha-ko-part-1b`** (완료 보고서 생성).

- DoD 6개 전부 충족 (1:1 구조 / 로더 등록 / 코어 0줄 / 수치 정확 / build 무오류 / Match ≥90%).
- P2 2건은 보고서 "향후 개선"에 기록만 — iterate 불필요.
- ⚠️ Claude 초벌 번역 → 안전·법규 문구 **사람 최종 검수** 권장 (Plan R-1/R-3).
- 후속: 동일 템플릿으로 `osha-ko-part-2` 확장 (Plan §8 로드맵). "MDX 1개 + 로더 1줄 = 새 언어판" 확장 비용 최소 실증.

---

## 참조

- **Plan**: `docs/01-plan/features/osha-ko-part-1b.plan.md`
- **구현**: `src/content/sources/osha-scs/part-1b.ko.mdx`(신규), `src/lib/oshaMdx.tsx`(koLoaders 1줄)
- **대조 기준**: `src/content/sources/osha-scs/part-1b.mdx`(영문), `part-1a.ko.mdx`(파일럿 톤)
