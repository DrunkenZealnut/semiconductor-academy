# Report — 책 17챕터 학습 페이지 원문 충실 재작성

> **Feature**: `chapters-source-fidelity` · 완료일 2026-07-11 · **Match Rate 95%**
> Branch `feat/chapters-source-fidelity` (worktree `../SemiconductorAcademy-chapters-rewrite`)
> Plan → Design(작업 스펙) → Do(파일럿+병렬 15) → Check(계약 검사+게이트) 전 단계 수행

---

## Executive Summary

| 항목 | 내용 |
|------|------|
| Feature | chapters-source-fidelity (콘텐츠 심화 사이클) |
| 기간 | 2026-07-10 ∼ 07-11 (쿼터 윈도우 3회에 걸쳐 재개) |
| 결과 | **16개 챕터 재작성 완료** (3,797→7,735줄), 책 인용 91→186개, 게이트 전부 통과 |
| 변경 | MDX 16 + chapters.json + 이미지 79장(신규 17·삭제 6·재배치 다수) + credits 전량 동기화 + PDCA 문서 4 |

### Value Delivered

| 관점 | 내용 |
|------|------|
| **Problem** | 학습 페이지가 원문 대비 요약 수준(최대 3.6배 격차), 페이지 인용·이미지 캡션의 시스템적 오류 |
| **Solution** | 원문 추출본 행 단위 매핑 → 파일럿(ch12)으로 계약 검증 → 챕터별 병렬 재작성 → 3중 페이지 검사·이미지 실물 검증·정적 빌드 게이트 |
| **Function·UX Effect** | 원문의 공정 원리·작용 기전·표·역학조사 수치가 Easy(비유)/Deep(원문 인용) 이중 구조로 완전 전달. /quotes 인덱스 2.3배 확충. readingTime 실분량 반영 |
| **Core Value** | "학술서를 정확하게, 그러나 쉽게" — 요약본이 아닌 원문 충실 학습 자료로 격상. 부수적으로 기존 콘텐츠의 숨은 결함(이미지 오라벨·페이지 오기·무근거 서술) 일괄 정리 |

## 1. 수행 내역

1. **Plan/Design**: 원문 4개 추출 파일 ↔ 17챕터 행 매핑, 콘텐츠 계약(quotes 추출 스크립트 의존 구조), MDX 안전 규칙, 페이지 오프셋 공식을 스펙 문서화 — 서브에이전트가 그대로 실행 가능한 수준.
2. **파일럿(ch12)**: 직접 재작성으로 계약 검증(extract:quotes·build 통과) 후 정본 예시로 지정. 이 과정에서 이미지 캡션-실물 불일치 패턴 최초 발견 → 전 챕터 "실물 검증" 절차를 스펙에 추가.
3. **병렬 실행**: 15개 챕터 × 서브에이전트. Fable×15 2회 쿼터 전멸 후 **Sonnet 실행 + Fable(메인) 검증** 체제로 전환해 완주.
4. **검증**: 스크립트 계약 검사(페이지 3중 스캔·유효 id·금지 패턴·LE 계약) + 이미지 참조/고아/credits 정합 + extract:quotes 회귀 + typecheck/lint/정적 build. 검사기가 놓치던 `source="p.N"` 페이지 이탈(ch15 커버)도 확장 검사로 색출·수정.
5. **데이터 정리**: chapters.json readingTime 14건 갱신(round(줄/48)·비감소), hasFullBody 5∼13 true.

## 2. 알려진 한계 / 후속

- **ch17 미재작성** — 원문 미추출 (PDF 재추출 후 후속 사이클).
- **사람 검수 3건** — NH₄OH 교정(ch5), FeCl₂ 표기(ch13), SOP 핀 간격(ch13). 상세: analysis §4.
- Claude 초벌 → 발행 전 안전·보건 수치 원서 대조 권장.
- 상세 분석: `docs/03-analysis/chapters-source-fidelity.analysis.md`

## 3. 커밋/배포

- 커밋 전 상태로 사용자 확인 대기 (worktree, 83개 파일 변경).
- 메인 체크아웃의 osha-ko-part-2 미커밋 작업과 완전 분리 유지됨.
