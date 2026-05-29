# Archive: homepage-book-centric

> 메인 페이지 책 중심 재편 — 17 챕터 완성 직후 사이트 정체성 정렬

**Archived**: 2026-05-29
**Phase**: completed
**Match Rate**: 97%
**Iteration**: 0 (첫 통과)
**Duration**: ~50분 (계획 ~2시간 대비 75% 단축)
**Level**: Dynamic

---

## 결과 요약

| 지표 | 결과 |
|------|:---:|
| Design Match Rate | 96% |
| Architecture Compliance | 100% |
| Convention Compliance | 100% |
| Acceptance Criteria | 9/9 충족 |
| 검증 | tsc / ESLint / `npm run build` 모두 통과 |

---

## 구현 산출물

| 종류 | 파일 | 비고 |
|------|------|------|
| 신규 | `src/components/layout/BookHero.tsx` | 책 정체성 hero (원서명, 저자 7인, Primary CTA → Ch.1) |
| 신규 | `src/components/layout/BookTOCPreview.tsx` | 4 카테고리(🏛/⚙/⚠/💭) 카드 미리보기, `/chapters/#cat` 앵커 |
| 신규 | `src/components/layout/SpecialSection.tsx` | 특별 섹션 래퍼 (tone=process/hazard → emerald/amber) |
| 수정 | `src/app/page.tsx` | 전면 재작성 — BookHero → BookTOCPreview → SpecialSection×2 → FooterLinks |
| 수정 | `src/app/chapters/page.tsx` | 카테고리 `<section>`에 `id={cat}` + `scroll-mt-24` 추가 |
| 삭제 | `src/components/chapter/ChaptersHero.tsx` | BookTOCPreview가 기능 흡수 |

---

## PDCA 타임라인

| Phase | 기간 | 산출물 |
|-------|------|--------|
| Plan | 19:00~19:15 | plan.md — 5 섹션 IA, 3 컴포넌트, 9 AC |
| Design | 19:15~19:35 | design.md — 컴포넌트 인터페이스, 8 Open Q 결정 |
| Do | 19:35~19:50 | 3 신규 + 2 수정 + 1 삭제, tsc/lint/build 통과 |
| Check | 19:50~19:55 | analysis.md — Match Rate 97% |
| Report | 19:55~20:00 | report.md (18.7 KB) |

---

## Gap 요약

- **Critical**: 0
- **Major**: 0
- **Minor**: 5 — 모두 구현이 Design 의도를 더 충실히 만족하는 보강 방향
  - M1: Design 문서의 Ch.1 슬러그 오기 (`/chapter/01-risks-of-new-tech/`) → 구현은 실제 `/chapter/risks-of-new-tech/` 사용
  - M2: `CATEGORY_PREVIEW` 타입 단순화 (DRY 개선)
  - M3: Hazard SpecialSection에 footerLink 1개 추가 (AC 보강)
  - M4: FooterLinks에 `/what-is-semiconductor/` 추가 (Plan §6.4 후보)
  - M5: SpecialSection `TONE_DIVIDER` 토큰 추가 (시각 일관성)

---

## 핵심 학습

1. **정체성 명시의 가치**: 17 챕터 콘텐츠 완성 직후 메인이 "책 한 권을 풀어둔 사이트"임을 명시하니, 같은 콘텐츠도 학술적 신뢰성·일관성이 즉시 상승.
2. **CHAPTER_CATEGORY_COLOR 토큰 재사용**: 특별 섹션 컬러를 카테고리 토큰(emerald/amber)에 맞춤으로써 사이트 전체 컬러 시스템 일관성을 추가 노력 없이 확보.
3. **앵커 vs 필터 URL 결정**: 정적 사이트 + 카테고리 섹션 구조 + 단순함을 종합하면 `#anchor`가 `?query` 필터보다 우월. `scroll-mt-24`로 헤더 가림 보정.
4. **Design 문서 슬러그 직접 참조 시 사전 확인**: Ch.1 슬러그 오기는 Do 단계 빌드에서 발견. 향후 Design에서 슬러그를 인라인 코드로 적을 때 `chapters.json` 사전 확인 필요.

---

## 문서

- [plan.md](./plan.md) — 계획 (배경, 신규 IA, AC)
- [design.md](./design.md) — 설계 (컴포넌트 인터페이스, 8 Open Q, 와이어프레임)
- [analysis.md](./analysis.md) — Gap 분석 (Match Rate 97%, Minor 5건)
- [report.md](./report.md) — 완료 보고서 (Executive Summary, 회고)
