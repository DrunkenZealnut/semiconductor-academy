# Report — OSHA SCS Part 3 한글 번역 확장

> **Feature**: `osha-ko-part-3` · **Match Rate 98%** · 2026-07-12

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | OSHA SCS Part 3(극도로 위험한 화학물질 9개 범주, 실란 폭발 위험, 비상 대응)이 영문 전용이었다. |
| **Solution** | 검증된 토글 메커니즘 + Part 2 템플릿 재사용. `part-3.ko.mdx` 신규(영문 234줄 1:1) + `koLoaders` 1줄. |
| **Function·UX Effect** | `/sources/osha-scs/part-3` 토글 자동 노출, 9개 화학물질 범주·실란 폭발 기전(TNT 9배 에너지)·비상 대응 절차 한글 렌더. |
| **Core Value** | OSHA 5 Part 중 4개(1A/1B/2/3) 한글화 완료. "MDX 1개 + 로더 1줄" 확장 패턴 4번째 실증. |

## 변경 파일

- 신규: `src/content/sources/osha-scs/part-3.ko.mdx` (235줄)
- 수정: `src/lib/oshaMdx.tsx` (+1줄, `koLoaders['part-3']`)
- 문서: `docs/01-plan/features/osha-ko-part-3.plan.md`, `docs/03-analysis/osha-ko-part-3.analysis.md`

## 검증 결과

- 구조 1:1: 헤딩 35/35, 표 2/2, 목록 항목 79/79 (스크립트 대조)
- 안전 수치 8개 전수 일치: 100°F/38°C(디보레인), 5ppm/2.5ppm(오존 IDLH), TNT 9배(실란 폭발), LEL 25%(경보), 2%(고에너지 물질), 100%(공정 효율)
- 화학식 35개 전수 일치 (아르신·디보레인·실란 등)
- typecheck 0에러, 정적 build 성공(`/part-3` SSG), `quotes.json` diff 0, `cross-link.json` generatedAt만 변경
- Playwright 렌더 실측: 토글 자동 노출·한글 전환·SSR 무결성·콘솔 에러 0 확인
- Critical/Major 0, Minor 1(G-1, 일부 학술 용어 영문 미병기 — 화학식으로 이미 명확해 실질 손실 없음)

## ⚠️ 발행 전 확인

Claude 초벌 번역입니다. 실란 폭발 기전(§5)과 비상 대응 절차(Emergency Response)는 인명 안전과 직결되므로 발행 전 사람 검수를 권장합니다.

## 후속

OSHA 5 Part 중 남은 Part 4(가스 시스템·저온 실린더·비상 절차)로 한글화를 완주할 수 있습니다.
