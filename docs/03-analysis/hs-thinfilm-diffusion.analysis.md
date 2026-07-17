# Gap 분석 — hs-thinfilm-diffusion (Check)

> **Feature**: `hs-thinfilm-diffusion` · **분석일**: 2026-07-17 · **분석자**: gap-detector Agent + 오케스트레이터 종결 검증
> **기준**: `docs/02-design/features/hs-thinfilm-diffusion.design.md` §1~7
> **구현**: `src/lib/sources.ts`(HS_THINFILM_DIFFUSION) · `src/lib/schoolTextMdx.tsx` · `src/content/sources/hs-thinfilm-diffusion/`(MDX 8 + `_links.json`)

## 결과 요약

```text
┌──────────────────────────────────────────────────────┐
│  Design Match Rate: 100%  (기준 90% 통과 ✅)         │
├──────────────────────────────────────────────────────┤
│  검증 항목 34 · ✅ 34 · ⚠️ 0 · ❌ 0                  │
│  Gap: High 0 · Medium 0 · Low 1(맥락 대조로 종결)    │
│  Positive deviations: 7건                            │
└──────────────────────────────────────────────────────┘
```

최초 gap-detector 산출은 34항목 중 ⚠️ 1건(C5 모델명 빈도 — thinfilm-maintenance P-5000 4회·diffusion-equipment 합 4회로 설계 §4-⑵ "모듈당 2~3회 이내" 경미 초과)으로 **98.5%**였으나, 같은 세션에서 오케스트레이터가 출현 맥락을 전수 대조해 종결 검증했다:

- **thinfilm-maintenance 4회 분해**: 1회는 deep 레이어 원문 인용부(:24 — 인용 자구 보존 원칙 우선), 1회는 "교과서는 P-5000을 예로 들지만 … 비슷한 구조의 다른 장비에도 거의 그대로 적용"이라는 **일반화 선언 문장 그 자체**(:54). 본문 사례 서술은 3회로 기준 내.
- **diffusion-equipment 4회 분해**: 이 모듈의 대표 모델 TEL α-8은 3회로 기준 내. P-5000 1회(:78)는 "반면 박막 쪽 클러스터형 CVD(예: P-5000류)는 매엽식"이라는 **특칙 ⑶(배치식 vs 매엽식 학습 축) 이행 문장**으로, 트랙 간 대비를 위한 교차 언급이지 이 모듈의 사례 반복이 아님.
- **P3 선례 정합**: hs-photo-etch Check에서 NSR 4회·TE8500 3~5회를 "사례 수준" ✅로 판정한 선례와 같은 궤 — 특칙의 의도는 매뉴얼식 반복 방지이며, 두 건 모두 오히려 특칙 이행 과정에서 발생한 카운트다.

→ 무수정 승인, ⚠️→✅. Match Rate = (✅34×1) / 34 = **100%**

## 1. 항목별 매트릭스 (요약)

| Design 절 | 검증 항목 | 판정 | 비고 |
|---|---|:--:|---|
| §1·§2 | Source 11필드(id/kind/ko/title/subtitle/attribution 이재선 외 4인/publisher 에이치앤지/fair-use/order 9/school/hs-textbook) 설계값 일치 | ✅ ×4 | sources.ts:1417-1428, subtitle 자구 일치 |
| §1·§2 | sections 8개 목차 정순 · REGISTRY 8모듈 로더 · 신규 코드 파일 0(2파일 수정만) | ✅ ×3 | schoolTextMdx.tsx:94-111 |
| §3 | 8 MDX 존재 · id · title(원문 그대로, 실습은 트랙명 구분) · group 3트랙(2/3/3) · RT(12/9/15/13/11/11/14/11 합 96분) | ✅ ×5 | |
| §4 공통 | LayeredExplain 8/8 · footer 템플릿 8/8(단원·중단원 표기) | ✅ ×2 | |
| §4-⑴ | 터치스크린 메뉴·설정화면·버튼 시퀀스 재현 0 — "터치" 0건, 조작 연쇄 0, "화면에서"는 역할 서술만 | ✅ | 원문 다수 시퀀스(2177·2653·2778·4820·5357 등) 전량 추상화 |
| §4-⑵ | 모델명 표기 P-5000·TEL α-8 통일 — 비통일(P5000·ALPHA-805CN·α-8 단독·TEL ALPHA) 0건 · **빈도(맥락 대조 종결)** | ✅ ×2 | 최초 ⚠️ → 상단 분해 검증으로 해소 |
| §4-⑶ | 배치식 vs 매엽식 학습 축 — Ⅱ·Ⅲ 트랙 관통 명시 | ✅ | thinfilm-equipment:52-57 · diffusion-equipment:75-83 |
| §4-2 | 실습과제 단위 재구성(#5·#8) — 대표 상세+변형표 압축(박막 7표+대표 2·확산 6표+대표 2) · 본문↔실습 같은 소스 SourceRef 양방향 4건 · 안전 warning Callout(박막 3·확산 3) | ✅ ×3 | |
| §4 | 화학식 유니코드(SiH₄·NH₃·SiO₂ — ASCII 잔존 0) · OCR 오식("라크"·"콘텐서") 잔존 0 | ✅ ×2 | |
| §4-4 | ChapterRef — ch10(thinfilm-process 외 확대)·ch7(diffusion-process 외 확대) 실사용 | ✅ ×2 | |
| §4-5 | P3 권 간 SourceRef — etch-equipment·etcher-maintenance로 4모듈 연결 | ✅ | 설계(1모듈 명시) 초과 |
| §5 | _links.json topics 후보표 8/8 정합(본문 실증) · chemicals(silane·ammonia — TEOS DB 부재 제외 정확) · daegu 3건(FR-7) · 책 2+NCS 4+P3 4(FR-10 초과) · cross-link.json forward/reverse 엣지 생성 | ✅ ×5 | |
| 원문 대조 | 박막 실습 가~사 7/7 · 확산 실습 가~바 6/6 · 안전 유의사항 표본 무손실 | ✅ ×3 | §5 대조표 |

## 2. Gap 목록 — High/Medium 0 · Low 1(종결)

| # | 심각도 | 내용 | 조치 |
|---|:--:|---|---|
| Low-1 | Low | C5 모델명 빈도 — thinfilm-maintenance P-5000 4회·diffusion-equipment 합 4회로 "모듈당 2~3회 이내" 경미 초과 | ✅ **종결(무수정 승인)** — 출현 맥락 전수 분해: deep 인용 1·일반화 선언 1·특칙 ⑶ 대비 축 1을 제외하면 본문 사례 서술은 전 모듈 2~3회 기준 내. P3 선례(NSR 4·TE8500 3~5회 ✅)와 정합 |

❌ 없음.

## 3. Positive Deviations (설계 초과·개선)

1. **P3 권 간 연결 확대** — 설계 §4-5는 thinfilm-equipment→etch-equipment 중심 명시였으나, 박막·확산 equipment/maintenance 4모듈에 etch-equipment·etcher-maintenance 연결(시리즈 첫 권 간 연결의 실증 폭 확대)
2. **NCS 4종 연결** — thinfilm-precursor·thinfilm-diffusion-equipment·vacuum-plasma-maintenance·chemical-gas-maintenance — FR-10 "3+" 초과
3. **원문 밀착 구간까지 특칙 관철** — 원문의 터치 메뉴 시퀀스·오퍼레이션 조작 연쇄를 전량 추상화("서비스 화면에서 정비 모드로 전환", "평가 모드로 단계별 확인")
4. **모델명 정규화** — 원문 실습기기 표기 `TEL ALPHA-805CN`·`α-805`(4832·4962·5565행 등)를 `TEL α-8`로 통일
5. **P/T·THK 테스트 구조 정확 재구성** — 독립 실습으로 오인하지 않고 원문 참조 구조(2700·3118·3135행 — 라·마·바·사의 공통 검증 단계)대로 MFC·샤워헤드 실습의 검증 단계로 배치
6. **저작권 방어 문구** — thinfilm-equipment footer에 "특정 장비명(P-5000)은 대표 사례로만 사용" 명시
7. **ChapterRef 확대** — ch10을 박막 4모듈, ch7을 확산 2모듈에 배치(유해인자 연결 우선 원칙 강화)

## 4. 원문 실습 커버리지 대조표 (gap-detector 원문 직접 대조)

### 박막 실습 (원문 Ⅱ.3, 2131~3172행)

| 원문 표제(행) | MDX 커버 위치 | 판정 |
|---|---|:-:|
| 가. 챔버 벤트 점검 (2131) | §1 표 + §4 표(대표 절차) | ✅ |
| 나. 챔버 누출 점검 (2229) | §2 대표 상세(리크 체크) + §1 표 | ✅ |
| 다. 로드락 챔버 점검 (2294) | §4 표 | ✅ |
| 라. 샤워 헤드 교체 (2469) | §4 표(THK 테스트 포함) | ✅ |
| 마. 서셉터 교체 (2610) | §4 표 | ✅ |
| 바. 포라인 밸브 O-링 교체 (2732) | §4 표 | ✅ |
| 사. MFC 교체 (2883) | §3 대표 상세(격리→검증→교체→재검증) | ✅ |
| (P/T·THK 테스트 3118~ — 독립 실습 아님) | §3 MFC 검증②·§4 라 THK로 흡수 | ✅ |

### 확산 실습 (원문 Ⅲ.3, 4810~5576행)

| 원문 표제(행) | MDX 커버 위치 | 판정 |
|---|---|:-:|
| 가. 카세트 반송 (4818) | §1 표 + §4 표(평가 모드) | ✅ |
| 나. 오토셔터 분해·조립 (4947) | §2 대표 상세 | ✅ |
| 다. 매니폴드 주변 배관 분해·조립 (5018) | §4 표 | ✅ |
| 라. 아웃터 튜브 분해 (5104) | §3 대표 상세(지그·보트 엘리베이터) | ✅ |
| 마. 인너 튜브 분해 (5197) | §4 표 | ✅ |
| 바. WAFER PITCH SLIDER 웨이퍼 이동 (5316) | §4 표(티칭) | ✅ |

**안전 유의사항 표본 대조** — 확산 라(아웃터 튜브) 원문 4항목(5115-5120행: 2명 이상·히터 끄고 실온·석영 전용장갑·석영 파손 유의)이 diffusion-practice:117-122 warning Callout에 4항목 완전 보존. 확산 바의 "냉각 항목 없음"까지 :155에 정확 반영. 박막 공통 수칙(80℃ 벤트·부품 분실 방지·2인 1조)도 thinfilm-practice:156-170에 무손실.

## 5. 동적 검증 결과 (Check 단계 게이트 재실행 실측, 2026-07-17)

- typecheck 에러 0 · lint 신규 경고 0(기존 2건 — ExternalLink 미사용·Lightbox img, 이 feature 무관)
- `build:cross-link` — **9 sources · 126 sections · 780 bidirectional edges · unknown 0** (Do 기록과 정확히 일치)
- `extract:quotes` — 214 quotes(책 188 + OSHA 26), `quotes.json` HEAD 대비 diff 0(회귀 없음)
- cross-link.json — hs-thinfilm-diffusion forward 8모듈 + reverse 인덱스(engineering-controls 등)에서 P3·NCS 자동 연결 실증
- Do 단계 게이트(build 242페이지 SSG·렌더 스모크 8/8·인덱스 3트랙·홈 6번째 카드)는 Do 기록 승계 — Check에서 코드·산출물 무변경 확인

## 6. 판정 및 권고

**Match Rate 100% → iterate 불필요, Report 진행.**

- 매트릭스 34항목 전부 ✅ (Low-1은 출현 맥락 전수 분해로 같은 세션 내 종결).
- 시리즈 계약(특칙 강화판·실습과제 단위 재구성·권 간 연결)이 4권 연속 유효 — P5(조립·검사) 이후 권에 동일 재사용 권장.
- 다음 단계: `/pdca report hs-thinfilm-diffusion`

## 참고 문서

- Plan: `docs/01-plan/features/hs-thinfilm-diffusion.plan.md`
- Design: `docs/02-design/features/hs-thinfilm-diffusion.design.md`
- 선례: `docs/03-analysis/hs-photo-etch.analysis.md`(100%) · `hs-basic-tech-2.analysis.md`(100%)
