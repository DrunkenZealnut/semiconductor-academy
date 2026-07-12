# Report — NCS 반도체 학습모듈 카테고리 추가 (파일럿)

> **Feature**: `ncs-semiconductor` · **Match Rate 97%** · 2026-07-12
> Branch `feat/ncs-semiconductor` · Plan→Design→Do→Check 수행

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 국가직무능력표준(NCS) 반도체 학습모듈 17개는 직무훈련용이라 전문적 — 목표 독자인 고등학생에겐 진입 장벽이 높고, 통합할 카테고리도 없었다. |
| **Solution** | NCS를 책·OSHA와 나란한 새 자료원(`ncs-semi`)으로 추가(기존 multi-source 아키텍처 재사용) + 각 모듈을 고등학생 눈높이 3단 레이어로 재구성. 원문 이미지는 저작권상 회피, 텍스트만 재구성+출처 명시. |
| **Function·UX Effect** | 홈에 NCS 카드 자동 노출, `/sources/ncs-semi`에서 4트랙(파일럿=제조 3개) 탐색. 각 모듈은 "노광장비 셋업이 왜 까다로울까?" 식 재구성. cross-link로 책·OSHA와 자동 연결. |
| **Core Value** | 학술서(왜 위험한가)·OSHA(어떻게 안전하게)에 **NCS(현장에서 무슨 일을 하나=직무·진로)**를 더해 반도체 교육 삼각형 완성. 확장 경로 확립(모듈 추가 = MDX+로더 1줄+섹션+태깅). |

## 수행 내역

1. **Plan** — 자료 인벤토리(17모듈 4트랙), 저작권 분석, IA 3안 비교, 파일럿 우선 권장.
2. **Design** — 아키텍처 확장 지점 코드 대조(standard accent 기존재 확인), 타입·라우트·재구성 계약·cross-link 스키마 확정.
3. **Do** — 인프라(타입 확장·NCS_SEMI·ncsMdx·라우트·SourceSectionList 그룹 렌더·_links.json) + 파일럿 3개 재구성(Photo 직접 정본 → 품질·생산성 병렬 위임).
4. **Check** — Match Rate 97%, FR 7/7·NFR 6/6, 렌더 실측 통과.

## 변경 파일

- 신규: `ncsMdx.tsx`, `app/sources/ncs-semi/[module]/page.tsx`, `content/sources/ncs-semi/{photo-equipment,quality-control,productivity}.mdx`, `_links.json`, plan/design/analysis 문서
- 수정: `types.ts`(라이선스·group 확장), `sources.ts`(NCS_SEMI), `SourceSectionList.tsx`(그룹 렌더·하위호환), `cross-link.json`(재생성)

## 검증 결과

- 구조: 홈 3번째 카드·트랙 그룹 헤더·3단 레이어·광원 파장표(436∼13nm)·출처 각주 실측
- cross-link: 3 sources 자동 발견, 통제어휘 검증 통과, Photo↔책 8장(photolithography) 연결 실증(엣지 80→90)
- typecheck·lint·정적 build 무오류(3개 SSG), quotes 회귀 0, SSR p-중첩 0, 콘솔 에러 0
- 코어(책·OSHA) 무수정, 저작권(원문 이미지 0·출처 명시) 준수

## ⚠️ 발행 전 확인

Claude가 NCS 원문을 재구성한 초벌입니다. 전문 내용(수율 지표·품질 도구·노광 파라미터)은 검수를 권장합니다.

## 확장 로드맵

파일럿(제조 3)로 확장 경로 확립. 후속: **반도체개발 8 → 재료 4 → 장비 2** 순차 확대. 각 모듈 = `{module}.mdx` 재구성 + `ncsMdx` 1줄 + `sources.ts` 섹션(group) + `_links.json` 태깅. 코어 무수정 반복.

| 트랙 | 파일럿 | 남은 모듈 |
|------|:---:|:---:|
| 반도체제조 | ✅ 3/3 | — |
| 반도체개발 | — | 8 |
| 반도체재료 | — | 4 |
| 반도체장비 | — | 2 |
