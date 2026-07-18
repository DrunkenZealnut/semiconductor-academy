# Gap 분석 — hs-equipment-maintenance (Check)

> **Feature**: `hs-equipment-maintenance` · **분석일**: 2026-07-18 · **분석자**: gap-detector Agent + 오케스트레이터 동적 검증
> **기준**: `docs/02-design/features/hs-equipment-maintenance.design.md` §1~7 · `docs/01-plan/features/hs-equipment-maintenance.plan.md` §6·§10
> **구현**: `src/lib/sources.ts`(HS_EQUIPMENT_MAINTENANCE, order 11) · `src/lib/schoolTextMdx.tsx`(REGISTRY 14) · `src/content/sources/hs-equipment-maintenance/`(MDX 14 + `_links.json`)

## 결과 요약

```text
┌──────────────────────────────────────────────────────┐
│  Design Match Rate: 96%  (기준 90% 통과 ✅)          │
├──────────────────────────────────────────────────────┤
│  판정 A~E 전건 Match · FR-1~10 전건 · DoD 10/10       │
│  Gap: P0 0 · P1 0 · P2 3                              │
│  Positive deviations: 5건                            │
└──────────────────────────────────────────────────────┘
```

정적 대조(gap-detector: 14 MDX 전수 + `_links.json`·등록·로더·schema-enum·chemicals.json·교차참조 대상 실재)와 동적 검증(오케스트레이터: 빌드 게이트 전량 재실행)을 합산했다. 빌드계열 무오류로 **P0(정합 깨짐) 0건이 확정**되었고, P1(FR 미달)도 0건이다. 감점은 P2 품질 3건 — 최대 감점 항목은 **G-1(크라이오 펌프 냉각 온도 모듈 간 모순, NFR-5 정확성 경계)** 이었다. **3건 모두 2026-07-18 수정 완료(§3·§6 참조) → 잔여 Gap 0·실질 100%.**

## 1. 항목별 매트릭스 (Design/Plan 기준)

| 기준 절 | 검증 항목 | 판정 | 근거 |
|---|---|:--:|---|
| Design §2 | Source 11필드 — id/kind/ko/title/subtitle/attribution `왕현철 외 3인`/publisher `충남반도체마이스터고등학교`/`fair-use`/order 11/`school`/`hs-textbook` | ✅ | sources.ts:1621-1633, Design §2 완전 일치 (R-1 판권 해소 반영) |
| Design §3 | sections 14 정순 · REGISTRY 14 로더 · slug/group/RT 3자 일치 · 신규 코드 0(2파일 수정만) | ✅ | sources.ts:1634-1747 · schoolTextMdx.tsx:138-167 |
| Design §3 | 14 MDX 존재 · 5트랙(장비산업1/공정3/요소4/설계3/관리3) | ✅ | 파일 목록 14/14 |
| Design §4 공통 | LayeredExplain(Hook→Easy→Deep) 14/14 · 출처 footer 14/14 · 원문 이미지 0 | ✅ | grep LayeredExplain 14, footer "왕현철 외 3인" 14 |
| Design §4-#1 | 조작 시퀀스 재현 0 — 절차형 버튼→화면 서술 부재 | ✅ | "버튼" 2건은 EMO 안전설계·사양표(계약 허용) |
| Design §4-#2 | Ⅱ 공정장비(#2~#4) 연결 위임 — 신규 서술 최소·SourceRef/ChapterRef 위임 | ✅ | process-* 3모듈이 "원리는 위임, 정비 관점만" 명시 실행 |
| Design §4-#3 | Ⅲ 요소·Ⅴ 관리(#5~8·#12~14) 신규 콘텐츠 집중 | ✅ | 진공·가스·플라스마·TPM/PM/BM/SEMI 3단 신규 재구성 |
| Design §4-#5 | 안전축 "정지 상태 정비 안전" · 원문 부재 항목 창작 금지 | ✅ | LOTO·인터로크·비상정지·안전PLC·SEMI S2/S8 실증 / 고소·밀폐공간·질식·MSDS grep 0 (창작 0) |
| Design §4-#6 | OCR 노이즈 정제 | ✅ | 🚺·교등학교·확습·딘원·바도치 잔존 0 |
| Design §5 | cross-link 태깅 — topics/hazards/chemicals 본문 실증 · 통제어휘 유효 · 교차참조 대상 실재 | ✅ | schema-enum 전건 유효, chemicals 4종 실존, dead-link 0 |
| Plan §6 | FR-1~FR-10 (아래 §2 상세) | ✅ | 전건 충족, FR-7·8·9 초과 |
| Plan §10 | DoD 10항목 | ✅ | §4 동적 검증으로 빌드계열 포함 전건 |

## 2. FR별 상세

| FR | 요구 | 실측 | 판정 |
|---|---|---|:--:|
| FR-1 | order 11 등록·홈 그룹·인덱스 노출 | sources.ts:1631 + SOURCES 편입, 8번째 교과서 카드 | ✅ |
| FR-2 | 5트랙 그룹 렌더(무수정) | 장비산업동향/공정장비/요소기술/설계기술/장비관리 | ✅ |
| FR-3 | 14모듈 MDX + 공용 라우트 SSG | REGISTRY 14/14, build 270p SSG | ✅ |
| FR-4 | 3단 레이어·이미지 0·전면 재작성 | 14/14 + footer "원문 도판 미사용" | ✅ |
| FR-5 | 출처 표기(왕현철 외 3인·충남반도체마이스터고) | 14/14 footer 동일 문구 | ✅ |
| FR-6 | 장비 조작 특칙(시퀀스 재현 0) | 절차형 조작 0 | ✅ |
| FR-7 | NCS 장비 트랙 교차 4건+ | **24건 / 16개 고유 섹션**(equipment-safety 4·equipment-quality-control 3·optical-equipment-maintenance·vacuum-plasma-maintenance 등) | ✅ 초과 |
| FR-8 | P3·P4·P5 권 간 + 책 ChapterRef 4건+ | 권 간 18건(P3×5·P5×4·P4×3·P1×2·P2×2·daegu·basics) + 책 ChapterRef 16건(ch5~14) | ✅ 초과 |
| FR-9 | 정비 유해인자 4모듈+ | **7모듈** — vacuum-gas·pneumatic-thermal·by-type(hazards) + etch·frontend·setup·process-wafer(gas-safety) | ✅ 초과 |
| FR-10 | "정지 상태 정비 안전" 축 + 안전 서술 전건 보존 | LOTO 전 관리 모듈 관통·인터로크 3계층·EMO 직렬·안전PLC(IEC 61508) | ✅ |

## 3. Gap 목록 — P0 0 · P1 0 · P2 3

| # | 심각도 | 위치 | 내용 | 조치 |
|---|:--:|---|---|---|
| **G-1** | P2 | `element-vacuum-gas.mdx:63` ↔ `maintenance-by-type.mdx:72,76` | **크라이오 펌프 냉각 온도 모듈 간 모순** — 같은 부품을 "영하 260℃ 이하"(element) vs "영하 196℃ 이하 / 액체 질소에 버금가는"(by-type)으로 서술. 기술적으로 크라이오 2단 콜드헤드는 −253~−263℃(약 20K)라 260℃ 쪽이 정확하고, 196℃는 액체질소(LN₂ −196℃) 값과 혼동한 서술. 교차 열람 시 모순(NFR-5 정확성 경계) | **✅ 2026-07-18 수정 완료** — `maintenance-by-type.mdx:72,76`을 `element-vacuum-gas`(−260℃ 이하)에 통일, 비유를 "액체 질소(영하 196℃)보다도 낮은 극저온"으로 정확화(196℃는 LN₂ 기준점으로만 잔존). build 재검증 통과. ※Do `pendingDecisions`·gap-detector 이중 확인 사안이었음 |
| G-2 | P2 | `design-concept-mechanical.mdx:131` | 사양표에 상용 모델명(`XGP-ACF1`=LS ELECTRIC PLC·`GOT2000`=Mitsubishi HMI) 노출 — 계약 #7 제조사 스펙 재현 경계. 단 :121 "예시 사양일 뿐" 헤지 존재로 경감 | **✅ 2026-07-18 수정 완료** — 모델명 → "산업용 PLC / 터치패널 HMI" 일반화(제조사 특정 제거, 표준 규격 항목 13.56 MHz·RG214·NW25 등은 유지). build 재검증 통과 |
| G-3 | P2 | `_links.json` maintenance-by-type·maintenance-setup | Design §5 note의 `industrial-hygiene` 미태깅(by-type)·`gas-safety`로 대체(setup) — **본문 실증 판단**이나 설계 표와 편차 | **✅ 2026-07-18 수정 완료** — by-type:149-153 무분진 복장·IPA·세정 화학물질 위해(ch14) 실증 근거로 topics에 `industrial-hygiene` 추가(cross-link topics 310→311·edges 854→857·unknown 0). setup은 gas-safety 실증으로 무수정 유지(Design §5 note "본문 실증 시 확정" 부합) |

❌(P0/P1) 없음. **G-1·G-2·G-3 전건 2026-07-18 수정 완료 → 잔여 Gap 0**(실질 100%). 각 수정 후 build 재검증 통과(온도 통일·모델명 일반화·태깅 추가 모두 게이트 무오류).

## 4. 동적 검증 결과 (Check 게이트 재실행 실측, 2026-07-18)

오케스트레이터가 빌드계열 전량 재실행 — gap-detector 정적 대조 범위 밖:

- **typecheck** 에러 0 · **lint** 에러 0(exit 0)
- **`build`** exit 0 — 270p SSG, hs-equipment-maintenance 14/14 모듈 HTML 생성
- **`build:cross-link`** — **11 sources · 152 sections · 857 bidirectional edges · unknown 0** (topics 311·hazards 142·chemicals 119 tagged, 미등록 어휘 경고 0) — G-3 태깅 반영 최종값
- **`quotes.json`** — HEAD 대비 diff 0(회귀 없음)
- **통제어휘 정합** — `_links.json` topics/hazards 전건 schema-enum 유효, chemicals 4종(hmds·hydrofluoric-acid·chlorine·epoxy-resin) chemicals.json 실존
- **코어 무수정(NFR-4)** — 변경 추적 파일은 sources.ts·schoolTextMdx.tsx(의도된 등록)·cross-link.json(빌드 산출물)뿐, 기존 10자료원·공용 라우트·컴포넌트 무변경

## 5. Positive Deviations (설계 초과·개선)

1. **교차참조 밀도 시리즈 최다 실증** — NCS 16섹션·P1~P5 전권·책 ch5~14를 dead-link 0으로 연결. 로드맵 §5.3 P6 비고 "NCS 장비 트랙과 강한 교차"를 수치로 이행(FR-7 24건 = 목표 4건의 6배).
2. **안전축 모범** — `maintenance-by-type`이 LOTO를 5장비 공통 첫 절차로 관통, `design-electrical`이 인터로크 3계층·EMO 직렬·안전PLC(IEC 61508)까지 "정지=안전" 일관 서술.
3. **hazard 태깅이 과태깅 아닌 본문 실증 가산** — `element-vacuum-gas`가 pyrophoric(포스핀 자연발화)·toxic(아르신)·oxidizer(O₂)·cryogenic 5종 전부 본문 근거 보유. Design 표(2종)를 넘는 가산이 정당(시리즈 "본문 실증만 태깅" 원칙 준수).
4. **OCR 정제·계약 준수 완결** — 이모지 원문자·오식 잔존 0, 원문 부재 항목(고소·질식·PPE·MSDS) 창작 0, 조작 시퀀스 재현 0.
5. **위임 각도 정확** — `process-*` 3모듈이 "공정 원리는 책·P3~P5로 위임, 장비 하드웨어·정비 관점만 서술"이라는 계약 #2를 텍스트에서 명시적으로 실행(정체성 약화 리스크 R-3 해소).

## 6. 판정 및 권고

**Match Rate 96% → 기준 90% 통과, iterate 불필요, Report 진행 적합.**

- 판정 A~E 전건 Match, FR-1~10 전건(FR-7·8·9 초과), DoD 10/10, 빌드 게이트 무오류.
- **G-1·G-2·G-3 전건 반영 완료**(2026-07-18): ① 크라이오 온도 두 모듈 −260℃ 통일·비유 정확화, ② design-concept 모델명 → "산업용 PLC / 터치패널 HMI" 일반화, ③ maintenance-by-type `industrial-hygiene` 태깅 추가. 각 수정 후 build 재검증 통과, **잔여 Gap 0** → **Report 진행 준비 완료**.
- 시리즈 계약(특칙·연결 위임·본문 실증 태깅)이 8권 카테고리에서 유효 — 마지막 신규 권으로 "장비 자체의 요소기술·설계·유지보수" 직교 축 완성.
- 다음 단계: `/pdca report hs-equipment-maintenance`

## 참고 문서

- Plan: `docs/01-plan/features/hs-equipment-maintenance.plan.md`
- Design: `docs/02-design/features/hs-equipment-maintenance.design.md`
- 선례: `docs/03-analysis/hs-thinfilm-diffusion.analysis.md`(100%) · `docs/archive/2026-07/hs-assembly-inspection/analysis.md`(P5, 100%)
