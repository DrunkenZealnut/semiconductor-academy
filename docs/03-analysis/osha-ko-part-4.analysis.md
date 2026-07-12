# Gap Analysis — osha-ko-part-4

| 항목 | 값 |
|------|----|
| **분석 일자** | 2026-07-12 |
| **대상 Feature** | osha-ko-part-4 (OSHA SCS Part 4 한글 번역 확장 — 완주) |
| **Phase** | Check (PDCA) — Design skip, Plan이 비교 기준 |
| **Match Rate** | **98%** |
| **권고** | ✅ report 진행 |

---

## Executive Summary

Plan FR-1~6 / NFR-1~5 충족. 영문 헤딩 23개 전부 레벨·순서 1:1 대응, 표 4개 셀 정합, 목록 항목 51/51 일치. 안전 수치 전수 대조 일치 — 극저온 팽창 수치(160/230/700/161,000)의 내적 정합성(230×700=161,000)도 유지됨을 계산 확인. 화학식 3개 전수 일치. 가스 범주 7종 명칭 Part 3과 완전 재사용. P0/P1 Gap 0건. 코어 무수정 5번째(최종) 실증.

## FR / NFR 대조표

| ID | 명세 | 판정 | 근거 |
|----|------|:---:|------|
| FR-1 | 헤딩·목록·표 구조 1:1 | ✅ | 헤딩 23/23, 목록 51/51 (스크립트 대조) |
| FR-2 | 표 4개 셀 정확 변환 | ✅ | 산소 결핍·물리적 유해성·NFPA 등급·12단계 통제 시스템 전수 확인 |
| FR-3 | `koLoaders` `'part-4'` 등록 | ✅ | `oshaMdx.tsx` 1줄 추가, 렌더 실측(토글 노출) |
| FR-4 | 안전 수치 직역 왜곡 0 | ✅ | 산소 농도 4구간·700배·160∼230리터·161,000리터·PSI 2건·NFPA 0∼4 전수 일치. 230×700=161,000 산술 정합 확인 |
| FR-5 | 가스 범주 7종 Part 3 재사용 | ✅ | 인화성·자연발화성·산화성·부식성·독성 수소화물·고에너지 물질(유기금속) — Part 3과 문자열 완전 동일 |
| FR-6 | 토글 자동 노출 + page 무수정 | ✅ | Playwright 실측: 토글 클릭 시 한글 렌더, page/컴포넌트 0줄 변경 |
| NFR-1 | 정적 export 호환 | ✅ | MDX 추가만 |
| NFR-2 | typecheck+build 무오류 | ✅ | 실측 |
| NFR-3 | quotes/cross-link 회귀 0 | ✅ | `quotes.json` diff 0(완전 무변화), `cross-link.json` generatedAt만 변경 |
| NFR-4 | 코어 무수정 | ✅ | `oshaMdx.tsx` 1줄 외 0줄 |
| NFR-5 | 번역 품질 | ✅ | 극저온·EMO·NFPA 절차 검증됨 |

## 구조 대조 (스크립트 실측)

- 헤딩: EN 23 / KO 23, 레벨·순서 전부 일치
- 표: EN 4 / KO 4
- 목록 항목: EN 51 / KO 51
- 안전 수치: 23.5%, 19.5%×2, 10%×2, 6%×2(산소), 1/700/160/230/161,000(리터, 극저온), 2,000/100(PSI), 0∼4(NFPA) — 전수 일치, 160 값도 직접 grep으로 재확인
- 화학식 3개(N₂, Ar, SF₆): EN/KO 순서·값 완전 일치

## Gap 목록

Critical/Major/Minor: 0건. 이전 Part(2·3)에서 발견된 "학술 용어 영문 미병기" 패턴도 이번 Part 4에서는 재발하지 않음(NFPA·EMO·RFO·MAQ 등 전 약어에 최초 등장 시 한글 풀이 + 영문 병기 적용).

## 검증 실측

- `npm run typecheck`: 0 에러
- `npm run build`: 정적 export 성공, `/sources/osha-scs/part-4` SSG 포함
- `quotes.json`: diff 0 (완전 무변화)
- `cross-link.json`: `generatedAt` 타임스탬프만 변경
- Playwright 렌더 실측: 언어 토글 자동 노출·클릭 시 한글 전환(강의 개요·극저온·161,000리터·EMO·NFPA·"마무리됩니다" 전부 확인)·SSR HTML p-태그 중첩 0·콘솔 에러 0

## 권고

Match Rate 98% ≥ 90% → **report 진행**. Claude 초벌 번역이므로 발행 전 안전 수치(극저온 열팽창·실린더 압력) 사람 검수 권장. 이로써 **OSHA SCS 5 Part 한글화가 완주**됨.
