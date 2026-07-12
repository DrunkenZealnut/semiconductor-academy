# Gap Analysis — ncs-semiconductor (파일럿)

| 항목 | 값 |
|------|----|
| **분석 일자** | 2026-07-12 |
| **대상 Feature** | ncs-semiconductor (NCS 반도체 학습모듈 자료원 · 파일럿 3개) |
| **Phase** | Check (PDCA) |
| **Match Rate** | **97%** |
| **권고** | ✅ report 진행 (파일럿 DoD 충족) |

---

## Executive Summary

Plan 권장안(파일럿·1자료원+4트랙·3단 레이어 재구성)대로 반도체제조 트랙 3개 모듈을 완성. 기존 multi-source 아키텍처 확장 지점(`SourceKind='standard'`·`accent 'standard'`)이 이미 갖춰져 **인프라 부담 최소**로 통합됨. FR 7/7, NFR 6/6, DoD 충족. cross-link가 NCS를 자동 발견(3 sources)하고 Photo↔책 8장(photolithography) 연결을 실증. 코어(책·OSHA) 무수정.

## FR / NFR 대조표

| ID | 명세 | 판정 | 근거 |
|----|------|:---:|------|
| FR-1 | NCS_SEMI 등록 → `/sources`·`/sources/ncs-semi` 노출 | ✅ | 홈 SourcePicker 3번째 카드(Library/slate) 자동 렌더, 인덱스 SSG |
| FR-2 | 4트랙 그룹 렌더 | ✅ | SourceSectionList group 확장, "반도체제조 · 3개" 헤더 + 그룹 그리드 실측 |
| FR-3 | 파일럿 3개 MDX + `[module]` 라우트 SSG | ✅ | `/photo-equipment`·`/quality-control`·`/productivity` 3 SSG 생성 |
| FR-4 | 3단 레이어 재구성, 원문 직역 아님 | ✅ | LayeredExplain 각 1개, Hook/Easy(비유)/Deep(원문 근거), 직무 관점. 원문 방대 절차는 눈높이 압축 |
| FR-5 | 용어·수치·표 정확성 | ✅ | 노광 광원 파장표(436∼13nm), RoHS 임계치, 수율 지표 등 원문값 재현. Term 유효 id만 |
| FR-6 | 저작권: 출처 명시 + 원문 이미지 미사용 | ✅ | ImageFigure/원문 이미지 0개(스크립트 검사), 각 모듈 하단 학습모듈 코드 출처 명시 |
| FR-7 | cross-link 책·OSHA 상호 연결 | ✅ | `_links.json` glob 자동 발견, Photo 페이지에 `/chapter/photolithography/`+OSHA 링크 노출 실측 |
| NFR-1 | 정적 export 호환 | ✅ | MDX+라우트 추가만, 신규 서버 의존 0 |
| NFR-2 | typecheck+lint+build 무오류 | ✅ | 실측: typecheck 0, build exit 0 |
| NFR-3 | quotes/cross-link 산출물 정합 | ✅ | quotes.json diff 0(NCS 스캔 대상 아님), cross-link 통제어휘 검증 통과(unknown 0, 엣지 80→90) |
| NFR-4 | 코어 무수정 | ✅ | 책·OSHA 페이지·컴포넌트 로직 0줄. SourceSectionList는 group 없으면 기존 flat(하위호환), 타입은 optional 확장 |
| NFR-5 | 재구성 품질·고등학생 가독성 | ✅ | 3단 레이어, 용어 풀이+영문 병기, OCR 손상·불필요 카탈로그 걸러냄 |
| NFR-6 | 다크모드·반응형 표 | ✅ | prose 컨테이너·table 래퍼 기존 재사용, SSR p-중첩 0 |

## 구조 확장 (코드)

| 파일 | 변경 |
|---|---|
| `types.ts` | `SourceLicense += 'ncs-open'` + 라벨 / `SourceSection.group?` optional |
| `sources.ts` | `NCS_SEMI` Source + SOURCES 등록 (order 3, accent standard) |
| `ncsMdx.tsx` (신규) | 모듈 로더 레지스트리 3개 |
| `app/sources/ncs-semi/[module]/page.tsx` (신규) | 모듈 라우트 (OSHA 복제·언어토글 제거·단순화) |
| `SourceSectionList.tsx` | group 트랙 그룹 렌더 (하위호환 — 책·OSHA는 flat) |
| `content/sources/ncs-semi/_links.json` (신규) | cross-link 태깅 3개 |
| `content/sources/ncs-semi/*.mdx` (신규 3) | 파일럿 재구성 |

## Gap 목록

| # | 심각도 | 내용 |
|---|:---:|------|
| G-1 | P2 (Minor) | 품질관리·생산성 모듈이 목표 분량(120∼180줄)을 다소 초과(191·195줄) — 원문이 학습 단위 3개를 포괄해 정본(단일 주제)보다 비례적으로 김. 정보 손실 아님 |
| G-2 | P3 (info) | 원문 OCR 손상 표(허용오차 공란·수식 깨짐)는 재현 대신 핵심값만 문장에 녹임 — 재구성 원칙상 적절, 원문 대조 시 참고 |

Critical/Major: 0건.

## 검증 실측

- typecheck 0에러, lint(기존 img warning만), `npm run build` exit 0 — `/sources/ncs-semi` + 3개 모듈 SSG
- `build:cross-link`: 3 sources 발견(epi·ncs-semi·osha), 통제어휘 unknown 0, 양방향 엣지 80→90
- `extract:quotes`: 214 그대로(NCS 스캔 비대상 — NFR-3 충족)
- Playwright: 홈 3번째 카드·트랙 그룹 헤더·3단 레이어·광원 파장표·출처 각주·cross-link(Photo→책 8장)·SSR p-중첩 0·콘솔 에러 0

## 권고

파일럿 성공 → **report 진행**. 확장 경로 확립됨: 세분류별 모듈 추가 = `{module}.mdx` 작성 + `ncsMdx` 1줄 + `sources.ts` 섹션 + `_links.json` 태깅. 후속: 반도체개발(8)·재료(4)·장비(2) 순차 확대. ⚠️ NCS 원문 재구성이므로 전문 내용은 검수 권장.
