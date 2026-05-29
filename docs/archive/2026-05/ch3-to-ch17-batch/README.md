# Archive: ch3-to-ch17-batch

> 17 챕터 책 사이트 완주 milestone — 「반도체 산업의 유해인자」 (윤충식 외, 에피스테메)

**Archived**: 2026-05-29
**Phase**: completed
**Match Rate**: 96% (3 sub-batch 평균)
**Iteration**: 0 (모든 sub-batch)
**Total Duration**: ~8.5h (당초 22.5h 추정 대비 62% 단축)
**Total Chapters**: 15 (Ch.3∼Ch.17)

---

## Sub-batch 구성

| Sub | 챕터 | 시간 | Match Rate | Status |
|:---:|------|:---:|:---:|:---:|
| A | Ch.3∼4 (foundation) | 2.5h | 96% | ✅ archived separately |
| B | Ch.5∼13 (light, 9) | 3h | 98% | ✅ archived separately |
| C | Ch.14∼17 (reflection, 4) | ~3h | 95% | ✅ archived separately |

각 sub-batch의 상세 plan/design/analysis/report는 별도 archive 또는 `docs/{01-plan,02-design,03-analysis,04-report}/`에서 확인.

---

## 자산 합계

| 항목 | 수량 |
|------|:---:|
| 챕터 MDX | 15 (Ch.3∼Ch.17) |
| 책 페이지 이미지 | 44장 (Fair use) |
| `_credits.json` | 15개 |
| 자체 제작 표 | 21개 |
| SourceQuote | 23개 (모두 ≤ 150자) |
| Callout | 57개 |
| 신규 컴포넌트 | 0 (Ch.1·Ch.2 인프라 재사용) |

---

## 핵심 학습

1. **묶음 효율과 적정선** — 단일 챕터(1.5∼3h) → 소묶음 A(1.25h/챕터) → 대묶음 B(0.33h/챕터) → 소묶음 C medium(0.75h/챕터). **콘텐츠 성격(light/medium/deep)** 이 묶음 크기보다 시간에 더 큰 영향.
2. **인프라 재사용** — 신규 컴포넌트 0, 신규 인프라 0으로 7 사이클 중 6 사이클 진행. 가장 큰 가속 요인.
3. **저작권 정책 진화** — Ch.16 민감 영역(역학조사)에서 회사명·인명·소송 0건 grep 검증으로 정책 강화.
4. **gap-detector 검증 필요** — C 사이클에서 false negative (credits 누락 오인). 모든 사이클에 직접 검증 단계 필요.

---

## 커밋 히스토리

| 커밋 | Sub-batch |
|------|:---:|
| `50e0231 + 7d65cc9` | A — Ch.3+Ch.4 + analysis/report |
| `3913a90 + 16b3926` | B — Ch.5∼Ch.13 + analysis/report |
| `b9d0789 + bf227d9` | C — Ch.14∼Ch.17 + analysis/report (완주) |

---

## 라이브 URL

- 사이트: https://drunkenzealnut.github.io/semiconductor-academy/
- 챕터: `/chapter/<slug>-chapter/` (15 챕터)
- 공정: `/process/<name>/` (9 공정)
- 화학물질: `/chemicals/<id>/` (31 물질)

---

## 참고

- 원본: 「반도체 산업의 유해인자」 윤충식·김승원·박동욱·정지연·최상준·하권철·함승헌 저, 에피스테메
- Archive 시점: 2026-05-29
- 본 archive는 batch parent 메타 보존용. 각 sub-batch의 상세는 별도 archive 또는 활성 docs 폴더 참조.
