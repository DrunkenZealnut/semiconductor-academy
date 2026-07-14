# Design — NCS 전 모듈 확장 + 원문 도판 활용 재작성

> **Feature**: `ncs-image-expansion` · **작성일**: 2026-07-13 · Plan: `docs/01-plan/features/ncs-image-expansion.plan.md`
> **상속**: `ncs-semiconductor.design.md`(라우팅·로더·콘텐츠 계약 — 전부 유효, 재기술 안 함) · `ncs-semiconductor-dev-track.spec.md`(에이전트 재구성 스펙 — 본 사이클에서 §1-d/§1-e 확장)
>
> 이 문서는 **신규 설계분만** 다룬다: ① 이미지 파이프라인 ② marker 변환 배치 ③ 신규 54모듈 id 매핑 ④ 기존 30모듈 보강 계약 ⑤ 검증기 확장.

---

## 1. 이미지 파이프라인 (신규 핵심)

```
원본 md(marker) ──▶ [1] extract-figures.py ──▶ 후보 JSON(캡션·페이지·자동플래그)
                                                      │ 에이전트: 3~6장 선정 제안
                                                      ▼
메인 루프 저작권 전수 재확인 ──▶ [2] prepare-images.sh ──▶ public/source-images/ncs/{id}/
                                                      ▼
                                    MDX <ImageFigure …/> 삽입 ──▶ [3] validate-ncs-mdx.py 검증
```

### 1.1 후보 추출 — `scripts/ncs/extract-figures.py` (신규, 저장소 커밋)

- 입력: 원본 md 경로 + 모듈 id. 라인 스캔(기존 extract-quotes 방식과 동일 철학 — 복잡 regex 회피).
- 추적: `<!-- page: N -->` 주석으로 페이지, `![](_page_N_{Figure|Picture}_M.jpeg)` 참조, **전후 ±3줄에서 `[그림 X-X] …` 캡션 매칭**.
- 자동 플래그(제외 후보 표시, 최종 판단은 사람/메인 루프):
  - `third_party`: 출처 표기가 있으나 저작 주체가 국가 계열이 아님 (기업·보고서·외부 프로그램 스크린샷 등)
  - `self_attributed`: 출처 표기의 저작 주체가 집필진·교육부·한국직업능력개발원·한국산업인력공단 — **국가 저작으로 사용 가능** (파일럿 실측: NCS 도판의 출처 표기 대부분이 `출처: 집필진 제작(2024)` 또는 구판 자기 인용이라 이 구분이 없으면 사용 가능 도판의 90%가 오탐 제외됨)
  - `boilerplate`: page ≤ 8 (표지·NCS 활용 안내·분류 체계도 구간)
  - `photo`: 파일명 `Picture` (실사 위험군 — 개념도 `Figure` 대비 보수 취급)
- 파일럿 교훈(3차 검토 필수 근거): ±3줄 문맥 기반 캡션 매칭은 인접 도판의 캡션을 잘못 붙일 수 있다(실측 1건 — 그림 1-35로 추정된 파일의 실제 캡션은 그림 1-36). **채택 도판은 반드시 이미지를 직접 열어** 내용·캡션·저작 표기를 확인한다.
- 출력: `scratchpad/figures/{module-id}.json` — `[{file, page, caption, context, flags[]}]`

### 1.2 선별 규칙 (Plan §2 필터의 실행 규격)

| 단계 | 주체 | 규칙 |
|---|---|---|
| 1차 | 스크립트 | `third_party`·`boilerplate` 플래그 자동 제외 후보화 |
| 2차 | 재구성 에이전트 | 남은 후보에서 **이해 기여도 순 3~6장** 선정 + 삽입 위치 제안. `photo` 플래그는 장비 외관 이해에 필수일 때만 |
| 3차 | 메인 루프(전수) | 선정 도판의 원문 캡션·주변 문맥 직접 열람, 제3자 저작 징후(워터마크·로고·외부 인용) 재확인. **애매하면 제외** |

### 1.3 변환·저장 — `scripts/ncs/prepare-images.sh` (신규)

- 선정 목록 JSON → `sips -Z 1200`(최대변 1200px) + `-s format jpeg -s formatOptions 70` 재압축.
- 저장: `public/source-images/ncs/{module-id}/{원본파일명}` — **원본 파일명 유지**(원문 페이지 추적성).
- 200KB 초과 시 formatOptions 55로 재시도, 그래도 초과면 보고 후 제외 판단. 종료 시 모듈별·전체 용량 리포트(`du`).
- 예산: 전체 `public/source-images/ncs/` ≤ 40MB (Plan NFR-1).

### 1.4 MDX 삽입 규격 (`ImageFigure` — 기존 컴포넌트 무수정 재사용)

```mdx
<ImageFigure
  src="/source-images/ncs/etch-equipment/_page_23_Figure_4.jpeg"
  alt="플라스마 식각 장비 챔버의 단면 구조와 가스 흐름"
  caption="[그림 1-3] 식각 장비 챔버 구조"
  source="NCS 학습모듈 「Etch 장비 운영」(LM1903060202_14v3) · 교육부·한국산업인력공단"
/>
```

- **위치**: 해당 개념의 `LayeredExplain` Easy 층 직후 또는 관련 소제목 본문 뒤. 블록 컴포넌트 단독 라인(hydration 규칙 승계).
- **alt**: 도판 내용을 설명하는 서술형 한국어(20~40자). 그림 번호·"이미지"·"그림입니다" 금지.
- **caption**: 원문 그림 번호·제목 그대로(`[그림 X-X] …`). 원문 캡션이 없으면 내용 요약 캡션 + `(원문 무제 도판)` 병기.
- **수량**: 모듈당 1~6장 — 기본 목표 3~6장, 원문 사용 가능 도판이 부족하면 하한 완화(§6.1 검증기 기준 1~6과 일치, 2026-07-14 Check 반영). src는 `/source-images/…` 루트 경로(컴포넌트가 basePath 처리).

### 1.5 푸터 v2 (이미지 포함 모듈 — 일괄 교체)

```
출처: NCS 학습모듈 「{모듈명}」({LM코드}) · 교육부·한국산업인력공단. 고등학생 눈높이로 재구성했으며, 원문 도판 일부를 출처 표기와 함께 실었습니다(제3자 저작 표기 도판은 제외).
```

## 2. marker 변환 배치 (제조·장비 — 이미지·원문 확보 선행 작업)

- 대상: 제조 PDF 13(기존 6모듈 이미지 + 신규 7모듈 원문·이미지), 장비 PDF 19(기존 4모듈 이미지 + 신규 15모듈 원문·이미지). 합본 PDF 4건은 1모듈 취급.
- 명령: `~/.local/bin/marker_single "{pdf}" --output_dir "data/ncs/{트랙}/_marker"` → 출력 `_marker/{pdf-stem}/{pdf-stem}.md` + 이미지(중첩 경로 주의 — 3차 배치에서 확인된 형태).
- 실행: 백그라운드 배치(개당 수 분), 완료 후 **품질 스팟체크 게이트**: md 분량·표 개수·이미지 참조 수를 PDF 페이지수 대비 확인, 깨진 표는 기존 OCR 규칙대로 배제.
- 한글 경로는 NFD — 셸에서 find 출력 경로를 변수로 그대로 사용(수기 타이핑 금지).

## 3. 신규 54모듈 id 매핑 (통제 목록 — sources.ts·ncsMdx·파일명·_links.json 공통 키)

### 3.1 개발 19 (`반도체개발/LM…/2026…*.md`, 이미지 동봉)

| LM | 모듈명 | id |
|---|---|---|
| 0103 | 아날로그 회로 설계 | `analog-circuit-design` |
| 0106 | 반도체 제조 공정 개발 | `process-development` |
| 0108 | 패키지 조립 공정 개발 | `package-assembly-development` |
| 0109 | 반도체 제품 기능·성능 검증 | `product-verification` |
| 0112 | 자동 배치 배선 레이아웃 설계 | `auto-layout-design` |
| 0113 | 반도체 설계 검증 | `design-verification` |
| 0115 | 메모리 반도체 제조 공정 개발 | `memory-process-development` |
| 0117 | 반도체 제조 단위 공정 개발 | `unit-process-development` |
| 0118 | 아날로그 회로 아키텍처 설계 | `analog-architecture-design` |
| 0119 | 아날로그 회로 소자 레벨 설계 | `analog-device-design` |
| 0120 | 아날로그 회로 시스템 설계 | `analog-system-design` |
| 0121 | 와이어 본딩 패키지 개발 | `wirebond-package-development` |
| 0123 | 웨이퍼 레벨 패키지 개발 | `wafer-level-package` |
| 0124 | 어드밴스드 팬 아웃 패키지 개발 | `fanout-package` |
| 0125 | 이종 접합 패키지 개발 | `heterogeneous-package` |
| 0127 | 반도체 환경 시험 | `environmental-testing` |
| 0128 | 반도체 수명 시험 | `lifetime-testing` |
| 0129 | 반도체 내성 시험 | `robustness-testing` |
| 0131 | 커스텀 레이아웃 설계 | `custom-layout-design` |

### 3.2 재료 13 (`반도체재료/…/2026…*.md`, 이미지 동봉)

| LM | 모듈명 | id |
|---|---|---|
| 0401 | 반도체용 웨이퍼 재료 제조 | `wafer-materials` |
| 0402 | 반도체용 리소그래피 재료 제조 | `lithography-materials` |
| 0403 | 반도체용 가스 재료 제조 | `gas-materials` |
| 0404 | 반도체용 금속 Target 재료 제조 | `metal-target-materials` |
| 0405 | 반도체용 습식화공약품 재료 제조 | `wet-chemical-materials` |
| 0406 | 반도체 패키지 재료 제조 | `package-materials` |
| 0409 | 반도체 재료 생산관리 | `materials-production-control` |
| 0416 | 반도체용 식각 공정 가스 제조 | `etching-process-gas` |
| 0418 | 반도체용 박막 공정 가스 제조 | `thinfilm-process-gas` |
| 0419 | 반도체용 이온 주입 공정 가스 제조 | `implant-process-gas` |
| 0421 | 반도체용 포토 공정 재료 제조 | `photo-process-materials` |
| 0422 | 반도체용 트랙 공정 재료 제조 | `track-process-materials` |
| 0423 | 반도체용 SOD 공정 재료 제조 | `sod-process-materials` |

### 3.3 제조 7 (`반도체제조/*.md` 기존 변환본 + `_marker` 이미지)

| LM | 모듈명 | id |
|---|---|---|
| 0202 | Etch 장비 운영 | `etch-equipment` |
| 0204 | C&C 장비 운영 | `clean-cmp-equipment` † |
| 0205 | MI(계측·검사) 장비 운영 | `metrology-equipment` |
| 0211 | 웨이퍼 레벨 테스트 장비 운영 | `wafer-level-test` |
| 0213 | 패키징 전공정 장비 운영 | `packaging-front-equipment` |
| 0214 | 패키징 후공정 장비 운영 | `packaging-back-equipment` |
| 0215 | 반도체 유틸리티 운영 | `utility-operation` |

† C_C의 정식 명칭(세정·CMP 여부)은 Do 때 원문 서두에서 확정 후 title 반영.

### 3.4 장비 15 (`반도체장비/*.pdf` → `_marker` 변환본)

| LM | 모듈명 | id |
|---|---|---|
| 0301 | 장비 콘셉트 설계 | `equipment-concept-design` |
| 0302 | 장비 주요부 기구 설계 | `equipment-main-design` |
| 0305 | 장비 시스템 소프트웨어 개발 | `equipment-system-software` |
| 0307 | 장비 전장 설계 | `equipment-electrical-design` |
| 0308 | 장비 생산 외주관리 | `equipment-outsourcing` |
| 0313 | 장비 고객 지원 | `equipment-customer-support` |
| 0314·15 | 장비 보드 설계 | `equipment-board-design` |
| 0316·17 | 장비 유틸리티 소프트웨어 개발 | `equipment-utility-software` |
| 0318·19 | 장비 시제품 성능평가 | `equipment-prototype-evaluation` |
| 0320·21 | 장비 품질관리 | `equipment-quality-control` |
| 0322 | 장비 기구 조립 | `equipment-mechanical-assembly` |
| 0325 | 장비 전장 조립 검증 | `equipment-electrical-verification` |
| 0327 | 진공 플라스마 장비 유지보수 | `vacuum-plasma-maintenance` |
| 0328 | 케미컬 가스 장비 유지보수 | `chemical-gas-maintenance` |
| 0329 | 장비 안전관리 | `equipment-safety` |

- 기존 30 id와 충돌 없음(검수 완료). 합본(0314·15 등)은 푸터에 두 LM 코드 병기.

## 4. 레지스트리 등록 규약

- **`sources.ts`**: 섹션 엔트리 형식 기존과 동일 `{ id, href: '/sources/ncs-semi/{id}/', title, summary, readingTime(분, 숫자), group }`. **기존 30개의 상대 순서 유지**, 신규는 같은 group 안에서 학습 흐름 순(설계 → 공정 → 패키지 → 시험)으로 삽입. group 표시 순서(개발→제조→재료→장비)는 첫 등장 순 — 변경 금지.
- **`ncsMdx.tsx`**: 모듈당 로더 1줄 추가(기존 패턴).
- **`_links.json`**: 근거 기반 태깅만(본문이 실제 다루는 topic/hazard). **순수 설계·관리 모듈 무태깅 관행 유지**(아날로그 설계 3부작·검증·외주관리·고객지원 등은 태깅 없음 예상). 통제 어휘 추가 필요 시 `schema.ts`+`schema-enum.json` 동시 수정 후 `build:cross-link` 검증.
- 콘텐츠 계약(3단 레이어·Term 화이트리스트 15종·ChapterRef 1~17·hydration 규칙·OCR 오탈자 예외)은 기존 스펙 그대로 승계.

## 5. 기존 30모듈 보강 계약 (본문 보존)

- 허용 변경: ① `ImageFigure` 삽입(3~6장) ② 푸터 v1→v2 교체 ③ 삽입 지점 앞뒤 1~2문장의 연결 보정.
- 금지: 기존 LayeredExplain·SourceQuote·표 본문 대체/재작성(CodeRabbit 리뷰까지 통과한 본문). diff 리뷰에서 이미지·푸터 외 삭제 라인 발견 시 반려.
- 제조 6·장비 4는 `_marker` 이미지 확보(§2) 후 보강.

## 6. 검증 계획

### 6.1 `scripts/ncs/validate-ncs-mdx.py` (scratchpad 검증기를 저장소로 이관 + 확장)

기존 항목(구조·푸터·금지 컴포넌트·Term 화이트리스트·ChapterRef 범위·hydration 패턴·줄수) + 신규:

- `ImageFigure` 허용 컴포넌트 등록, 모듈당 1~6개
- `src` 경로의 실제 파일 존재(`public/source-images/ncs/{id}/…`) 검사
- `alt`/`source` prop 필수·비어있지 않음, alt에 "그림 N" 패턴 금지
- 이미지 포함 모듈은 푸터 v2 패턴, 미포함 모듈은 v1 유지 허용

### 6.2 게이트 (기존 승계 + 추가)

| 게이트 | 기준 |
|---|---|
| 구조 검증 | validate-ncs-mdx.py 전 모듈 PASS |
| 저작권 | 메인 루프 도판 전수 재확인(§1.2 3차) — 에이전트 선별 신뢰하지 않음 |
| 수치 대조 | 신규 모듈 핵심 수치 원문 grep 대조(기존 관행) |
| 빌드 | typecheck · lint · `build:cross-link` · `extract:quotes` 회귀 0 · `npm run build` SSG 수 = 등록 수 |
| SSR | export HTML p/div 중첩 스캔(ImageFigure는 figure 요소 — 스캔 예외 불필요, 확인만) |
| 용량 | `du -sh public/source-images/ncs` ≤ 40MB, 장당 ≤ 200KB |
| 렌더 실측 | 파일럿·각 Phase 대표 모듈 Lightbox·다크모드·모바일 폭 확인 |

## 7. 구현 순서

1. **Phase 0 — 파일럿** (게이트 실증): `scripts/ncs/` 3종 스크립트 작성 → 파일럿 3모듈(기존 보강: `system-process-development`(도판 103장 최다)·`material-safety` / 신규: `wafer-materials`) → 전 게이트 통과 → 필터·용량·렌더 결과로 스펙 §1-d 확정.
2. **Phase 1**: 기존 개발 11 + 재료 9 이미지 보강(병렬 에이전트, §5 계약).
3. **Phase 2**: 개발 신규 19 작성(스펙 §1-d 테이블 + 유사 모듈 각도 차별화 쌍 — 아날로그 3부작, 패키지 계열, 시험 3부작).
4. **Phase 3**: 재료 신규 13 작성(가스 4종·재료 계열 각도 차별화).
5. **Phase 4**: marker 배치(§2) → 제조 6·장비 4 보강 + 제조 7·장비 15 신규.
6. 각 Phase = 1 PR (CodeRabbit 리뷰 사이클 승계), pdca analyze는 Phase 4 후 일괄.
