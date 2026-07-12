# Design — 챕터 원문 충실 재작성: 콘텐츠 계약 & 작업 스펙

> **Feature**: `chapters-source-fidelity` · Plan: `docs/01-plan/features/chapters-source-fidelity.plan.md`
> 이 문서는 챕터 재작성 작업자(서브에이전트)가 그대로 따라야 하는 **실행 스펙**이다.

---

## 0. 경로 (절대 혼동 금지)

| 용도 | 경로 |
|------|------|
| **원문 읽기** (읽기 전용) | `/Users/zealnutkim/DEV/SemiconductorAcademy/data/` — 메인 체크아웃. gitignore라 워크트리에 없음 |
| **모든 쓰기 작업** | `/Users/zealnutkim/DEV/SemiconductorAcademy-chapters-rewrite/` — 워크트리 (브랜치 `feat/chapters-source-fidelity`) |
| 재작성 대상 MDX | `<워크트리>/src/content/chapters/{챕터파일}.mdx` |
| 이미지 + credits | `<워크트리>/public/source-images/ch{N}/` |
| **정본 예시** (필독) | `<워크트리>/src/content/chapters/12-cmp.mdx` — 파일럿, 이 스타일을 따를 것 |

메인 체크아웃의 `src/`, `docs/`, `public/`은 **절대 수정 금지** (다른 작업의 미커밋 변경이 있음).

## 1. 챕터 ↔ 원문 매핑

원문 파일 (모두 `/Users/zealnutkim/DEV/SemiconductorAcademy/data/` 하위):

- **F1** = `20260526_185841_반도체산업의유해인자_에피스테메_-_13/20260526_185841_반도체산업의유해인자_에피스테메_-_13.md`
- **F2** = `20260526_215845_반도체산업의유해인자_에피스테메_-_47/20260526_215845_반도체산업의유해인자_에피스테메_-_47.md`
- **F3** = `20260527_132608_반도체산업의유해인자_에피스테메_-811/20260527_132608_반도체산업의유해인자_에피스테메_-811.md`
- **F4** = `20260527_154313_반도체산업의유해인자_에피스테메_-_toend/20260527_154313_반도체산업의유해인자_에피스테메_-_toend.md`

| 챕터 | MDX 파일 | 원문 | 행 범위 | 책 페이지 | 특이사항 |
|---|---|---|---|---|---|
| 1 | 01-risks-of-new-tech | F1 | 248∼383 | 15∼26 | F1 1∼247행은 표지·목차 — 무시 |
| 2 | 02-semiconductor | F1 | 384∼608 | 27∼43 | |
| 3 | 03-process-overview | F1 | 609∼690 | 45∼54 | |
| 4 | 04-cleanroom | F2 | 6∼159 | 55∼65 | |
| 5 | 05-wafer | F2 | 160∼380 | 67∼83 | 챕터 제목 헤딩이 OCR로 소실 — `## 1 반도체 제조 공정 개요`부터 웨이퍼 챕터임 |
| 6 | 06-cleaning | F2 | 381∼599 | 85∼99 | 제목 헤딩 `# - 쇼정동 (정凤)님녀들 유해인자`는 "클리닝 공정과 유해인자"의 OCR 오류 |
| 7 | 07-diffusion | F2 | 600∼742 | 101∼110 | |
| 8 | 08-photolithography | F3 | 6∼810 | 111∼157 | 최대 분량 챕터. 표 8-1/8-2(PR 성분 35종) 포함 |
| 9 | 09-etching | F3 | 811∼1128 | 159∼181 | |
| 10 | 10-deposition | F3 | 1129∼1294 | 183∼193 | |
| 11 | 11-ion-implantation | F3 | 1295∼1445 | 195∼205 | 제목이 `## 이온 주입과 유해인자` (## 레벨) |
| 13 | 13-packaging | F4 | 104∼774 | 217∼261 | 대분량. 삽입 실장/표면 실장 세부 공정 다수 |
| 14 | 14-chemicals-usage | F4 | 775∼1026 | 263∼281 | 표 14-4/14-5 등 표 밀도 높음 |
| 15 | 15-electromagnetic | F4 | 1027∼1396 | 283∼303 | 노출기준 표(ICNIRP/ACGIH 등) 정확성 필수 |
| 16 | 16-occupational-disease | F4 | 1397∼1792 | 305∼317 | 말미 참고문헌 리스트(약 1750행∼)는 수록하지 않음 |

(12번 CMP는 파일럿으로 완료, 17번은 원문 미추출로 제외)

## 2. 작업 절차 (순서대로)

1. **원문 읽기**: 자기 챕터 행 범위 전체 (Read offset/limit 또는 Bash sed).
2. **현행 MDX 읽기**: 워크트리의 자기 챕터 파일. 좋은 비유·검증된 인용·이미지 배치는 **재사용 우대**.
3. **정본 예시 읽기**: `12-cmp.mdx` (스타일·구조·인용 밀도의 기준).
4. **기존 이미지 검증**: `public/source-images/ch{N}/`의 각 `.jpg`를 **Read로 열어 실제 내용 확인**.
   현행 MDX 캡션·`_credits.json`과 실제 그림이 다르면 **원문 그림 번호 기준으로 교정** (ch12 파일럿에서 2장 모두 잘못돼 있었음 — 의심하고 볼 것).
5. **재작성 MDX 작성** (Write, 워크트리).
6. **자가 점검**: 아래 체크리스트 전 항목.
7. **보고**: §8 형식.

## 3. 콘텐츠 계약 (빌드·추출 스크립트가 의존 — 위반 시 빌드 실패)

### 3.1 LayeredExplain — 문서 최상단, 정확히 1개, self-closing

```mdx
<LayeredExplain
  hook="한 줄 훅 (문자열)"
  easy={{
    analogy: (
      <p>중고생 눈높이 비유. <strong>강조</strong>와 <Term id="...">용어</Term> 사용 가능.</p>
    ),
  }}
  deep={{
    sourcePage: 208,
    sourceSection: 'N장 - 섹션 라벨',
    quote: (
      <>
        <p>원문 직인용 첫 문단…</p>
        <p className="mt-2">둘째 문단…</p>
      </>
    ),
  }}
/>
```
- `deep.quote`는 반드시 괄호 `( JSX )`로 감싼다. `sourcePage`는 숫자, `sourceSection`은 작은따옴표 문자열 (내부에 `'` 금지).

### 3.2 SourceQuote — 원문 직인용 (챕터당 6∼12개, 원문 밀도 비례)

```mdx
<SourceQuote page={210} section="2. 슬러리 - 정의와 특성">
  <p>원문 문장… <strong>핵심 강조</strong>…</p>
  <p className="mt-2">다음 문단…</p>
</SourceQuote>
```
- `page={숫자}`, `section="큰따옴표 문자열"` (내부에 `"` 금지). 접기/펼치기 UI로 렌더되므로 길어도 됨.
- 열거는 `<p>• 항목</p>` 형태 (파일럿 참조).

### 3.3 기타 컴포넌트 (등록된 것만, import 불필요)

| 컴포넌트 | 시그니처 | 비고 |
|---|---|---|
| `Callout` | `<Callout type="info|warning|tip|source" title="…">본문</Callout>` | 이 4가지 type만 |
| `Term` | `<Term id="…">표시 텍스트</Term>` | id ∈ semiconductor, wafer, photoresist, cleanroom, ingot, doping, plasma, mask, etching, deposition, cmp, precautionary-principle, msds, iarc-1, emf |
| `ChemicalCard` | `<ChemicalCard id="…" />` | id ∈ benzene, arsine, phosphine, diborane, hydrofluoric-acid, hydrogen-peroxide, isopropyl-alcohol, pgmea, tmah, hmds, chlorine, fluorine, silane, ammonia, tungsten-hexafluoride, boron-trifluoride, silica-slurry, ceria-slurry, lead, epoxy-resin, solder-flux, trichlorosilane, arsenic, ethylene-glycol-ether, antimony-trioxide, boron-tribromide, phosphorus-oxychloride, dichlorosilane, ozone, sulfuric-acid |
| `HazardBadge` | `<HazardBadge type="…" />` | type ∈ carcinogen-1, carcinogen-2a, reproductive-toxin, mutagen, corrosive, acute-toxic, sensitizer |
| `ChapterRef` | `<ChapterRef order={13} />` | 챕터 참조 링크 |
| `ImageFigure` | `<ImageFigure src="/source-images/chN/…" alt="…" caption="…" source="「반도체 산업의 유해인자」 p.N" maxWidth={520} />` | maxWidth 생략 시 600 |
| `ProcessDiagram` | `<ProcessDiagram activeId="…" variant="compact" />` | 공정 챕터(5∼13)만. activeId ∈ wafer, cleaning, diffusion, photolithography, etching, deposition, ion-implantation, cmp, packaging |

### 3.4 하우스 스타일

- 본문 해설: 존댓말 "∼해요" 체. 원문 인용(SourceQuote/deep.quote): 원문 문어체 그대로.
- 표 출처 각주: `<p className="text-xs italic text-slate-500">출처: 「반도체 산업의 유해인자」 표 N-M (p.NNN)</p>`
- 섹션 헤딩: `## 1. 제목` / `### 가. 소제목` (원문 절 구조 반영).
- 마지막: `---` + `다음: <ChapterRef order={N+1} />` (ch16은 17로).
- 공정 챕터(5∼13)는 말미에 `[공정명 자세히 보기 →](/process/{slug}/)` 링크 유지.

## 4. MDX 안전 규칙 (파서 오류 방지)

1. 리터럴 `<`, `>`, `{`, `}` 금지 — 부등호는 한글("이상"/"미만")이나 `&lt;` `&gt;`, 중괄호는 쓰지 않기.
2. `~` 금지 → `∼` (물결 범위). 예: `15∼30년`.
3. 화학식 아래첨자는 유니코드: SiO₂, H₂O₂, Al₂O₃, Si₃N₄, CeO₂, Fe(NO₃)₃, KNO₃, ℃.
4. JSX 내부 강조는 `<strong>`, 마크다운 문단에서는 `**…**`.
5. `<!-- -->` HTML 주석 금지 (주석 자체를 넣지 말 것).
6. JSX 블록과 마크다운 사이 빈 줄 필수.
7. 대괄호 직후 여는 괄호 `[…](…)`는 링크 문법 — 의도치 않게 만들지 말 것 (원문의 "[그림 N-M]" 인용 시 대괄호 제거 권장).

## 5. 페이지 번호 계산

- 원문에 `<!-- page: N -->` 마커가 있음 (추출 배치 상대 번호).
- **오프셋 = (챕터 시작 책 페이지) − (챕터 제목 근처 마커 N)**. 챕터 시작 책 페이지는 §1 표의 범위 시작값.
  - 참고 실측: F4는 +206 (책 자체 참조 "210쪽 [그림 12-2]"로 검증). F3 ≈ +110, F2 ≈ +54, F1 ≈ +5∼6 (각자 자기 챕터에서 재검증).
- 모든 `sourcePage`/`page`/캡션의 p.N은 **자기 챕터 책 범위 내 + 본문 진행에 따라 단조 증가**해야 함.
- **기존 MDX의 페이지 번호는 구(舊) 매핑이라 부정확할 수 있음** — 새로 계산한 값을 우선.

## 6. 콘텐츠 원칙

1. **커버리지가 제1 목표**: 원문의 모든 절(`## 1`, `가.` `나.` 수준)과 표·그림 언급·연구 결과를 빠짐없이 반영. 원문에 있는데 MDX에 없는 내용 = 결함.
2. 수치·단위·화학물질명·연구 인용(저자, 연도, %)은 원문 그대로. 임의 보정·창작 금지. **원문에 없는 사실 추가 금지.**
3. 3단 구조 유지: Easy(본문 해설, 비유) ↔ Deep(SourceQuote 직인용) 분리. 어려운 개념일수록 Easy 층을 성실하게.
4. 표는 GFM 표로 재현하고 원문 표 번호를 명시. 셀 수치 검산.
5. OCR 오탈자는 인용 시 명백한 것만 교정(붙어쓰기, "새로 유"→"새로운" 류). 문장이 심하게 깨졌으면 그 문장은 인용하지 말고 온전한 문장을 선택.
6. 챕터 말미 참고문헌(References) 목록은 수록하지 않음.
7. 분량 가이드: 원문 150행 이하 → MDX 250∼350행 / 원문 150∼400행 → 350∼500행 / 원문 400행 초과 → 500∼700행. 채우기용 수사 금지 — 밀도로 승부.
8. 기존 MDX의 잘 쓴 비유·Callout·크로스 링크(ChapterRef)는 유지·개선. 기존 SourceQuote 인용문은 원문과 대조 후 페이지만 교정해 재사용 가능.

## 7. 이미지 규칙

1. 기존 `public/source-images/ch{N}/` 이미지는 **전부 계속 사용** (삭제 금지).
2. 각 이미지를 열어보고 캡션 불일치 시 교정: MDX 캡션 + `_credits.json`의 caption/page/source 동기화.
3. 신규 이미지는 **선택 사항, 챕터당 최대 2장**: 원문에서 그림 번호·캡션이 명확하고, `data/…/_page_X_(Figure|Picture)_Y.jpeg`를 Read로 열어 내용을 확인한 경우만.
   - 복사: `cp <메인체크아웃 data 경로>/_page_X_Figure_Y.jpeg <워크트리>/public/source-images/ch{N}/fig-{N}-{M}-{영문슬러그}.jpg`
   - `_credits.json`에 항목 추가 (기존 포맷 준수).
4. 확신이 없으면 신규 추가하지 않는다 (잘못된 그림 매칭은 무이미지보다 나쁨).

## 8. 금지사항 & 보고 형식

**금지**: 다른 챕터 MDX·코드(`src/lib`, `src/components`)·`src/data/*.json`·`chapters.json`·메인 체크아웃 수정, `npm run extract:quotes` 실행(전역 산출물 경합), `data/` 원본 수정.

**최종 보고** (마지막 메시지, 이 형식 그대로):

```
챕터: NN {제목}
줄수: {이전} → {이후}
LE: 1 / SQ: {개수}
페이지 오프셋: +{N} (근거: 마커 {M} = 책 p.{P})
원문 커버리지: {원문 절 번호·제목 나열, 각각 반영 위치. 누락 시 사유}
이미지: 유지 {M}장 / 캡션 교정 {K}장 / 신규 {J}장
제안 readingTime: {N}분
특이사항: {OCR 문제, 판단 사항}
```
