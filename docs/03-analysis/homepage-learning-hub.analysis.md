# Gap Analysis — 메인페이지 멀티소스 학습 허브 재구성

> **Feature**: `homepage-learning-hub` · **분석일**: 2026-07-14 · **분석**: gap-detector Agent
> Design: `docs/02-design/features/homepage-learning-hub.design.md` · Plan: `docs/01-plan/features/homepage-learning-hub.plan.md`
> 브랜치: `feat/homepage-learning-hub`

---

## Match Rate: **98%** ✅ (기준 90% 이상 — Act 불필요)

| 검증 항목 | 가중치 | 점수 | 근거 |
|---|:---:|:---:|---|
| §1 홈 6섹션 순서 | 10% | 100% | page.tsx 렌더 순서 = Design 순서 완전 일치 |
| §2 PlatformHero 계약 | 18% | 100% | 아이콘·eyebrow·h1 2줄·서브·CTA 2·파생 N 전 항목 일치 |
| §3 SourcePicker | 15% | 100% | id/scroll-mt/PERSPECTIVE 4항목/graceful/순서 무변경 |
| §4 LearningPathSection | 15% | 100% | 4단계 데이터·accent 재사용·그리드·화살표·`<ol>` 시맨틱 |
| §5 전역 메타·네비·푸터 | 18% | 100% | seo/metadata/Header/Footer/FooterLinks 전부 일치 |
| §6 삭제 + 잔여 참조 | 8% | 100% | 2파일 삭제, grep 참조 0건 (source·build 양쪽) |
| Plan FR/NFR | 10% | 95% | FR 1~7 충족(FR-6 책 접근 3경로 확보), 실행검증은 메인 세션에서 별도 수행 |
| §7 검증 계획 이행 | 6% | 90% | 빌드 산출물 렌더·구 문구 sweep 0건 확인 |

## Gap 목록 및 처리 현황

| # | 심각도 | 내용 | 처리 |
|:-:|:---:|---|---|
| 1 | info | `page.tsx` metadata description의 "116" 하드코딩 (히어로는 파생인데 메타만 상수) | ✅ **수정 완료** — `TOTAL_UNITS` 파생값으로 교체, 재빌드로 렌더 확인 |
| 2 | info | Design §7·Plan DoD의 "216페이지" 수치 오기 (실측 174) | ✅ 두 문서 정정 완료 |
| 3 | info | 문구 미세 차이("비교하며"→"비교하면서" 등 4건) | 의미 동일 — 조치 불필요 |
| 4 | observe | `about/page.mdx`에 "유해인자를 누구나" 계열 문구 잔존 | **Design 범위 밖**(홈·레이아웃·메타 한정) — 플랫폼 아이덴티티를 about까지 확장할지는 후속 사이클 판단 |
| 5 | info | 에이전트 실행 미검증 항목(typecheck·build·diff) | ✅ 메인 세션에서 기실행 — typecheck/lint/build 무오류, 174/174 SSG, git diff로 홈·레이아웃·메타 8파일 한정 확인 |

## 잘 된 점

- **하드코딩 금지 규약**: 학습 단위 수를 `SOURCES.reduce`로 파생 — 코드 실측(84+17+5+10=116)과 렌더 일치. Gap #1 수정으로 메타까지 일관.
- **DRY 재사용**: `SOURCE_ACCENT_BORDER`를 SourcePicker·LearningPath 공용 — 새 색 정의 0.
- **접근성·시맨틱**: `<ol>` 학습 동선, `aria-labelledby`, section landmark, graceful 뱃지 처리.
- **삭제 완결성**: 구 컴포넌트 2종 + 구 문구가 소스·빌드 산출물 양쪽에서 0건.
- **순 -170줄**: 기능 추가하면서 코드는 줄어든 재구성 (31 추가 / 201 삭제).

## 결론

Match Rate 98% ≥ 90% — **iterate 불필요, Report 진행 가능**. info 갭 2건은 분석 직후 수정·재빌드 검증 완료. observe 1건(about 페이지 문구)은 범위 밖으로 후속 판단.
