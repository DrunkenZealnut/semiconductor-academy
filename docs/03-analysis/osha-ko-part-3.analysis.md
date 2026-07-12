# Gap Analysis — osha-ko-part-3

| 항목 | 값 |
|------|----|
| **분석 일자** | 2026-07-12 |
| **대상 Feature** | osha-ko-part-3 (OSHA SCS Part 3 한글 번역 확장) |
| **Phase** | Check (PDCA) — Design skip, Plan이 비교 기준 |
| **Match Rate** | **98%** |
| **권고** | ✅ report 진행 |

---

## Executive Summary

Plan FR-1~6 / NFR-1~5 충족. 영문 헤딩 35개(H2 11 + H3 24) 전부 레벨·순서 1:1 대응, 표 2개(9개 범주 개요표·노출 대응표) 셀 정합, 목록 항목 79/79 일치. 안전 수치 8개(온도·ppm·배수·%) 전수 대조 일치, 화학식 35개 전수 대조 순서·값 일치. P0/P1 Gap 0건. 코어 무수정 4번째 실증.

## FR / NFR 대조표

| ID | 명세 | 판정 | 근거 |
|----|------|:---:|------|
| FR-1 | 헤딩·목록·표 구조 1:1 | ✅ | 헤딩 35/35, 목록 79/79 (스크립트 대조) |
| FR-2 | 표 2개 셀 정확 변환 | ✅ | 9범주 개요표·노출 대응표 셀 전수 확인 |
| FR-3 | `koLoaders` `'part-3'` 등록 | ✅ | `oshaMdx.tsx` 1줄 추가, 렌더 실측(토글 노출) |
| FR-4 | 안전 수치 직역 왜곡 0 | ✅ | 100°F/38°C·5ppm/2.5ppm·9배(TNT)·25%·2%·100% 전수 일치 |
| FR-5 | 화학물질명 일관 | ✅ | `chemicals.json` 기존 9종(아르신·디보레인·실란·포스핀·암모니아·염소·불소·오존·황산 등) 표기 재사용, 신규 26종은 원문 구조(정식명+약칭) 유지. 화학식 35개 전수 대조 일치 |
| FR-6 | 토글 자동 노출 + page 무수정 | ✅ | Playwright 실측: 토글 클릭 시 한글 렌더, `git diff` page/컴포넌트 0줄 |
| NFR-1 | 정적 export 호환 | ✅ | MDX 추가만 |
| NFR-2 | typecheck+build 무오류 | ✅ | 실측 |
| NFR-3 | quotes/cross-link 회귀 0 | ✅ | 실측: `quotes.json` diff 0, `cross-link.json` generatedAt만 변경 |
| NFR-4 | 코어 무수정 | ✅ | `oshaMdx.tsx` 1줄 외 컴포넌트·page 0줄 |
| NFR-5 | 번역 품질 | ⚠️ | 실란 폭발 기전·비상 대응 문구 검증됨. Minor 1건(G-1) |

## 구조 대조 (스크립트 실측)

- 헤딩: EN 35 / KO 35, 레벨·순서 전부 일치
- 표: EN 2 / KO 2 (헤더+구분선 블록 기준)
- 목록 항목(불릿+번호): EN 79 / KO 79
- 안전 수치 8개: `100°F, 38°C, 5ppm, 2.5ppm, 9배, 25%, 2%, 100%` — EN/KO 순서·값 완전 일치
- 화학식 35개(원소기호 패턴 괄호): EN/KO 순서·값 완전 일치 (AsH₃, B₂H₆, GeH₄ ×2, H₂Se, H₂S, PH₃ ×2, NH₃, BCl₃, HBr, HCl ×2, WF₆, Cl₂, ClF₃, F₂, NO, NO₂, O₃, SiH₄, Si₂H₆, C₂H₂, CO, H₂, CH₄, C₃H₈, DEZ, TMA, TMG, TMI, HF, H₂SO₄, HNO₃, H₃PO₄)

## Gap 목록

| # | 심각도 | 내용 |
|---|:---:|------|
| G-1 | P2 (Minor) | Germane(저메인)·Organometallics(유기금속) 등 일부 학술 병기 용어는 영문 원어 미병기 (Part 2의 TMAH·PGMEA 같은 필수 약어 병기 관례와 달리, 이 Part는 화학물질명 자체가 이미 화학식으로 병기되어 있어 실질적 정보 손실 없음) |

Critical/Major: 0건.

## 검증 실측

- `npm run typecheck`: 0 에러
- `npm run build`: 정적 export 성공, `/sources/osha-scs/part-3` SSG 포함
- `quotes.json`: diff 0 (영문 part-3.mdx만 스캔, 변경 없음 확인)
- `cross-link.json`: `generatedAt` 타임스탬프만 변경(재실행 시 자동 갱신, 콘텐츠 diff 0)
- Playwright 렌더 실측: 언어 토글 자동 노출·클릭 시 한글 전환·SSR HTML p-태그 중첩 0·콘솔 에러 0

## 권고

Match Rate 98% ≥ 90% → **report 진행**. Claude 초벌 번역이므로 발행 전 안전 수치·화학물질 표기 사람 검수 권장(특히 실란 폭발 기전 §5, 비상 대응 §Emergency Response).
