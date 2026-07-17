# Gap 분석 — hs-assembly-inspection (Check)

> **Feature**: `hs-assembly-inspection` · **분석일**: 2026-07-17 · **분석자**: gap-detector Agent(12모듈 5배치 원문 전수 대조) + 오케스트레이터 게이트 재실행·종결 검증
> **기준**: `docs/archive/2026-07/hs-assembly-inspection/design.md` §1~7
> **구현**: `src/lib/sources.ts`(HS_ASSEMBLY_INSPECTION) · `src/lib/schoolTextMdx.tsx` · `src/content/sources/hs-assembly-inspection/`(MDX 12 + `_links.json`) · `src/data/cross-link.json`

## 결과 요약

```text
┌──────────────────────────────────────────────────────────────┐
│  Design Match Rate: 100%  (raw 98.6% → 맥락 종결)  기준 90% ✅ │
├──────────────────────────────────────────────────────────────┤
│  검증 항목 37 (A5·B7·C11·D11·E3) · ✅ 36 · ⚠️ 1(종결) · ❌ 0  │
│  Gap: High 0 · Medium 0 · Low 1(무수정 승인)                 │
│  원문 대조: 12모듈 전량 일치 · 실습과제 원문 13→MDX 13(누락 0)│
│  Positive deviations: 6건 · 설계 지연(구현이 더 나감): 4건    │
└──────────────────────────────────────────────────────────────┘
```

원문(`data/school-text/20260415_182247_반도체조립검사_에이치앤지_/…​.md`, 5,662줄)은 `/data/` gitignore로 Glob `**`에 미표출 — **절대경로 Read로 전수 대조 수행**(12모듈 5배치 병렬). 시리즈 후속 권 Check도 동일 접근.

최초 gap-detector 산출은 37항목 중 ⚠️ 1건(C1b 모델명 빈도 — diebond-equipment 4회로 "모듈당 2~3회 이내" 경미 초과)으로 **98.6%**였으나, 오케스트레이터가 같은 세션에서 종결 검증했다:

- **4회 분해**: SL9022(:62)·CM-700(:74)·UDC 300(:87-88, 줄바꿈 분리 표기 — 단일라인 grep 미검출 확인)·SL9002(:101) — **서로 다른 4개 모델 각 1회, 반복 0**.
- **설계 명시 승인**: §3 #7이 이 모듈에 "SL9002/SL9022·CM-700은 사례"로, §4-1이 승인 모델 목록(DAD640·SL9002/SL9022·CM-700·**UDC 300**)으로 4종 전부를 지정. 다이 본더 200/300mm 2변형 + 에폭시 디스펜서 2계통을 각 대표 모델로 1회씩 예시한 구성 — 특칙의 의도("단일 모델 매뉴얼식 반복 방지")는 완전 충족.
- **선례 정합**: P3(NSR 4회 ✅)·P4(P-5000 4회 → 맥락 종결 ✅)와 동궤이며 근거는 이번이 가장 명확.

→ 무수정 승인, ⚠️→✅. Match Rate = ✅37 / 37 = **100%**

## 1. 항목별 매트릭스 (요약)

| Design 절 | 검증 항목 | 판정 | 비고 |
|---|---|:--:|---|
| §2 A | Source 11필드(id/kind/ko/title/subtitle 자구 일치/attribution 김경원 외 3인/publisher 에이치앤지/fair-use/order 10/school/hs-textbook) | ✅ ×3 | sources.ts:1509-1520 |
| §2 A | sections 12개 §3 정순(RT 11/6/9/11/13/6/9/11/9/11/15/12 합 **123**) · 특칙 경고 주석 | ✅ ×2 | sources.ts:1500-1618 |
| §3 B | 12 MDX 존재 · REGISTRY 12 로더 정순 · id/title/group 6트랙 일치 · 신규 코드 파일 0(2파일 수정만) | ✅ ×4 | schoolTextMdx.tsx:94-119 |
| §3 B | LayeredExplain 12/12(hook+easy+deep 36 props) · 원문 라인 범위 12모듈 전량 커버 · 범위 밖 혼입 0 | ✅ ×3 | 5배치 원문 대조 |
| §4-1 C | 조작 시퀀스 재현 0(원문 F5/F1/Enter/DATA-IN/누른다×20 밀집 구간 전량 논리 추상화) · 장비 유형 4종 일반화 축 | ✅ ×2 | "누른다" 잔존 3건은 hook 수사·일반화 문장·구조 부품 서술 |
| §4-1 C | **모델명 빈도(맥락 종결)** — 5모듈 각 1회, diebond-equipment 4회(상이 4종 각 1회) | ✅ | 최초 ⚠️ → 상단 분해 검증으로 해소 |
| §4-2 C | 실습과제 원위치 재구성 원문 13→MDX 13 누락 0 · 안전 warning Callout 6모듈 전건 매핑 · 조작↔실습 SourceRef 상호(#4↔#5, #8↔#9, #11→#10) | ✅ ×3 | §2 대조표 |
| §4-3 C | "움직이는 기계의 안전"(회전·협착·절단·레이저) Ⅱ~Ⅵ 관통 — 78건/9모듈 | ✅ | 쏘잉 41·파티클 레이저 24·프로브 6·검사 3·다이본딩 협착 2 |
| §4-4·5 C | ChapterRef(13) 에폭시·EMC·몰딩·솔더 흄 대목 · `/process/` 직접 링크 미도입 · packaging topic 경유 | ✅ ×3 | packaging-overview:131 · diebond-operation:94(감작성) |
| §4-6 C | OCR 오식 5종 MDX 잔존 0(원문 "조랍" 3143 → "조립" 교정 확인) | ✅ | 실제 교정 10+종(§4 초과분) |
| §5 D | _links.json 후보표 12/12 정합(packaging×11·cleanroom×1·engineering-controls×5) · epoxy-resin 3모듈 정확(#6 process 0회 제외 포함) | ✅ ×2 | |
| §5 D | 직접 연결 7행 전수(파일럿 ChapterRef+daegu+ncs / 쏘잉·다이본딩 ChapterRef / inspection ncs×2 / probe ncs+같은 소스 / particle P3 권 간+ncs) | ✅ ×7 | 각 file:line 실측 |
| §5 D | FR-7 ChapterRef 3+ → **5건** · FR-10 권 외 SourceRef 5+ → NCS 4종+P3+daegu · cross-link.json forward/reverse 33회·byChemical epoxy-resin↔책 ch13 | ✅ ×2 | cross-link.json:449-474, 2379-2389 |
| E | footer 템플릿 12/12 · 원문 이미지 0 · 직접 복사 0(전량 패러프레이즈) | ✅ ×3 | |

## 2. 원문 실습과제 커버리지 대조표 (gap-detector 원문 직접 전수)

| 모듈 | 원문 워크시트(행) | 원문 N | MDX 반영 | 안전 Callout | 판정 |
|---|---|:--:|:--:|:--:|:--:|
| sawing-operation | 테이프 마운트(1054)·쏘잉 작업(1117) | 2 | 2 (:151·:163) | 보존 | ✅ |
| sawing-practice | 블레이드 교체(2093)·척 테이블 분해·조립(2160) | 2 | 2 (표 :145-146) | 보존 | ✅ |
| diebond-operation | 다이 본딩 작업(2917) | 1 | 1 (:107) | 6항 보존 | ✅ |
| diebond-practice | UDC 300 분해·조립(3143, 원문 "조랍") | 1 | 1 (:59, 교정) | 5항 보존 | ✅ |
| probe-test | 프로브 셋업(4573)·테스터 초기화(4631)·웨이퍼 테스트(4684) | 3 | 3 (표+:180 대표) | 4항 보존 | ✅ |
| particle-counter | 파티클 측정(5096)·맵핑 센서(5156)·프로그램(5198)·레이저 교체(5303) | 4 | 4 (:193 대표+표) | 6항 보존 | ✅ |
| **합계** | | **13** | **13** | 전 모듈 | **누락 0** |

특기: particle-counter 원문 워크시트 2·4번은 제목이 OCR 도판 페이지로 소실됐으나 실습방법·평가 역추적으로 원문 실제 **4건** 확정 — 설계 §3 1차 추정(2건)보다 구현이 원문에 정확(설계 위임 조항 "전수는 담당 배치가 확정·보고" 이행).

## 3. Gap 목록 — High 0 · Medium 0 · Low 1(종결)

| # | 심각도 | 내용 | 조치 |
|---|:--:|---|---|
| Low-1 | Low | C1b 모델명 빈도 — diebond-equipment 4회로 "모듈당 2~3회 이내" 경미 초과 | ✅ **종결(무수정 승인)** — 상이 4종 각 1회·반복 0, 설계 §3 #7·§4-1이 4종 전부 명시 승인, P3·P4 선례 동궤(결과 요약 참조) |

❌ 없음.

## 4. Positive Deviations (설계 초과·개선) — 6건

1. **실습과제 전수 정확화** — 설계 1차 11건 → 원문 ground truth 13건 확정·전량 반영(particle 2→4).
2. **OCR 교정 확대** — 지정 5종 외 Universion→Universal·메가진→매거진·블러시→브러시·트웨이저→트위저·Proebr/Tster 등 10+종.
3. **레이저 안전 보강** — particle-counter에 눈·피부 위험, 인터록 해제 숙련자 한정 논리를 근거 있게 확장(:181-189).
4. **조작 시퀀스 밀집 구간 완전 추상화** — probe-test 원문 누른다×20·DATA-IN×10·Password·Unix init 0 전량 논리 재작성(보안·저작권 동시 방어).
5. **근접 패러프레이즈 회피** — inspection-overview가 원문 학생 비유(수박·계란·선수교체)를 자체 비유(자동차 부품↔완성차)로 대체.
6. **FR-10 대폭 초과** — NCS 4종(8참조)+P3 fab-cleanroom+daegu process-overview.

## 5. 동적 검증 결과 (Check 단계 게이트 재실행 실측, 2026-07-17)

오케스트레이터가 Do 기록과 독립적으로 전 게이트를 재실행했다. **전 항목 통과.**

- **typecheck** 에러 0 · **lint** 신규 경고 0(기존 2건 — ExternalLink 미사용·Lightbox img, 이 feature 무관 — P4 Check와 동일)
- **build** exit 0 — `.next/server/app/sources/hs-assembly-inspection/` **12/12 모듈 HTML+RSC 산출** (Vercel 전환 후 산출 위치는 `.next/` — 루트 `out/`은 7/15 잔재로 검증 무효, 이번 Check에서 확인)
- **`build:cross-link`** — **10 sources · 138 sections · topics 284 · hazards 134 · chemicals 114 · 800 bidirectional edges · unknown 0** (Do 기록과 정확히 일치)
- **`extract:quotes`** — 214 quotes(책 188 + OSHA 26), `quotes.json` HEAD 대비 diff 0(회귀 없음)
- **렌더 실측**(빌드 HTML 직접 대조):
  - 홈 `index.html`에 hs-assembly-inspection 카드 렌더(교과서 그룹 7번째)
  - 파일럿 `packaging-overview.html` — `chapter/packaging`(ch13) 링크 4회 = ChapterRef 실렌더
  - 파일럿 SourceRef — daegu `process-overview`·ncs `package-assembly-development` + cross-link 자동 연결 NCS 패키지 계열 5종 노출
  - **권 간 연결 실증** — `particle-counter.html`에서 `hs-photo-etch/fab-cleanroom` 4회 + etch-equipment·etcher-maintenance 자동 연결
  - 인덱스 — **6트랙 전부 렌더**(조립 개요·1/쏘잉·4/다이 본딩·4/검사·1/프로브·1/파티클·1) · "12 단원" · 1모듈 트랙 4개 정상
- **특칙 독립 스캔**(gap-detector와 별도): 조작 시퀀스 패턴 0건 · footer 12/12 · 원문 이미지 0 · OCR 오식 잔존 0 · LayeredExplain 12/12 · 모델명 카운트는 gap-detector와 교차 검증(UDC 300 줄바꿈 표기까지 상호 보정 — 결과 요약 참조)

## 6. 설계가 구현보다 뒤처진 부분 (구현이 더 나감 — 계약 위반 아님) — 4건

| 항목 | 설계 상태 | 실측 | 권고(선택) |
|---|---|---|---|
| particle-counter 실습 건수 | §3 표 "실습과제 2건" | 원문·MDX 4건 | §3 비고 갱신 |
| ChapterRef(13) 배치 | §5 표: sawing-**equipment**·diebond-**equipment** | 실제: sawing-operation·sawing-**practice**·diebond-**operation**·particle-counter(FR-7 5건 초과) | §5 표에 "Do 확정" 주석 |
| daegu 연결 | Plan §1.3 "daegu 필수 없음" ↔ Design §5 표 daegu 포함 | 구현은 §5대로 daegu SourceRef 반영 | 문서 내부 정리 |
| OCR 오식 목록 | §4-6 5종 | 실제 교정 10+종 | 목록 보강 |

## 7. 판정 및 권고

**Match Rate 100% (기준 90% 통과) → iterate 불필요, Report 진행.**

- 시리즈 계약(장비 일반화 특칙 강화판·실습과제 단위 재구성·"움직이는 기계의 안전" 축·권 간 연결)이 **5권 연속 유효** — 첫 후공정 각론이 원문 충실도 100%로 편입.
- 실측 근거: 12모듈 원문 전수 대조 일치, 실습과제 13→13 누락 0, 조작 시퀀스 재현 0, OCR·이미지·직접 복사 0, cross-link forward/reverse 정합, 전 게이트 재실행 통과.
- 다음 단계: `/pdca report hs-assembly-inspection`

## 참고 문서

- Plan: `docs/archive/2026-07/hs-assembly-inspection/plan.md`
- Design: `docs/archive/2026-07/hs-assembly-inspection/design.md`
- 선례: `docs/03-analysis/hs-thinfilm-diffusion.analysis.md`(100%) · `hs-photo-etch.analysis.md`(100%)
