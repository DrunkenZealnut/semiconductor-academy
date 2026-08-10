# Baseline — first-semiconductor 97모듈 자수 고정

> **Feature**: `diagram-component-set` · **측정일**: 2026-08-09
> **용도**: 표를 도해로 대체한 뒤에도 §5.1 자수 기준을 재현 가능하게 판정하기 위한 **대체 전 기준값**.
> Design `diagram-component-set.design.md` §7이 지정한 아티팩트다.

---

## 측정 방법

선행 사이클 Design §5.1과 동일 — 공백·JSX 마크업(태그·prop 이름·`{' '}`)·마크다운 기호(`|` `#` `*` 표 구분선)를 **모두 제외한 문자 수**.

```js
raw
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')   // JSX 주석
  .replace(/<[^>]+>/g, ' ')                  // 태그
  .replace(/\{'\s*'\}/g, ' ')                // {' '}
  .replace(/[a-zA-Z_]+=\{\{?/g, ' ')          // prop 시작
  .replace(/&lt;|&gt;|&amp;/g, ' ')
  .replace(/^\s*[|:\-\s]+$/gm, ' ')          // 표 구분선
  .replace(/[|#*`>]/g, ' ')                  // 마크다운 기호
  .replace(/\s+/g, '').length               // 공백 전부 제거
```

## 판정 규칙 (Design §7)

도해로 **대체된 표**는 원래 자수를 그대로 산입한다. 즉 판정식은

```
판정 자수 = 현재 자수 + (baseline 자수 − 현재 자수 중 도해 대체분)
         = baseline 자수  … 표를 도해로 옮기기만 한 경우
```

신규 서술을 추가하면 그만큼 늘고, 도해와 무관하게 문장을 덜어 내면 그만큼 준다.

## 요약

| 구분 | 개수 | 최소 | 중앙 | 최대 | 평균 | 합계 | §5.1 범위 |
|---|:--:|---:|---:|---:|---:|---:|---|
| 항목 | 88 | 1225 | 1757 | 2268 | 1758 | 154,694 | 1,200~2,300 |
| COLUMN | 9 | 1034 | 1229 | 1502 | 1219 | 10,971 | 600~1,600 |

## ⚠ 하한 근접 모듈 (여유 200자 미만)

도해 대체 시 우선 감시 대상. 표를 옮길 때 **이 표의 여유를 먼저 확인**한다.

| 모듈 | 자수 | 하한 여유 | 표 수 |
|---|---:|---:|:--:|
| `030-and-gate` | 1225 | **+25** | 3 |
| `024-ic-classification` | 1327 | **+127** | 2 |
| `033-comparator` | 1347 | **+147** | 2 |
| `031-adder` | 1358 | **+158** | 2 |
| `028-not-gate` | 1360 | **+160** | 2 |
| `032-subtractor` | 1376 | **+176** | 3 |

## 전수 표

| 모듈 | 자수 | 하한 여유 | 표 수 |
|---|---:|---:|:--:|
| `001-what-is-semiconductor` | 1607 | +407 | 2 |
| `002-semiconductor-types` | 1823 | +623 | 2 |
| `003-silicon` | 1777 | +577 | 2 |
| `004-silicon-solid-forms` | 1725 | +525 | 3 |
| `005-n-type-silicon` | 1653 | +453 | 1 |
| `006-p-type-silicon` | 1883 | +683 | 2 |
| `007-energy-band-1` | 1828 | +628 | 2 |
| `008-energy-band-2` | 1756 | +556 | 2 |
| `009-compound-semiconductor` | 2120 | +920 | 2 |
| `010-resistor` | 1802 | +602 | 2 |
| `011-capacitor` | 2223 | +1023 | 1 |
| `012-pn-diode` | 1724 | +524 | 2 |
| `013-photodiode` | 1899 | +699 | 1 |
| `014-led` | 1863 | +663 | 2 |
| `015-laser-diode` | 2030 | +830 | 2 |
| `016-transistor-types` | 1808 | +608 | 3 |
| `017-nmos` | 1891 | +691 | 2 |
| `018-pmos` | 1788 | +588 | 2 |
| `019-cmos` | 1670 | +470 | 2 |
| `020-jfet` | 1720 | +520 | 1 |
| `021-mesfet` | 2000 | +800 | 2 |
| `022-bjt` | 1924 | +724 | 2 |
| `023-integrated-circuit` | 1443 | +243 | 1 |
| `024-ic-classification` | 1327 | +127 | 2 |
| `025-integration-scale` | 1568 | +368 | 1 |
| `026-ic-by-function` | 1648 | +448 | 1 |
| `027-boolean-algebra` | 1541 | +341 | 1 |
| `028-not-gate` | 1360 | +160 | 2 |
| `029-or-gate` | 1426 | +226 | 2 |
| `030-and-gate` | 1225 | +25 | 3 |
| `031-adder` | 1358 | +158 | 2 |
| `032-subtractor` | 1376 | +176 | 3 |
| `033-comparator` | 1347 | +147 | 2 |
| `034-mpu` | 1721 | +521 | 1 |
| `035-mcu` | 1601 | +401 | 2 |
| `036-dsp` | 1496 | +296 | 1 |
| `037-asic` | 1530 | +330 | 1 |
| `038-pld` | 1556 | +356 | 1 |
| `039-system-ic` | 1542 | +342 | 1 |
| `040-ccd` | 1598 | +398 | 1 |
| `041-flip-flop` | 1927 | +727 | 1 |
| `042-memory-structure` | 1658 | +458 | 2 |
| `043-dram` | 1723 | +523 | 1 |
| `044-sram` | 1854 | +654 | 2 |
| `045-mask-rom` | 1593 | +393 | 1 |
| `046-flash-memory` | 1888 | +688 | 3 |
| `047-multi-level-cell` | 1960 | +760 | 3 |
| `048-ic-development` | 1738 | +538 | 2 |
| `049-hierarchical-design` | 2268 | +1068 | 2 |
| `050-design-rule` | 2187 | +987 | 1 |
| `051-device-design` | 1998 | +798 | 1 |
| `052-process-design` | 1739 | +539 | 3 |
| `053-silicon-abundance` | 1638 | +438 | 2 |
| `054-polysilicon` | 1813 | +613 | 1 |
| `055-cz-growth` | 1915 | +715 | 1 |
| `056-wafer-slicing` | 1661 | +461 | 2 |
| `057-wafer-quality` | 1878 | +678 | 1 |
| `058-epi-soi` | 2122 | +922 | 1 |
| `059-front-back-end` | 1581 | +381 | 4 |
| `060-feol-1` | 1703 | +503 | 1 |
| `061-feol-2` | 2013 | +813 | 2 |
| `062-beol` | 1866 | +666 | 1 |
| `063-thin-film` | 2004 | +804 | 1 |
| `064-lithography` | 1763 | +563 | 1 |
| `065-etching` | 1696 | +496 | 2 |
| `066-doping` | 1802 | +602 | 3 |
| `067-thermal-process` | 1959 | +759 | 1 |
| `068-cmp` | 1788 | +588 | 1 |
| `069-cleaning` | 1895 | +695 | 1 |
| `070-wafer-test` | 1757 | +557 | 1 |
| `071-dicing` | 1673 | +473 | 2 |
| `072-die-bonding` | 1506 | +306 | 1 |
| `073-wire-bonding` | 1717 | +517 | 2 |
| `074-molding` | 1600 | +400 | 2 |
| `075-lead-finish` | 1660 | +460 | 1 |
| `076-package-types` | 1635 | +435 | 3 |
| `077-final-test` | 1747 | +547 | 2 |
| `078-larger-wafer` | 1660 | +460 | 1 |
| `079-strained-silicon` | 1631 | +431 | 2 |
| `080-finfet` | 1791 | +591 | 1 |
| `081-immersion-double-patterning` | 1796 | +596 | 0 |
| `082-euv` | 1825 | +625 | 1 |
| `083-maskless-imprint` | 1824 | +624 | 1 |
| `084-emerging-memory` | 1855 | +655 | 2 |
| `085-feram-mram` | 1849 | +649 | 2 |
| `086-pram-reram` | 2180 | +980 | 3 |
| `087-high-k-metal-gate` | 2086 | +886 | 1 |
| `088-low-k-dram-capacitor` | 2095 | +895 | 4 |
| `col-1-oxide-organic` | 1229 | +629 | 2 |
| `col-2-transistor-birth` | 1130 | +530 | 1 |
| `col-3-first-computer` | 1275 | +675 | 1 |
| `col-4-scaling-law` | 1092 | +492 | 1 |
| `col-5-industry-split` | 1336 | +736 | 1 |
| `col-6-wafer-requirements` | 1034 | +434 | 1 |
| `col-7-cleanroom` | 1076 | +476 | 0 |
| `col-8-reliability` | 1297 | +697 | 3 |
| `col-9-more-moore` | 1502 | +902 | 2 |
