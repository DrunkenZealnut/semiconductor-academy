# Design — 「반도체 포토·에칭」(에이치앤지) 자료원 — 5대단원 15모듈

> **Feature**: `hs-photo-etch` · Plan: `docs/01-plan/features/hs-photo-etch.plan.md`
> 확정안(Plan §9 승계·승인): **15중단원 전량 편입 · 파일럿 "반도체 공정의 개요" · 장비 모델 일반화 특칙 · "장비 기술자의 눈" 각도 · 실습 압축+안전 전건 보존**

---

## 1. 아키텍처 확장 — 신규 인프라 없음

카테고리 공용 골격(3권째 실증) 그대로 재사용. 코드 신규 파일 **0개** — `sources.ts`·`schoolTextMdx.tsx`에 항목만 추가.

| 확장 지점 | 조치 |
|---|---|
| `SourceCategory 'hs-textbook'` | `HS_PHOTO_ETCH`에 태깅만 |
| 공용 라우트 `/sources/[source]/[module]` | `hs-photo-etch` 자료원 추가만 |
| `schoolTextMdx.tsx` REGISTRY | `'hs-photo-etch': {15개 모듈}` 블록 추가 |
| 홈 `SourcePicker` 교과서 그룹 | 무수정 (카드 5번째 자동 추가) |

## 2. Source 등록 (`sources.ts`)

```ts
/**
 * 반도체고 교과서 「반도체 포토·에칭」 — 포토·에칭 공정과 장비의 구조·운용·정비
 * (2015 개정 교육과정, 충청북도교육청 인정 2019-12-26). 원자료
 * data/school-text/20260415_163233_반도체_포토에칭_에이치앤지_/ 전면 재작성
 * (daegu 저작권 원칙 일괄). 원문 페이지 배치 정순.
 * ⚠️ 장비 모델(NSR-2205i11D·MARK-7·TE8500) 매뉴얼형 5개 중단원은
 * "장비 유형 일반화 특칙"(Design §4) 적용 — 조작 시퀀스 재현 금지.
 */
export const HS_PHOTO_ETCH: Source = {
  id: 'hs-photo-etch',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 포토·에칭',
  subtitle:
    '반도체고 교과서 — 포토·에칭 공정부터 트랙·스테퍼·에처 장비의 구조·운용·정비까지',
  attribution: '박기주 외 4인',
  publisher: '에이치앤지',
  license: 'fair-use',
  order: 8,
  accent: 'school',
  category: 'hs-textbook',
  sections: [ /* §3 표 순서대로 15개, 완성 모듈만 등록 */ ],
};
```

`SOURCES` 배열에 `HS_BASIC_TECH_2`(7) 다음으로 추가.

## 3. 섹션 전체 설계 — 15모듈 (원문 라인 경계 페이지 마커 대조 확정)

원문 정순(페이지 1→274 단조) — 재배열 불필요. 경계는 중단원 표제 헤딩 + `<!-- page: N -->` 마커(인쇄 페이지와 일치 확인)로 실측했다. 6957행 이후(찾아보기·참고문헌·판권)는 재구성 대상 아님(출처 메타만).

| # | id | title | group | 원문 라인 | RT | 비고 |
|:-:|---|---|---|---|:-:|---|
| 1 | `process-overview` | 반도체 공정의 개요 | 반도체 포토 공정 | 59~198 | 8 | **파일럿**. 8대 공정 흐름 속 포토·에칭의 자리 |
| 2 | `photo-process` | 반도체 포토 공정의 개요 | 반도체 포토 공정 | 199~689 | 14 | 감광액(PR)·HMDS·도포·노광·현상 — 파장·해상도 |
| 3 | `photomask` | 포토 마스크 공정 | 반도체 포토 공정 | 690~959 | 11 | 마스크 제작·종류(PSM)·OPC·펠리클 |
| 4 | `fab-cleanroom` | 반도체 공정실 및 설비 | 반도체 포토 공정 | 960~1078 | 9 | FAB 라인·에어샤워·방진복 — 청정도 관리 |
| 5 | `track-equipment` | 트랙 장비의 구조와 기능 | 포토 장비의 구조와 기능 | 1079~1566 | 13 | 코터·디벨로퍼·베이크와 웨이퍼 반송 |
| 6 | `exposure-equipment` | 노광 장비의 개요 | 포토 장비의 구조와 기능 | 1567~1727 | 9 | 얼라이너→스테퍼→스캐너 세대, 광원 |
| 7 | `stepper-structure` | NSR-2205i11D 장비의 구조와 기능 | 포토 장비의 구조와 기능 | 1728~2022 | 11 | **특칙** — 스테퍼 일반 구조(광원·레티클·투영렌즈·스테이지) |
| 8 | `track-operation` | MARK-7 장비의 운용 | 포토 장비의 운용 | 2023~2601 | 12 | **특칙** — 트랙 운용 개념(레시피·로트 흐름·알람) |
| 9 | `stepper-operation` | NSR-2205i11D 장비의 운용 | 포토 장비의 운용 | 2602~2879 | 10 | **특칙** — 스테퍼 운용(정렬·포커스·노광량) |
| 10 | `photo-practice` | 포토 장비 실습과제 | 포토 장비의 운용 | 2880~3195 | 10 | **압축** — 실습 3건(시너 필터·디벨로퍼 컵·현상 필터 교환, 번호 라벨 없음 — 2026-07-17 Do·Check에서 원문 전수 확정: '실습과제 2~5' 라벨은 원문 전체에 부재) |
| 11 | `etch-process` | 에칭 공정 | 에칭 공정 및 장비 | 3196~4362 | 16 | 최대 중단원(1,167줄) — 습식/건식·플라스마·가스별 특성. §4-5 내부 구성 |
| 12 | `etch-equipment` | 에칭 장비의 구성 요소 | 에칭 공정 및 장비 | 4363~5228 | 14 | 챔버·RF·진공·가스 계통 |
| 13 | `etcher-structure` | TE8500 장비의 구조 및 기능 | 에칭 장비의 운용 | 5229~5835 | 12 | **특칙** — 에처 일반 구조(로드락·프로세스 챔버·전극) |
| 14 | `etcher-maintenance` | TE8500 장비의 유지·보수 | 에칭 장비의 운용 | 5836~6412 | 12 | **특칙** — PM 사고방식(Daily/Weekly, 안전 절차) |
| 15 | `etch-practice` | 에칭 장비 실습과제 | 에칭 장비의 운용 | 6413~6956 | 10 | **압축** — 실습 7종(2026-07-17 Do에서 확정: 연번 ⑥~⑩ 5건 + 라벨 밖 2건 편입 — ① 장비 구성도 그리기·Upper Chamber 분해·조립. 제목 OCR 유실 추정분은 보류 원칙 적용) |

- readingTime 합계 **171분**. href 규칙 `/sources/hs-photo-etch/{id}/`. 등록 순서 = 목차 순서.
- #10·#15의 title은 원문 목차("실습과제")에 트랙 구분어를 더해 명확화("포토 장비 실습과제"/"에칭 장비 실습과제") — 두 모듈의 UI 구분을 위한 최소 보정(daegu 선례의 title 다듬기 허용 범위).
- 실습 번호는 권 전체 연번(Ⅴ.3에서 실습과제 6~10 확인 → Ⅲ.3이 1~5로 추정). Do에서 원문 확인 후 확정.

## 4. 콘텐츠 재구성 계약 (시리즈 계약 승계)

전역 컴포넌트(`LayeredExplain`·`Callout`·`Term`·`SourceRef`·`ChapterRef`·GFM 표) 재사용. MDX 안전 규칙(리터럴 `<`/`{` 금지, `~`→`∼`, 숫자 첨자 유니코드 ₁₂₃·화학식 CF₄ 표기, 코드·수식 규칙) 동일. 출처 footer:

```text
출처: 반도체고 교과서 「반도체 포토·에칭」(박기주 외 4인 지음, 에이치앤지) {단원}
'{중단원명}'을 근거로 전면 재작성했습니다. 원문 문장·도판은 사용하지 않았습니다.
```

### 이 권 특유 규칙

1. **장비 모델 일반화 특칙(FR-6 — #7·8·9·13·14 적용)**: 특정 모델의 버튼·화면 메뉴·조작 스텝 시퀀스("○○ 키를 누른다 → 화면에서 △△ 선택")를 재현하지 않는다. 재구성 3축 — ⑴ **장비 유형의 보편 구조**: 트랙(코터/디벨로퍼/베이크 모듈·웨이퍼 반송·스테퍼 인라인), 스테퍼(광원→레티클→투영렌즈→스테이지, 정렬·포커스), 에처(로드락·프로세스 챔버·상/하부 전극·진공 매니폴드·가스 계통) ⑵ **운용 개념**: 레시피, 인터록, 로트 흐름, 알람 대응, 정렬·노광량 보정 ⑶ **PM의 사고방식**: Daily/Weekly 주기, 소모품, 착수 전 안전 절차(진공 해제·가스 퍼지·전원 차단). 모델명(NSR-2205i11D·MARK-7·TE8500)은 "이 유형의 대표 사례" 수준 언급 — 페이지 title은 원문 유지하되 본문 서술은 일반 원리 중심. 표기는 **TE8500**으로 통일(원문 "TE 8500" 혼용 정리).
2. **"장비 기술자의 눈" 각도(FR-7)**: 공정 원리(감광·현상의 화학, 플라스마 물리)는 1~2문장 리마인더 + daegu·책 참조로 압축, 본문은 "장비가 원리를 어떻게 구현하고 무엇이 틀어지며 어떻게 지키는가"에 집중. daegu photo/etch와 중복 서술 금지.
3. **유해인자 연결 우선**: 감광액·HMDS·에칭 가스(CF₄·SF₆·Cl₂·HBr)·클린룸 대목에서 책 챕터(`ChapterRef` — ch8 포토리소그래피·ch9 식각)로 적극 연결. 화학물질 수치·물성은 원문 보존.
4. **실습 압축(#10·#15)**: book2 확정 규칙 — 대표 실습 1~2건 상세(목표→원리→절차 핵심→"이 실습에서 확인하는 것") + 나머지 변형 비교 GFM 표 전건 커버. **안전 유의사항 전건 보존**(대표 개별 + 통합 warning Callout; 실습 고유 항목 없으면 통합 단독 허용 — book2 §4-4 확장 조항). 평가 루브릭 표 미사용.
5. **#11 에칭 공정(최대 중단원) 내부 구성**: ①에칭의 언어(식각률·선택비·균일도·프로파일·언더컷) ②습식 에칭(용액·계면활성제·스컴) ③건식 에칭과 플라스마(물리/화학/RIE) ④가스별 특성(CF₄·SF₆·Cl₂·HBr — GFM 표) ⑤공정 파라미터(입력: RF·압력·가스·온도 / 출력: 프로파일·식각률·균일도·선택비·파티클) 5절 구성 권장 — 분할하지 않되 표 적극 활용.
6. **OCR 오식 대응**: `<mark>` 태그 오염·러닝 헤더 변형("ㅣ. 반도체" 등)·"이 이 이" 반복열 무시, 애매 구간 재구성 보류(시리즈 원칙).

## 5. cross-link 태깅 전략 (`hs-photo-etch/_links.json`) — 시리즈 최다

최소 태깅 원칙(본문 실증 기준) 유지하되, 이 권은 주제 자체가 통제 어휘와 정면 교차 — 아래는 **후보표**(Do에서 본문 언급 실증 후 확정, 미실증 시 제외):

| 모듈 | topics 후보 | chemicals 후보 |
|---|---|---|
| `process-overview` | `wafer-fab` | |
| `photo-process` | `photolithography`, `liquid-chemicals` | `hmds` |
| `photomask` | `photolithography` | |
| `fab-cleanroom` | `cleanroom`, `ppe` | |
| `track-equipment` | `photolithography`, `liquid-chemicals` | `hmds` |
| `exposure-equipment` / `stepper-structure` / `stepper-operation` / `photo-practice` | `photolithography` | |
| `track-operation` | `photolithography` | |
| `etch-process` | `etching`, `gas-safety`, `liquid-chemicals` | (Cl₂ 본문 실증 시 `chlorine`) |
| `etch-equipment` | `etching`, `gas-safety`, `engineering-controls` | |
| `etcher-structure` | `etching` | |
| `etcher-maintenance` | `etching`, `engineering-controls` | |
| `etch-practice` | `etching` | |

`photolithography`·`etching` 태그만으로 책(ch8·ch9)·daegu(photo·etch)·NCS(photo-equipment·mask-materials·lithography-materials 등)와 자동 상호 연결(기존 byTopic 인덱스 실측 9건+) — FR-8(6모듈+) 충분.

**직접 연결 매핑** (본문 인라인, Deep/tip Callout):

| 이 권 모듈 | 연결 대상 | 수단 |
|---|---|---|
| `process-overview` | daegu `process-overview`(공정 전체 흐름) | SourceRef |
| `photo-process` | daegu `photo` + 책 ch8(포토리소그래피 유해인자) | SourceRef + ChapterRef(order 8) |
| `etch-process` | daegu `etch` + 책 ch9(식각 유해인자) | SourceRef + ChapterRef(order 9) |
| `track-equipment`/`stepper-*` | ncs-semi `photo-equipment`(포토 장비 유지보수 직무) | SourceRef |
| `etcher-maintenance` | ncs-semi `vacuum-plasma-maintenance`·`chemical-gas-maintenance` | SourceRef |
| `fab-cleanroom` | (cross-link `cleanroom` 태그 자동 연결에 위임) | — |

→ FR-7 "3중 관점 4건"은 daegu 2건(SourceRef) + 책 2건(ChapterRef)으로 충족, NCS(FR-10)는 2건+.
기존 Process 페이지(`/process/*`)는 cross-link·SourceRef 대상이 아니므로 직접 연결하지 않는다(책 챕터가 유해인자 관점을 대표 — Plan FR-7의 "기존 Process" 연결은 ChapterRef+자동 연결로 갈음, 범위 명확화).

## 6. 검증 계획

- `typecheck` + `lint` + `build` — `/sources/hs-photo-etch/`(인덱스 5트랙) + 15모듈 SSG, 기존 5권·책·OSHA·NCS 회귀 0.
- `build:cross-link` 통제 어휘 검증(8 sources 예상), `quotes.json` 회귀 0.
- 렌더 실측: 홈 교과서 그룹 5번째 카드 · 파일럿 3단 레이어·footer·SourceRef/ChapterRef 동작 · 다크모드.
- 저작권 자가 점검: 원문 이미지 0 · 근접 패러프레이즈 기계 스캔(공백 정규화 25자, 시리즈 표준 — 사실 정보 허용/문장 재작성 판별) · 출처 표기 15/15.
- **조작 시퀀스 스캔(이 권 특유)**: #7·8·9·13·14에서 "버튼·키·화면 메뉴 조작 연쇄" 패턴 부재 확인(정성 점검) + 모델명이 사례 언급 수준인지 확인.
- 실습 커버리지: #10·#15 변형표가 원문 실습 전건(연번 1~10 추정)을 누락 없이 커버, 안전 항목 누락 0.

## 7. 구현 순서

1. `sources.ts`(`HS_PHOTO_ETCH` 등록, sections는 완성분만) → `schoolTextMdx.tsx`(REGISTRY) — 빌드 가능 상태 유지
2. 파일럿 `process-overview.mdx`(59~198행 — daegu·책 연결 각도 실증) → **검증 게이트**
3. 나머지 14모듈 병렬 서브에이전트(공통 스펙 파일, 시리즈 표준) — 6배치: Ⅰ잔여(#2~4) · Ⅱ(#5~7) · Ⅲ(#8~10) · **Ⅳ.1 단독(#11 — 최대 중단원)** · Ⅳ.2+Ⅴ.1(#12~13) · Ⅴ.2+Ⅴ.3(#14~15). 장비 특칙·실습 압축 규칙은 스펙 파일에 명문화
4. `_links.json`(§5 후보표의 본문 실증분) → `build:cross-link` → 검증 게이트(§6) 전체 + 렌더 실측
