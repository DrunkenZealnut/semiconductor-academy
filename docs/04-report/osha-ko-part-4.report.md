# Report — OSHA SCS Part 4 한글 번역 확장 (완주)

> **Feature**: `osha-ko-part-4` · **Match Rate 98%** · 2026-07-12

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | OSHA SCS Part 4(극저온 실린더, 압축가스 위험, NFPA 등급, 12단계 가스 통제 시스템, EMO 비상 절차) — SCS 커리큘럼의 마지막 강의가 영문 전용이었다. |
| **Solution** | 검증된 토글 메커니즘 + Part 3 템플릿 재사용. `part-4.ko.mdx` 신규(영문 182줄 1:1) + `koLoaders` 1줄. |
| **Function·UX Effect** | `/sources/osha-scs/part-4` 토글 자동 노출, 극저온 열팽창(액체질소 1L→700L, 최대 161,000L 방출)·NFPA 등급·12단계 통제 시스템·EMO 절차 한글 렌더. |
| **Core Value** | **OSHA SCS 5 Part(1A/1B/2/3/4) 한글화 완주.** 반도체 화학물질 안전 교육 전 과정을 모국어로 제공. |

## 변경 파일

- 신규: `src/content/sources/osha-scs/part-4.ko.mdx` (183줄)
- 수정: `src/lib/oshaMdx.tsx` (+1줄, `koLoaders['part-4']`)
- 문서: `docs/01-plan/features/osha-ko-part-4.plan.md`, `docs/03-analysis/osha-ko-part-4.analysis.md`

## 검증 결과

- 구조 1:1: 헤딩 23/23, 표 4/4, 목록 항목 51/51 (스크립트 대조)
- 안전 수치 전수 일치: 산소 결핍 4구간, 액체질소 팽창계수 700배, 듀어 용량 160∼230리터, 최대 방출 161,000리터(230×700 산술 정합 확인), 실린더 압력 2,000/100 PSI, NFPA 0∼4등급
- 화학식 3개 전수 일치 (N₂, Ar, SF₆)
- 가스 범주 7종을 Part 3과 문자열 완전 동일하게 재사용(용어 일관성)
- typecheck 0에러, 정적 build 성공(`/part-4` SSG), `quotes.json` diff 0(완전 무변화), `cross-link.json` generatedAt만 변경
- Playwright 렌더 실측: 토글 자동 노출·한글 전환·SSR 무결성·콘솔 에러 0 확인
- Critical/Major/Minor 0건 — 이전 Part에서 나온 "학술 용어 영문 미병기" 패턴도 재발 없음

## ⚠️ 발행 전 확인

Claude 초벌 번역입니다. 극저온 액체(듀어) 취급과 압축가스 실린더 물리적 위험은 인명 안전과 직결되므로 발행 전 사람 검수를 권장합니다.

## 완주 요약

| Part | 제목 | 상태 |
|------|------|:---:|
| 1A | Introduction to GHS | ✅ |
| 1B | Communication, Controls, and Emergency Procedures | ✅ |
| 2 | Chemical Hazards, Controls, and Emergency Actions | ✅ |
| 3 | Extremely Hazardous Chemicals | ✅ |
| 4 | Hazardous Gas Systems and Controls | ✅ |

OSHA Semiconductor Chemical Safety 5개 Part 전체가 한글화됐습니다. 신규 자료원이 추가되지 않는 한 후속 번역 확장 사이클은 없습니다.
