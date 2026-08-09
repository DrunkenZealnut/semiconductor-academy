# Design — 「반도체설비보전기능사 필기」 자료원 등록

> **Feature**: `cert-equip-maintenance` · **작성일**: 2026-08-09
> **기준**: `docs/01-plan/features/cert-equip-maintenance.plan.md`
> 이 문서는 **모듈 콘텐츠 제작의 단일 스펙**이다. 각 모듈 작성자는 §3(작성 계약)과 §4(자기 모듈 블록)를 그대로 따른다.

---

## 1. 파일·코드 변경 목록

| 구분 | 파일 | 작업 |
|------|------|------|
| 수정 | `src/lib/types.ts` | `SourceKind`에 `'exam-prep'` 추가 + `SOURCE_KIND_LABELS`("수험서") + `SOURCE_KIND_UNIT_LABELS`("Part") |
| 수정 | `src/lib/sources.ts` | `CERT_EQUIP_MAINT` 등록(§2) + `SOURCES` 배열 말미 추가 |
| 수정 | `src/lib/schoolTextMdx.tsx` | REGISTRY에 `cert-equip-maintenance` 13개 로더 + 헤더 주석을 "공용 로더"로 일반화 |
| 신규 | `src/content/sources/cert-equip-maintenance/{module}.mdx` ×13 | §3·§4 계약대로 |
| 신규 | `src/content/sources/cert-equip-maintenance/_links.json` | §5 태깅(작성자 보고 기반 확정) |
| 재실행 | `npm run build:cross-link` | 통제 어휘 검증 + 산출물 재생성 |

무수정 확인 대상: 홈 PerspectiveCatalog(accent `standard` 자동 편입), `[source]/page.tsx`(전 소스 자동), `[source]/[module]/page.tsx`(REGISTRY 파생), extract-quotes(챕터·OSHA 전용 — 수험서 비대상).

## 2. Source 등록 스펙

```text
id: 'cert-equip-maintenance' · kind: 'exam-prep' · language: 'ko'
title: '반도체설비보전기능사 필기'
subtitle: '국가기술자격 수험서 — 공정·설비·자동화·안전 이론을 시험 눈높이로, 전 자료원 연결 학습'
attribution: '김종주 외' · publisher: '에듀크라운' · year: 생략(OCR 미확인)
license: 'fair-use' · order: 14 · accent: 'standard' · category: 없음
```

> **사후 정정(2026-08-09, PR #28 CodeRabbit 리뷰 반영)**: 설계 시점엔 order 13이었으나, main 병합 시 같은 사이클에서 독립 병합된 `first-semiconductor`(입문서)가 먼저 order 13을 확정해 `cert-equip-maintenance`를 **order 14**로 재배정했다. 아래 §4 이하의 order 13 언급은 설계 시점 기록이므로 그대로 둔다.

### sections (등록 순서 = 책 목차 = 이전/다음 내비)

| # | id | title | group | rt(분) | 원문 범위(md 라인) |
|---|----|-------|-------|:--:|------------------|
| 1 | `intro` | 반도체 입문 | 반도체 기초 | 12 | 390–1042 |
| 2 | `photo-process` | 사진공정기술 | 전공정 기술 | 13 | 1043–1428 |
| 3 | `etch-process` | 식각공정기술 | 전공정 기술 | 13 | 1429–2083 |
| 4 | `diffusion-process` | 확산공정기술 | 전공정 기술 | 12 | 2084–2553 |
| 5 | `deposition-process` | CVD·PVD 공정기술 | 전공정 기술 | 14 | 2554–3708 |
| 6 | `clean-cmp-process` | 세정·CMP 공정기술 | 전공정 기술 | 12 | 3709–4297 |
| 7 | `assembly-process` | 반도체 조립공정기술 | 후공정 기술 | 13 | 4298–5108 |
| 8 | `automation-plc` | 자동화 공정기술 | 자동화·공유압 | 13 | 5109–6196 |
| 9 | `pneumatics-hydraulics` | 공유압 일반 | 자동화·공유압 | 13 | 6197–7644 |
| 10 | `industrial-safety` | 반도체 산업안전 | 안전관리·환경 | 13 | 7645–8561 |
| 11 | `electrical-facility` | 반도체 전기설비 | 안전관리·환경 | 8 | 8562–8800 |
| 12 | `chemical-facility` | 반도체 화공설비 | 안전관리·환경 | 10 | 8801–9176 |
| 13 | `environment-management` | 반도체 환경 | 안전관리·환경 | 9 | 9177–예상문제 직전 |

summary(카드 한 줄)는 §4 각 블록에 명시.

## 3. MDX 작성 계약 (전 모듈 공통)

### 3.1 구조 템플릿 (위→아래 순서)

1. `<LayeredExplain>` — hook(한 줄 질문/반전), easy.analogy(`<p>` JSX, 생활 비유), deep은 **summary 변형**: `deep={{ sourceSection: '「반도체설비보전기능사 필기」 Part 0N ○○', summary: (<>…</>) }}` — 원문의 학술적 내용을 재서술로 압축(2문단 내).
2. `<Callout type="info" title="이 Part의 학습 목표">` — "…할 수 있어요" 형식 2~3문장.
3. 도입 문단 — **다른 자료원 연결 커멘트**로 시작: 이 주제를 원리로 배우는 곳(SourceRef/ChapterRef)을 지목하고, 이 페이지는 "시험의 눈"으로 본다고 선언. (예시: safety-diffusion.mdx 도입부)
4. 본문 `##` 섹션 3~6개 — 개념 설명(비유·표·목록), 수치·정의 보존. 중간중간:
   - `<Callout type="tip" title="시험 포인트">` 모듈당 **2~4개** — 출제기준 주요항목(§4 매핑)과 예상문제 빈출 개념을 **자기 문장**으로("○○의 차이/순서/단위를 묻는 문제가 나와요" 식). 문제 지문·선지 재현 금지.
   - **인라인 커멘트** — 개념이 등장할 때 그 개념을 자세히 다루는 다른 자료원을 문장 속에서 자연스럽게 연결 + **왜 거길 가면 좋은지 한 줄 설명**. 모듈당 SourceRef/ChapterRef 합계 **4개 이상**(§4 매핑에서 선택, 전부 써도 좋음).
   - `<Callout type="info" title="더 알아보기">` 0~2개 — 심화 연결 묶음.
5. 안전 관련 서술이 있는 모듈은 본문 말미 `<SafetyDisclaimer />`.
6. 구분선 `---` 후 출처 footer:
   ```jsx
   <div className="text-xs italic text-slate-500">
   출처: 「반도체설비보전기능사 필기시험문제」(김종주 외, 에듀크라운) 제1편 Part 0N
   '○○'을 근거로 전면 재작성했으며, △△ 관련 내용은 (보강에 쓴 자료원)으로
   보강했습니다. 원문 문장·도판·문제는 사용하지 않았습니다.
   </div>
   ```

### 3.2 문체·눈높이

- 본문 존댓말 "~요"(deep.summary 내부만 문어체 "~다" 허용 — 예시 파일 참고).
- 중·고등학생이 처음 읽어도 이해되게: 용어 첫 등장 시 한 줄 풀이, 비유 적극 사용.
- 표(GFM 파이프)는 비교·분류에 적극 사용. 수치·단위·정의는 원문 보존, 문장은 전면 새로.
- 분량: **140~260줄**(원문이 큰 모듈은 압축 — 반복 나열은 "대표 상세 + 요약 표"로).
  - 예외(갭 분석 G-1·G-2 보수 반영, 2026-08-09): `pneumatics-hydraulics`(277줄 — 회로 기호 절 추가)·`industrial-safety`(266줄 — 안전관리 조직 문단 추가)는 상한 소폭 초과 허용.
  - 예외(백로그 G-7 PDCA 반복 반영, 2026-08-09): `automation-plc`(264줄 — 센서 신호 형식·모터 제어회로 보강, 출제기준 10·11 직결)는 상한 소폭 초과 허용.
  - 예외(PDCA 반복 2차 재평가 기록 보완, 2026-08-09): `assembly-process`(261줄)는 최초 작성 시점부터 상한을 1줄 초과한 상태였음 — 조립 6단계·검사까지의 서술 밀도상 압축 여지가 없어 소폭 초과 허용으로 사후 기록.

### 3.3 저작권·정확성 특칙

- 원문 문장 구조·표현 재사용 금지(개념·수치·정의·절차 논리만 근거). 원문 이미지 참조·삽입 금지.
- **문제편**: 빈출 개념 파악용으로만 읽고, 지문·선지·문항 구조 재현 금지.
- 제조사·모델 고유 스펙은 "이 유형 장비의 대표 값" 문맥으로 일반화. 조작 버튼/화면 시퀀스 재현 금지.
- OCR 오식 정제: 헤더·본문의 깨진 표기("임문"→"입문", "국유의"→"공유압" 등)는 문맥으로 복원, 확신 없는 수치는 **버린다**(틀린 수치 게재 금지).

### 3.4 MDX 기술 규칙 (hydration 함정)

- `#`(h1) 금지 — `##`부터(페이지 h1은 셸이 렌더). import 문 불필요(컴포넌트 전역 등록).
- 블록 컴포넌트(Callout·LayeredExplain·SafetyDisclaimer)는 문단 **사이**에 독립 배치 — 문단/리스트 항목 안에 넣지 말 것.
- SourceRef/ChapterRef는 인라인 허용 — 문장 속에서 `{' '}`로 공백 제어(예시 파일 참고).
- 본문 텍스트에 raw `<`, `>` 금지(이상/이하/미만으로 서술), JSX 밖 중괄호 금지.
- 표는 파이프 테이블 그대로(전역 래핑됨). 출처 footer는 `<div>`(마크다운 각주 문법 금지).

### 3.5 참조 컴포넌트 시그니처

- `<SourceRef source="{sourceId}" section="{sectionId}" label="「자료명」 섹션명" />` — label 생략 시 섹션 제목. **§4 매핑에 적힌 id만 사용**(오타 시 무음 미렌더).
- `<ChapterRef order={N} />` — 책 「반도체 산업의 유해인자」 챕터 (1 새 기술의 위험성 / 2 반도체란 / 3 제조 공정 개요 / 4 클린룸 / 5 웨이퍼 제조 / 6 클리닝 / 7 확산 / 8 포토리소그래피 / 9 식각 / 10 증착 / 11 이온 주입 / 12 CMP / 13 패키징 / 14 화학물질 사용 / 15 전자파 / 16 직업병 고찰 / 17 산업보건학적 시각)
- Callout type: `info | warning | tip | source`.

### 3.6 예시 파일 (톤·구조 기준)

- `src/content/sources/hs-semicon-infra/safety-diffusion.mdx` — 도입 커멘트·Callout 연결·footer의 표준.
- `src/content/sources/hs-equipment-maintenance/maintenance-fundamentals.mdx` — 표준·제도 내용의 서술 톤.

## 4. 모듈별 스펙

각 블록: **scope**(다룰 절— 원문 슬라이스의 헤더 기준) / **summary**(sections 카드 문구) / **출제기준**(시험 포인트 근거로 쓸 주요항목) / **커멘트 매핑**(SourceRef `source/section` + ChapterRef order — 이 목록의 id는 전부 유효 검증됨).

### 4.1 `intro` — 반도체 입문
- scope: 반도체 정의·특성·진성/불순물, 발전 과정(진공관→TR→IC), 반도체의 역할(정류·증폭 등), 청정실 복장·에어샤워·단위(Bit/Inch/Class), FAB/조립/검사 라인, 웨이퍼 제조(성장·절단·연마·세정)와 용어(칩·스크라이브 라인·TEG·플랫존·랏), 8대 공정 개관.
- summary: "반도체의 정의부터 클린룸 복장·FAB 라인·웨이퍼 제조·공정 전체 지도까지 — 시험의 출발점"
- 출제기준: 전 항목의 공통 기초(예상문제 '01 반도체 입문' 직접 출제 영역).
- 커멘트: ChapterRef 2(반도체란)·3(공정 개요)·4(클린룸) / SourceRef `hs-semicon-basics/semicon-overview`, `hs-semicon-basics/semicon-industry`, `daegu-hs-process/process-overview`, `hs-photo-etch/fab-cleanroom`, `ncs-semi/cleanroom-facility`
- 태그 후보: topics [cleanroom, wafer-fab]

### 4.2 `photo-process` — 사진공정기술
- scope: 사진공정 정의·구성(도포→노광→현상→검사), HMDS·PR 도포·EBR·소프트베이크, 노광(접촉/근접/투영, 광원), PEB·현상·하드베이크, 검사(육안·오버레이·CD), 트랙/노광/검사 장비 구성.
- summary: "PR 도포·노광·현상·검사 네 단계와 트랙·노광 장비 — 회로를 새기는 사진공정의 전 과정"
- 출제기준: 3(진공·플라즈마 장비 유지보수 — Photo·Etch 작동환경), 5(Photo·Etch 장비 운영).
- 커멘트: ChapterRef 8 / SourceRef `daegu-hs-process/photo`, `hs-photo-etch/photo-process`, `hs-photo-etch/track-equipment`, `hs-photo-etch/exposure-equipment`, `hs-semicon-infra/safety-photo`, `ncs-semi/photo-equipment`
- 태그 후보: topics [photolithography]; chemicals [hmds] (+본문 실증 시 tmah)

### 4.3 `etch-process` — 식각공정기술
- scope: 식각 정의, 습식/건식 비교(등방성·이방성·선택비), 플라즈마 원리·반응 과정, 식각률 등 용어, 가스별 특성, 식각 장비 구성.
- summary: "습식과 건식, 등방성과 이방성 — 플라즈마로 회로를 깎는 식각의 원리와 장비"
- 출제기준: 3, 5.
- 커멘트: ChapterRef 9 / SourceRef `daegu-hs-process/etch`, `hs-photo-etch/etch-process`, `hs-photo-etch/etch-equipment`, `hs-semicon-infra/safety-etch`, `ncs-semi/etch-equipment`, `hs-equipment-maintenance/element-plasma`
- 태그 후보: topics [etching, gas-safety]; chemicals 본문 실증분(chlorine·hydrofluoric-acid 등)

### 4.4 `diffusion-process` — 확산공정기술
- scope: 산화(건식/습식), 확산(예비적층·드라이브인), 이온주입(원리·도즈·어닐링), LP-CVD 연계, 확산로 구조.
- summary: "산화·확산·이온주입 — 고온과 이온빔으로 웨이퍼에 전기 성질을 심는 세 가지 방법"
- 출제기준: 4(케미칼 가스 장비 유지보수), 6(박막/확산 장비 운영 — 이온주입 포함).
- 커멘트: ChapterRef 7·11 / SourceRef `daegu-hs-process/oxidation`, `daegu-hs-process/doping`, `hs-thinfilm-diffusion/diffusion-process`, `hs-thinfilm-diffusion/diffusion-equipment`, `hs-semicon-infra/safety-diffusion`, `hs-semicon-infra/safety-ion-implant`
- 태그 후보: topics [diffusion, ion-implantation]; chemicals 실증분(arsine·phosphine·diborane·phosphorus-oxychloride 등)

### 4.5 `deposition-process` — CVD·PVD 공정기술
- scope: CVD 정의·종류(AP/SA/LP/PE/HDP), 막 종류별 목적, W 플러그, PVD(스퍼터링), RTS(RTP), ALD.
- summary: "APCVD에서 ALD까지 — 웨이퍼에 박막을 쌓는 모든 방법과 장비 계보"
- 출제기준: 4, 6.
- 커멘트: ChapterRef 10 / SourceRef `daegu-hs-process/thin-film`, `daegu-hs-process/metallization`, `hs-thinfilm-diffusion/thinfilm-process`, `hs-thinfilm-diffusion/thinfilm-equipment`, `hs-semicon-infra/safety-deposition`, `ncs-semi/thinfilm-process-gas`
- 태그 후보: topics [deposition, gas-safety]; chemicals 실증분(silane·tungsten-hexafluoride·dichlorosilane 등)

### 4.6 `clean-cmp-process` — 세정·CMP 공정기술
- scope: 오염원과 세정(RCA·SPM·건식), 세정 장비, CMP 원리(슬러리·패드), W CMP·산화막 CMP, CMP 장비·소모품.
- summary: "웨이퍼를 씻는 세정과 갈아서 평평하게 만드는 CMP — 오염과 단차를 지우는 기술"
- 출제기준: 6 연계(예상문제 '07 CMP/세정' 직접 영역).
- 커멘트: ChapterRef 6·12 / SourceRef `daegu-hs-process/cleaning`, `daegu-hs-process/cmp`, `ncs-semi/clean-cmp-equipment`, `hs-semicon-infra/safety-cmp`, `ncs-semi/cmp-materials`
- 태그 후보: topics [cmp, liquid-chemicals]; chemicals 실증분(hydrofluoric-acid·hydrogen-peroxide·sulfuric-acid·ammonia·silica-slurry 등)

### 4.7 `assembly-process` — 반도체 조립공정기술
- scope: 조립 공정 흐름(백그라인딩→쏘잉→다이본딩→와이어본딩→몰딩→마킹→솔더볼→검사), 각 단계 장비, 마킹(레이저/잉크), 패키지 종류.
- summary: "백그라인딩부터 마킹까지 — 웨이퍼가 검은 칩이 되는 조립 공정 전 단계"
- 출제기준: 1·2(쏘잉·다이본딩 조립·검증), 7(패키징 전·후 공정장비 운영).
- 커멘트: ChapterRef 13 / SourceRef `hs-assembly-inspection/packaging-overview`, `hs-assembly-inspection/sawing-process`, `hs-assembly-inspection/diebond-process`, `hs-assembly-inspection/probe-test`, `ncs-semi/packaging-back-equipment`, `hs-semicon-infra/safety-backend-mechanical`, `hs-semicon-infra/safety-backend-chemical`
- 태그 후보: topics [packaging]; chemicals 실증분(epoxy-resin·lead·solder-flux 등)

### 4.8 `automation-plc` — 자동화 공정기술
- scope: 자동제어 기초·종류(시퀀스/피드백), 제어계 구성, PLC 구성·원리, 논리회로·래더, 디버깅, 센서(종류·신호·관리), 모터(종류·제어회로).
- summary: "시퀀스 제어와 PLC, 센서와 모터 — 반도체 설비를 스스로 움직이게 하는 기술"
- 출제기준: 9(PLC), 10(센서), 11(모터) — 이 세 항목이 이 모듈에서 출제.
- 커멘트: SourceRef `hs-basic-tech-2/digital-circuits`, `hs-basic-tech-2/microprocessor-basics`, `hs-equipment-maintenance/design-control-software`, `hs-equipment-maintenance/design-electrical`, `ncs-semi/equipment-system-software`
- 태그 후보: topics [engineering-controls] (본문 실증 시)

### 4.9 `pneumatics-hydraulics` — 공유압 일반
- scope: 공압 기초(압력 단위·기체 법칙), 공압 발생·조정(압축기·FRL·밸브·실린더), 회로 기호, 유압 시스템·제어밸브, 회로(AND/OR 밸브 등).
- summary: "압축 공기와 기름의 힘 — 밸브·실린더·회로 기호로 읽는 설비 구동 기술"
- 출제기준: 12(공기압 제어), 13(공기압 장치조립) — 배점 큰 영역.
- 커멘트: SourceRef `hs-basic-tech-1/pneumatics-basics`, `hs-basic-tech-1/pneumatics-equipment`, `hs-basic-tech-1/hydraulics-equipment`, `hs-basic-tech-2/electropneumatic-circuits`, `hs-basic-tech-2/pneumatics-maintenance`, `hs-equipment-maintenance/element-pneumatic-thermal`
- 태그 후보: topics [compressed-gas]; hazards [compressed-gas]

### 4.10 `industrial-safety` — 반도체 산업안전 (Part 10 제1장)
- scope: 산업안전 개념·안전관리 조직, 산업위생, FAB 내 안전, 방사선 안전관리, 방재·SCS(Safety Control System), 비상사태 행동요령, PSM(공정안전관리).
- summary: "안전관리 조직부터 방재 시스템·비상 대응·PSM까지 — 설비 기술자의 안전 기본기"
- 출제기준: 8(반도체장비 안전관리 — 기계·전기 안전).
- 커멘트: ChapterRef 1·16·17 (+방사선 문맥에 15) / SourceRef `hs-semicon-infra/safety-management`, `osha-scs/part-1b`, `osha-scs/part-2`, `ncs-semi/equipment-safety`, `hs-equipment-maintenance/maintenance-by-type`
- 태그 후보: topics [industrial-hygiene, emergency-response, ppe, engineering-controls]

### 4.11 `electrical-facility` — 반도체 전기설비 (Part 10 제2장)
- scope: 전력설비(수변전·무정전), 전압의 종류(저압/고압/특고압), 전기적 장애(정전·서지·정전기)와 위험성.
- summary: "수변전에서 정전기까지 — 팹을 멈추지 않는 전기 인프라와 전기 안전"
- 출제기준: 8(전기안전).
- 커멘트: SourceRef `hs-basic-tech-1/dc-circuits`, `hs-basic-tech-2/ac-circuits`, `hs-equipment-maintenance/element-power`, `ncs-semi/utility-operation`
- 태그 후보: topics [engineering-controls]

### 4.12 `chemical-facility` — 반도체 화공설비 (Part 10 제3장)
- scope: 가스 중앙공급 시스템 CGSS(실린더 캐비닛·배관·퍼지), 케미컬 중앙공급 시스템 CCSS, 가스·약액 안전.
- summary: "CGSS와 CCSS — 위험한 가스·약액을 팹 구석구석 안전하게 보내는 중앙공급 시스템"
- 출제기준: 8(가스안전·주요가스의 종류·취급방법) — 이 모듈이 직접 근거.
- 커멘트: ChapterRef 14 / SourceRef `osha-scs/part-4`, `osha-scs/part-3`, `ncs-semi/utility-operation`, `ncs-semi/chemical-gas-maintenance`, `ncs-semi/gas-materials`, `hs-equipment-maintenance/element-vacuum-gas`
- 태그 후보: topics [gas-safety, compressed-gas, chemical-inventory, engineering-controls]; hazards [toxic, pyrophoric, corrosive, compressed-gas]; chemicals 실증분(silane·arsine·phosphine 등)

### 4.13 `environment-management` — 반도체 환경 (Part 10 제4장)
- scope: ISO 14001·ISO 14000 시리즈, EMS(환경경영시스템), 주요 환경 영향, 오염물질 처리공정(폐수·대기 처리, Exhaust Treatment/스크러버), 환경보호활동.
- summary: "ISO 14001과 스크러버 — 팹 밖으로 나가는 물·공기를 책임지는 환경 관리"
- 출제기준: 직접 항목 없음(예상문제 '10 안전관리'에 포함되는 배경 소양으로 안내).
- 커멘트: ChapterRef 17·14 / SourceRef `ncs-semi/material-safety`, `hs-semicon-infra/safety-management`, `ncs-semi/utility-operation`
- 태그 후보: topics [engineering-controls]

## 5. `_links.json` 확정 절차

작성자는 최종 보고에 "본문에서 실제로 다룬" topics/hazards/chemicals를 §4 태그 후보 중에서(또는 아래 어휘 내에서) 골라 제출 → 통합 작성 후 `npm run build:cross-link`로 검증.

- topics(21): ghs, sds-label, chemical-inventory, cleanroom, wafer-fab, photolithography, etching, diffusion, deposition, ion-implantation, cmp, packaging, gas-safety, liquid-chemicals, compressed-gas, cryogenic, storage-compatibility, engineering-controls, ppe, emergency-response, occupational-disease, exposure-monitoring, industrial-hygiene
- hazards(12): flammable, pyrophoric, oxidizer, corrosive, toxic, acute-toxic, carcinogen, reproductive-toxin, sensitizer, compressed-gas, cryogenic, reactive
- chemicals(등록 30종): benzene, arsine, phosphine, diborane, hydrofluoric-acid, hydrogen-peroxide, isopropyl-alcohol, pgmea, tmah, hmds, chlorine, fluorine, silane, ammonia, tungsten-hexafluoride, boron-trifluoride, silica-slurry, ceria-slurry, lead, epoxy-resin, solder-flux, trichlorosilane, arsenic, ethylene-glycol-ether, antimony-trioxide, boron-tribromide, phosphorus-oxychloride, dichlorosilane, ozone, sulfuric-acid

## 6. 검증 게이트

1. 구조 게이트(모듈별): LayeredExplain 1 + 학습 목표 1 + 시험 포인트 2~4 + SourceRef/ChapterRef ≥4 + 출처 footer 1 + (안전 서술 시) SafetyDisclaimer.
2. 참조 게이트: 모든 SourceRef source/section이 sources.ts에 실존(스크립트 대조), ChapterRef order 1~17.
3. MDX 게이트: h1 없음, 블록 컴포넌트 문단 내 미포함, raw 부등호 없음.
4. 파이프라인: typecheck + lint + `npm run build`(SSG 13모듈+인덱스 생성) + build:cross-link 무오류.
5. 콘텐츠 스팟 QA: 모듈당 수치·정의 2건 이상 원문 대조, 문제 지문 재현 0 확인.
