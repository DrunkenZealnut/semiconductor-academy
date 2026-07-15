# Plan — daegu-safety-enrichment

「반도체 공정기초」(daegu-hs-process) 10개 단원에 소주제별 안전 콘텐츠 보강.

| 항목 | 내용 |
|---|---|
| **Feature** | daegu-safety-enrichment |
| **작성일** | 2026-07-15 |
| **Problem (문제)** | 공정기초 교과서 10개 단원은 "공정이 어떻게 동작하는가"만 다루고, 안전 관점은 단원 말미 tip Callout의 책 챕터 링크 1개뿐이다. 감광제·HF·실란·도판트 가스 등 실제 유해인자가 등장하는 소주제 바로 옆에 안전 맥락이 없어, "원리 → 위험" 학습 동선이 끊긴다. |
| **Solution (해결)** | 유해인자 책(1∼17장)·OSHA SCS(Part 1A∼4)에서 각 단원 소주제와 직결되는 안전 팩트를 추출해, 해당 소주제 위치에 `Callout type="warning"` 안전 박스로 삽입. 출처는 `ChapterRef`(책)·신규 `SourceRef`(OSHA)로 연결. `_links.json`에 hazards/chemicals 태그를 보강해 cross-link 자동 연결도 강화. |
| **Core Value (핵심 가치)** | 공정 원리를 배우는 바로 그 자리에서 "이 물질·장비가 사람에게 왜 위험한가"를 만나게 해, 교과서(원리)–학술서(위험)–OSHA(안전수칙)의 3축 학습 동선을 소주제 단위로 완성. |

## 목표

1. 10개 단원 전부에 소주제 앵커 기반 안전 Callout 2∼5개씩 삽입 (근거: 책·OSHA 본문에 실재하는 내용만).
2. OSHA part 등 자료원 섹션을 본문에서 가리키는 범용 인라인 칩 `SourceRef` 컴포넌트 신설 (`ChapterRef`의 자료원 범용판).
3. `daegu-hs-process/_links.json`에 hazards/chemicals 태그 추가 → cross-link 인덱스 강화 (통제 어휘 검증 통과).

## 비목표

- 교과서 본문(공정 원리 서술) 자체의 수정·확장.
- 새 통제 어휘(Topic/Hazard) 추가, 새 chemical 등록.
- 책·OSHA MDX 원문 수정.

## 접근

- 안전 팩트는 책·OSHA MDX에서 발췌 근거(파일:라인)와 함께 수집 후 재작성 — 근거 없는 문장 금지.
- 문체·MDX 규칙은 daegu-hs-textbook.design.md §4 계약 그대로 (해요체, 리터럴 `<`·`{` 금지, `~`→`∼`, 유니코드 아래첨자, 블록 컴포넌트 앞뒤 빈 줄).
- warning Callout 제목은 기존 관례처럼 서술형 한 문장 (예: "현상액 TMAH — 피부 접촉도 위험한 강염기").
- 안전 Callout은 "무엇이 위험한가(팩트) → 어떻게 다루는가(통제) → 더 보기(ChapterRef/SourceRef)" 순서의 3∼6문장.

## 단원 ↔ 안전 자료 매핑

| 단원 | 책 챕터 | OSHA |
|---|---|---|
| process-overview | 3(공정 전반)·4(클린룸)·5(웨이퍼) | Part 1A |
| equipment-parameters | 15(전자파)·14(화학물질)·3(정비) | Part 1B·4 |
| photo | 8(포토) | Part 2 |
| etch | 9(식각) | Part 2·3 |
| thin-film | 10(증착) | Part 3·4 |
| metallization | 10(증착)·14 | Part 3·4 |
| oxidation | 7(확산) | Part 3 |
| doping | 7(확산)·11(이온주입) | Part 3 |
| cmp | 12(CMP) | Part 2 |
| cleaning | 6(클리닝) | Part 2 |

## 검증

- `npm run build:cross-link` — hazards/chemicals 태그 통제 어휘 검증 (unknown → exit 1).
- `npm run typecheck` + `npm run lint` + `npm run build` (정적 export 성공).
- MDX 안전 규칙 수동 점검: 블록 컴포넌트 앞뒤 빈 줄, 리터럴 `<`·`{` 부재.

## 리스크

| # | 리스크 | 완화 |
|---|---|---|
| R-1 | 안전 서술의 사실 오류 (교육 콘텐츠 특성상 치명적) | 발췌 근거(파일:라인) 필수, 수치·물질명은 원문 대조 |
| R-2 | 안전 박스 과다로 교과서 본문 흐름 훼손 | 단원당 2∼5개 상한, 소주제와 직결된 것만 |
| R-3 | 책 챕터와 문체 충돌 | daegu 기존 해요체·Callout 관례 준수 |
