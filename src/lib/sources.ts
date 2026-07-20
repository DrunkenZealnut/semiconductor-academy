/**
 * 자료원(Source) 레지스트리
 * Design: docs/02-design/features/multi-source-learning-platform.design.md §3.1
 *
 * - EPI_BOOK: 「반도체 산업의 유해인자」 (윤충식 외) — 17 챕터를 SourceSection으로 노출
 * - OSHA_SCS: OSHA Semiconductor Chemical Safety 5 Part — Phase B에서 본문 추가
 */

import { chapters } from './chapters';
import type { Chapter, Source, SourceCategory, SourceSection } from './types';
import { SOURCE_CATEGORY_LABELS } from './types';

function chapterToSection(c: Chapter): SourceSection {
  return {
    id: c.id,
    href: c.legacyUrl ?? `/chapter/${c.slug}/`,
    title: c.title,
    summary: c.subtitle,
    readingTime: c.readingTime,
  };
}

export const EPI_BOOK: Source = {
  id: 'epi-semi-hazards',
  kind: 'book',
  language: 'ko',
  title: '반도체 산업의 유해인자',
  subtitle: '학술서 — 윤충식 외 6인 공저',
  attribution: '윤충식·김승원·박동욱·정지연·최상준·하권철·함승헌',
  publisher: '에피스테메',
  year: 2021,
  license: 'fair-use',
  order: 1,
  accent: 'book',
  sections: chapters.map(chapterToSection),
};

export const OSHA_SCS: Source = {
  id: 'osha-scs',
  kind: 'training-program',
  language: 'en',
  title: 'Semiconductor Chemical Safety',
  subtitle: 'OSHA training program · Parts 1A–4',
  attribution: 'U.S. OSHA (Occupational Safety and Health Administration)',
  publisher: 'United States Department of Labor',
  year: 2024,
  license: 'us-gov-public-domain',
  url: 'https://www.osha.gov/',
  order: 2,
  accent: 'osha',
  sections: [
    {
      id: 'part-1a',
      href: '/sources/osha-scs/part-1a/',
      title: 'Part 1A · Introduction to GHS',
      summary: 'GHS 화학물질 분류·라벨 체계 기초',
      readingTime: 22,
    },
    {
      id: 'part-1b',
      href: '/sources/osha-scs/part-1b/',
      title: 'Part 1B · Communication, Controls, and Emergency Procedures',
      summary: '위험 전달, 통제, 비상 대응 절차',
      readingTime: 24,
    },
    {
      id: 'part-2',
      href: '/sources/osha-scs/part-2/',
      title: 'Part 2 · Chemical Hazards, Controls, and Emergency Actions',
      summary: '인화·부식·독성 등 화학물질 위험 분류와 대응',
      readingTime: 33,
    },
    {
      id: 'part-3',
      href: '/sources/osha-scs/part-3/',
      title: 'Part 3 · Extremely Hazardous Chemicals',
      summary: '실란 등 9개 극위험 화학물질 카테고리',
      readingTime: 24,
    },
    {
      id: 'part-4',
      href: '/sources/osha-scs/part-4/',
      title: 'Part 4 · Hazardous Gas Systems and Controls',
      summary: '압축가스·극저온 가스 시스템과 통제 절차',
      readingTime: 26,
    },
  ],
};

/**
 * NCS 반도체 학습모듈 — 국가직무능력표준(교육부·한국산업인력공단).
 * 원자료 `data/ncs/`(직무훈련용)를 고등학생 눈높이로 재구성. 원문 이미지는 저작권상 미사용.
 * 파일럿: 반도체제조 트랙 3개 → 세분류(개발·재료·장비)별 확대.
 * 확장: `src/content/sources/ncs-semi/{module}.mdx` 작성 + `ncsMdx.tsx` 로더 등록 + 아래 sections에 추가.
 */
export const NCS_SEMI: Source = {
  id: 'ncs-semi',
  kind: 'standard',
  language: 'ko',
  title: 'NCS 반도체 학습모듈',
  subtitle: '국가직무능력표준 — 현장 직무로 배우는 반도체',
  attribution: '교육부 · 한국산업인력공단',
  publisher: 'NCS 국가직무능력표준',
  year: 2024,
  license: 'ncs-open',
  url: 'https://www.ncs.go.kr/',
  order: 3,
  accent: 'standard',
  sections: [
    {
      id: 'product-planning',
      href: '/sources/ncs-semi/product-planning/',
      title: '반도체 제품 기획',
      summary: '시장·기술·손익을 읽어 어떤 칩을 만들지 결정하는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'architecture-design',
      href: '/sources/ncs-semi/architecture-design/',
      title: '반도체 아키텍처 설계',
      summary: '만들 칩의 사양을 정하고 전체 구조를 그리는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'digital-circuit-design',
      href: '/sources/ncs-semi/digital-circuit-design/',
      title: '디지털 회로 설계',
      summary: 'HDL 코드로 회로를 쓰고 시뮬레이션으로 검증하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'analog-circuit-design',
      href: '/sources/ncs-semi/analog-circuit-design/',
      title: '아날로그 회로 설계',
      summary: '연속 신호를 다루는 아날로그 회로를 그리고 시뮬레이션으로 검증하는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'analog-architecture-design',
      href: '/sources/ncs-semi/analog-architecture-design/',
      title: '아날로그 회로 아키텍처 설계',
      summary: '아날로그 칩의 블록 구성과 전체 구조를 정하는 상위 설계를 그리는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'analog-device-design',
      href: '/sources/ncs-semi/analog-device-design/',
      title: '아날로그 회로 소자 레벨 설계',
      summary: '트랜지스터 하나하나의 크기를 정해 회로를 소자 수준으로 완성하는 일',
      readingTime: 9,
      group: '반도체개발',
    },
    {
      id: 'analog-system-design',
      href: '/sources/ncs-semi/analog-system-design/',
      title: '아날로그 회로 시스템 설계',
      summary: '완성된 회로를 보드로 검증하고 IP로 포장해 양산까지 내보내는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'design-verification',
      href: '/sources/ncs-semi/design-verification/',
      title: '반도체 설계 검증',
      summary: '설계한 회로가 사양대로 동작하는지 계획을 세워 시뮬레이션으로 확인하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'auto-layout-design',
      href: '/sources/ncs-semi/auto-layout-design/',
      title: '자동 배치 배선 레이아웃 설계',
      summary: 'EDA 툴로 소자를 자동 배치·배선하고 기생 효과까지 관리하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'custom-layout-design',
      href: '/sources/ncs-semi/custom-layout-design/',
      title: '커스텀 레이아웃 설계',
      summary: '트랜지스터와 배선을 사람 손으로 직접 배치·배선하는 풀 커스텀 작업',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'custom-layout-process-analysis',
      href: '/sources/ncs-semi/custom-layout-process-analysis/',
      title: '커스텀 레이아웃 적용 공정 분석',
      summary: '레이아웃을 그리기 전에 적용할 공정의 소자·레이어를 분석하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'custom-layout-verification',
      href: '/sources/ncs-semi/custom-layout-verification/',
      title: '커스텀 레이아웃 검증',
      summary: '그린 도면이 공장의 규칙과 회로에 맞는지 DRC·LVS로 확인하는 일',
      readingTime: 9,
      group: '반도체개발',
    },
    {
      id: 'process-development',
      href: '/sources/ncs-semi/process-development/',
      title: '반도체 제조 공정 개발',
      summary: '새 칩에 맞는 제조 공정 흐름을 설계하고 신뢰성까지 검증하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'system-process-development',
      href: '/sources/ncs-semi/system-process-development/',
      title: '시스템 반도체 제조 공정 개발',
      summary: '트랜지스터가 만들어지는 공정 흐름을 설계하고 검증하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'memory-process-development',
      href: '/sources/ncs-semi/memory-process-development/',
      title: '메모리 반도체 제조 공정 개발',
      summary: '웰부터 게이트·배선까지 메모리 칩의 제조 공정을 개발하는 일',
      readingTime: 12,
      group: '반도체개발',
    },
    {
      id: 'unit-process-development',
      href: '/sources/ncs-semi/unit-process-development/',
      title: '반도체 제조 단위 공정 개발',
      summary: '식각·증착·이온 주입 같은 단위 공정 하나하나를 개발·최적화하는 일',
      readingTime: 9,
      group: '반도체개발',
    },
    {
      id: 'firmware-development',
      href: '/sources/ncs-semi/firmware-development/',
      title: '반도체 펌웨어 개발',
      summary: '칩을 깨우고 움직이는 가장 낮은 층의 소프트웨어를 만드는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'package-product-design',
      href: '/sources/ncs-semi/package-product-design/',
      title: '패키지 제품설계',
      summary: '칩을 보호하고 연결하는 패키지를 전기·열·기계 균형으로 설계하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'package-assembly-development',
      href: '/sources/ncs-semi/package-assembly-development/',
      title: '패키지 조립 공정 개발',
      summary: '웨이퍼 연삭부터 솔더 범핑·리드 성형까지 조립 공정을 개발하는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'wirebond-package-development',
      href: '/sources/ncs-semi/wirebond-package-development/',
      title: '와이어 본딩 패키지 개발',
      summary: '금선으로 칩과 리드 프레임을 이어 붙이는 패키지를 개발하는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'flip-package-development',
      href: '/sources/ncs-semi/flip-package-development/',
      title: '플립 패키지 개발',
      summary: '칩을 뒤집어 기판에 직접 붙이는 첨단 패키지를 개발하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'wafer-level-package',
      href: '/sources/ncs-semi/wafer-level-package/',
      title: '웨이퍼 레벨 패키지 개발',
      summary: '웨이퍼를 자르지 않은 채 재배선과 범핑까지 마치는 패키지를 만드는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'fanout-package',
      href: '/sources/ncs-semi/fanout-package/',
      title: '어드밴스드 팬 아웃 패키지 개발',
      summary: '칩 바깥까지 배선을 넓혀 입출력 단자를 늘리는 팬 아웃 패키지를 만드는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'heterogeneous-package',
      href: '/sources/ncs-semi/heterogeneous-package/',
      title: '이종 접합 패키지 개발',
      summary: '서로 다른 칩을 TSV·하이브리드 본딩으로 쌓아 한 패키지로 묶는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'product-verification',
      href: '/sources/ncs-semi/product-verification/',
      title: '반도체 제품 기능·성능 검증',
      summary: '완성된 칩의 기능과 성능을 시험해 출하할 수 있는지 판정하는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'reliability-testing',
      href: '/sources/ncs-semi/reliability-testing/',
      title: '반도체 신뢰성 평가',
      summary: '몇 년 뒤의 고장을 실험실에서 미리 만들어 수명을 예측·보증하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'advanced-underfill-package',
      href: '/sources/ncs-semi/advanced-underfill-package/',
      title: '어드밴스드 언더필 패키지 개발',
      summary: '칩과 기판 사이 빈틈을 채우는 언더필 공법을 고르고 개발하는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'environmental-testing',
      href: '/sources/ncs-semi/environmental-testing/',
      title: '반도체 환경 시험',
      summary: '온도·습도·진동·충격을 실험실에서 재현해 제품이 버티는지 확인하는 일',
      readingTime: 10,
      group: '반도체개발',
    },
    {
      id: 'lifetime-testing',
      href: '/sources/ncs-semi/lifetime-testing/',
      title: '반도체 수명 시험',
      summary: '높은 온도·전압으로 시간을 압축해 반도체의 수명을 미리 예측하는 일',
      readingTime: 9,
      group: '반도체개발',
    },
    {
      id: 'robustness-testing',
      href: '/sources/ncs-semi/robustness-testing/',
      title: '반도체 내성 시험',
      summary: '정전기·래치업 같은 순간 전기 충격을 버티는지 시험하고 분석하는 일',
      readingTime: 11,
      group: '반도체개발',
    },
    {
      id: 'photo-equipment',
      href: '/sources/ncs-semi/photo-equipment/',
      title: 'Photo(노광) 장비 운영',
      summary: '빛으로 회로를 그리는 노광·트랙 장비를 셋업하고 관리하는 일',
      readingTime: 12,
      group: '반도체제조',
    },
    {
      id: 'etch-equipment',
      href: '/sources/ncs-semi/etch-equipment/',
      title: 'Etch(식각) 장비 운영',
      summary: '식각 장비를 안전한 순서로 세우고 켜고, 닳는 부품을 미리 갈아주는 일',
      readingTime: 10,
      group: '반도체제조',
    },
    {
      id: 'clean-cmp-equipment',
      href: '/sources/ncs-semi/clean-cmp-equipment/',
      title: 'C&C(세정·CMP) 장비 운영',
      summary: '웨이퍼를 씻는 세정 장비와 표면을 평평하게 연마하는 CMP 장비를 셋업·관리하는 일',
      readingTime: 10,
      group: '반도체제조',
    },
    {
      id: 'metrology-equipment',
      href: '/sources/ncs-semi/metrology-equipment/',
      title: 'MI(계측·검사) 장비 운영',
      summary: '패터닝 뒤 박막 두께·미세 결함을 재는 계측·검사 장비를 도입·운영하는 일',
      readingTime: 10,
      group: '반도체제조',
    },
    {
      id: 'quality-control',
      href: '/sources/ncs-semi/quality-control/',
      title: '반도체 품질관리',
      summary: '불량을 찾아내고 원인을 되짚어 수율을 지키는 일',
      readingTime: 10,
      group: '반도체제조',
    },
    {
      id: 'productivity',
      href: '/sources/ncs-semi/productivity/',
      title: '반도체 생산성 향상',
      summary: '같은 설비에서 더 많은 좋은 칩을 만들어 내는 개선 활동',
      readingTime: 9,
      group: '반도체제조',
    },
    {
      id: 'thinfilm-diffusion-equipment',
      href: '/sources/ncs-semi/thinfilm-diffusion-equipment/',
      title: '박막·확산 장비 운영',
      summary: '웨이퍼에 막을 입히고 불순물을 넣는 고온 장비를 셋업·운영하는 일',
      readingTime: 10,
      group: '반도체제조',
    },
    {
      id: 'cleanroom-facility',
      href: '/sources/ncs-semi/cleanroom-facility/',
      title: '반도체 클린룸 시설 운영',
      summary: '반도체가 태어나는 초청정 공간의 공기·압력·에너지를 관리하는 일',
      readingTime: 10,
      group: '반도체제조',
    },
    {
      id: 'wafer-level-test',
      href: '/sources/ncs-semi/wafer-level-test/',
      title: '반도체 웨이퍼 레벨 테스트 장비 운영',
      summary: '웨이퍼 상태 그대로 칩을 찔러 양품·불량을 가려내는 EDS 검사 장비를 운영하는 일',
      readingTime: 11,
      group: '반도체제조',
    },
    {
      id: 'package-level-test',
      href: '/sources/ncs-semi/package-level-test/',
      title: '반도체 패키지 레벨 테스트 장비 운영',
      summary: '완성된 칩을 전기로 검사하는 ATE·핸들러 장비를 설치·교정·관리하는 일',
      readingTime: 11,
      group: '반도체제조',
    },
    {
      id: 'packaging-front-equipment',
      href: '/sources/ncs-semi/packaging-front-equipment/',
      title: '반도체 패키징 전공정 장비 운영',
      summary: '웨이퍼를 원하는 두께로 갈아내고(백그라인딩) 낱개 칩으로 잘라내는(소잉) 장비를 운영하는 일',
      readingTime: 11,
      group: '반도체제조',
    },
    {
      id: 'packaging-back-equipment',
      href: '/sources/ncs-semi/packaging-back-equipment/',
      title: '반도체 패키징 후공정 장비 운영',
      summary: '다이본딩·와이어본딩·몰딩·솔더볼 장비로 낱개 칩을 완성품으로 만드는 일',
      readingTime: 11,
      group: '반도체제조',
    },
    {
      id: 'utility-operation',
      href: '/sources/ncs-semi/utility-operation/',
      title: '반도체 유틸리티 운영',
      summary: '전기·가스·약품·초순수를 공장 구석구석 안전하게 실어 나르는 공급 계통을 관리하는 일',
      readingTime: 12,
      group: '반도체제조',
    },
    {
      id: 'material-safety',
      href: '/sources/ncs-semi/material-safety/',
      title: '반도체 재료 안전관리',
      summary: 'MSDS부터 폐기물까지 — 화학 재료의 위험을 알고 재고 대비하는 일',
      readingTime: 10,
      group: '반도체재료',
    },
    {
      id: 'wafer-materials',
      href: '/sources/ncs-semi/wafer-materials/',
      title: '반도체용 웨이퍼 재료 제조',
      summary: '녹인 실리콘에서 잉곳을 키워 웨이퍼 한 장으로 완성하는 재료의 출발점',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'lithography-materials',
      href: '/sources/ncs-semi/lithography-materials/',
      title: '반도체용 리소그래피 재료 제조',
      summary: '감광제(PR)·현상액 등 회로를 웨이퍼에 새기는 리소그래피 재료를 만드는 일',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'photo-process-materials',
      href: '/sources/ncs-semi/photo-process-materials/',
      title: '반도체용 포토 공정 재료 제조',
      summary: '빛에 반응해 회로를 새기는 감광제(PR)의 조성과 감광 원리를 다루는 일',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'track-process-materials',
      href: '/sources/ncs-semi/track-process-materials/',
      title: '반도체용 트랙 공정 재료 제조',
      summary: '감광제를 도포·현상하는 트랙 공정용 씨너·현상액·BARC를 만드는 일',
      readingTime: 11,
      group: '반도체재료',
    },
    {
      id: 'cmp-materials',
      href: '/sources/ncs-semi/cmp-materials/',
      title: '반도체용 CMP 재료 제조',
      summary: '웨이퍼를 평평하게 깎는 슬러리를 만들고 품질을 지키는 일',
      readingTime: 11,
      group: '반도체재료',
    },
    {
      id: 'cleaning-materials',
      href: '/sources/ncs-semi/cleaning-materials/',
      title: '반도체용 세정 공정 재료 제조',
      summary: '웨이퍼를 씻는 화학약품을 표준 레시피로 배합해 만드는 일',
      readingTime: 10,
      group: '반도체재료',
    },
    {
      id: 'wet-chemical-materials',
      href: '/sources/ncs-semi/wet-chemical-materials/',
      title: '반도체용 습식화공약품 재료 제조',
      summary: '세정·식각에 쓰는 산·염기·용제를 초고순도로 정제해 만드는 일',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'cleaning-process-gas',
      href: '/sources/ncs-semi/cleaning-process-gas/',
      title: '반도체용 세정 공정 가스 제조',
      summary: '웨이퍼를 씻는 특수가스를 초고순도(5N)로 합성·정제하는 일',
      readingTime: 9,
      group: '반도체재료',
    },
    {
      id: 'gas-materials',
      href: '/sources/ncs-semi/gas-materials/',
      title: '반도체용 가스 재료 제조',
      summary: '수백 종 특수가스를 초고순도로 만들어 안전하게 공급하는 일',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'etching-process-gas',
      href: '/sources/ncs-semi/etching-process-gas/',
      title: '반도체용 식각 공정 가스 제조',
      summary: '실리콘·산화막을 깎는 식각용 특수가스를 만들고 순도를 지키는 일',
      readingTime: 11,
      group: '반도체재료',
    },
    {
      id: 'thinfilm-process-gas',
      href: '/sources/ncs-semi/thinfilm-process-gas/',
      title: '반도체용 박막 공정 가스 제조',
      summary: '웨이퍼에 막을 입히는 증착용 소스가스를 합성·정제하는 일',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'implant-process-gas',
      href: '/sources/ncs-semi/implant-process-gas/',
      title: '반도체용 이온 주입 공정 가스 제조',
      summary: '불순물을 심는 이온주입용 도펀트 가스를 만들고 독성을 관리하는 일',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'flipchip-materials',
      href: '/sources/ncs-semi/flipchip-materials/',
      title: '반도체용 플립칩 재료 제조',
      summary: '범프·언더필 등 플립칩 패키지 재료를 만들고 신뢰성을 시험하는 일',
      readingTime: 9,
      group: '반도체재료',
    },
    {
      id: 'package-materials',
      href: '/sources/ncs-semi/package-materials/',
      title: '반도체 패키지 재료 제조',
      summary: '리드프레임·본딩와이어·EMC 등 칩을 감싸는 패키지 재료를 만드는 일',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'mask-materials',
      href: '/sources/ncs-semi/mask-materials/',
      title: '반도체용 마스크 재료 제조',
      summary: '회로 원본을 담는 석영 기판·크로뮴 막·펠리클 재료를 만드는 일',
      readingTime: 9,
      group: '반도체재료',
    },
    {
      id: 'cmp-slurry-materials',
      href: '/sources/ncs-semi/cmp-slurry-materials/',
      title: '반도체용 CMP 슬러리 재료 제조',
      summary: '나노 연마 입자를 합성해 실험실 레시피를 양산 슬러리로 키워 내는 일',
      readingTime: 10,
      group: '반도체재료',
    },
    {
      id: 'metal-target-materials',
      href: '/sources/ncs-semi/metal-target-materials/',
      title: '반도체용 금속 Target 재료 제조',
      summary: '배선을 만드는 스퍼터링용 금속 타깃 재료와 그 신뢰성을 다루는 일',
      readingTime: 12,
      group: '반도체재료',
    },
    {
      id: 'sod-process-materials',
      href: '/sources/ncs-semi/sod-process-materials/',
      title: '반도체용 SOD 공정 재료 제조',
      summary: '스핀 코팅으로 좁은 틈을 메우는 액상 절연막(SOD) 재료를 만드는 일',
      readingTime: 10,
      group: '반도체재료',
    },
    {
      id: 'materials-quality-control',
      href: '/sources/ncs-semi/materials-quality-control/',
      title: '반도체 재료 품질관리',
      summary: '재료 공급사가 자사 재료를 검사하고 고객 클레임에 대응하는 일',
      readingTime: 11,
      group: '반도체재료',
    },
    {
      id: 'materials-production-control',
      href: '/sources/ncs-semi/materials-production-control/',
      title: '반도체 재료 생산관리',
      summary: '재료 공장의 생산 계획·가동률·설비보전을 관리해 납기를 맞추는 일',
      readingTime: 13,
      group: '반도체재료',
    },
    {
      id: 'thinfilm-precursor',
      href: '/sources/ncs-semi/thinfilm-precursor/',
      title: '반도체용 박막 공정 전구체 제조',
      summary: '웨이퍼 위에 쌓일 막의 원료가 되는 고순도 화학 물질을 합성·정제하는 일',
      readingTime: 10,
      group: '반도체재료',
    },
    {
      id: 'equipment-concept-design',
      href: '/sources/ncs-semi/equipment-concept-design/',
      title: '반도체 장비 콘셉트 설계',
      summary: '고객 요구를 캐묻고 스펙을 숫자로 못 박아 장비의 밑그림을 그리는 일',
      readingTime: 9,
      group: '반도체장비',
    },
    {
      id: 'equipment-main-design',
      href: '/sources/ncs-semi/equipment-main-design/',
      title: '반도체 장비 주요부 기구 설계',
      summary: '노광장치를 예로, 장비의 핵심 기구부를 사양부터 도면까지 완성하는 일',
      readingTime: 10,
      group: '반도체장비',
    },
    {
      id: 'equipment-design',
      href: '/sources/ncs-semi/equipment-design/',
      title: '반도체 장비 주변부 기구 설계',
      summary: '장비를 둘러싼 부대 기구를 설계하고 시뮬레이션으로 검증하는 일',
      readingTime: 9,
      group: '반도체장비',
    },
    {
      id: 'equipment-electrical-design',
      href: '/sources/ncs-semi/equipment-electrical-design/',
      title: '반도체 장비 전장 설계',
      summary: '장비가 쓰는 전기를 계산하고 부품을 골라 하나의 제어반으로 설계하는 일',
      readingTime: 9,
      group: '반도체장비',
    },
    {
      id: 'equipment-board-design',
      href: '/sources/ncs-semi/equipment-board-design/',
      title: '반도체 장비 보드 설계',
      summary: '부품을 고르고 회로·PCB를 설계하고 FPGA에 논리를 심는 일',
      readingTime: 10,
      group: '반도체장비',
    },
    {
      id: 'equipment-system-software',
      href: '/sources/ncs-semi/equipment-system-software/',
      title: '반도체 장비 시스템 소프트웨어 개발',
      summary: '장비를 실제로 움직이는 Library·드라이버·컨트롤러·GUI 소프트웨어를 만드는 일',
      readingTime: 9,
      group: '반도체장비',
    },
    {
      id: 'equipment-utility-software',
      href: '/sources/ncs-semi/equipment-utility-software/',
      title: '반도체 장비 유틸리티 소프트웨어 개발',
      summary: '장비와 통신·진단·데이터를 주고받는 지원 소프트웨어를 개발하는 일',
      readingTime: 9,
      group: '반도체장비',
    },
    {
      id: 'equipment-outsourcing',
      href: '/sources/ncs-semi/equipment-outsourcing/',
      title: '반도체 장비 생산 외주관리',
      summary: '외주업체를 고르고 품질을 검수하고 재고를 알맞게 채우는 공급망 관리',
      readingTime: 11,
      group: '반도체장비',
    },
    {
      id: 'equipment-prototype-evaluation',
      href: '/sources/ncs-semi/equipment-prototype-evaluation/',
      title: '반도체 장비 시제품 성능평가',
      summary: '새로 만든 장비를 조립·설치부터 마라톤 사이클까지 4단계로 검증하는 일',
      readingTime: 10,
      group: '반도체장비',
    },
    {
      id: 'equipment-quality-control',
      href: '/sources/ncs-semi/equipment-quality-control/',
      title: '반도체 장비 품질관리',
      summary: '부품 수입 검사부터 고객 Qualification까지 — 장비 제조사의 품질관리',
      readingTime: 10,
      group: '반도체장비',
    },
    {
      id: 'equipment-customer-support',
      href: '/sources/ncs-semi/equipment-customer-support/',
      title: '반도체 장비 고객 지원',
      summary: '장비 셋업·유지보수·클레임 대응을 맡는 필드 서비스 엔지니어의 일',
      readingTime: 10,
      group: '반도체장비',
    },
    {
      id: 'equipment-mechanical-assembly',
      href: '/sources/ncs-semi/equipment-mechanical-assembly/',
      title: '반도체 장비 기구 조립',
      summary: '도면을 읽고 기초 구조물부터 커버까지 정밀도를 지켜 장비를 조립하는 일',
      readingTime: 11,
      group: '반도체장비',
    },
    {
      id: 'equipment-assembly',
      href: '/sources/ncs-semi/equipment-assembly/',
      title: '반도체 장비 기구 조립 검증',
      summary: '조립한 장비 기구가 정밀도 기준을 만족하는지 검증하는 일',
      readingTime: 10,
      group: '반도체장비',
    },
    {
      id: 'equipment-electrical-assembly',
      href: '/sources/ncs-semi/equipment-electrical-assembly/',
      title: '반도체 장비 전장 조립',
      summary: '장비의 전원·배선·차단기를 안전 규격대로 조립하는 일',
      readingTime: 9,
      group: '반도체장비',
    },
    {
      id: 'equipment-electrical-verification',
      href: '/sources/ncs-semi/equipment-electrical-verification/',
      title: '반도체 장비 전장 조립 검증',
      summary: '배선과 장비 동작이 도면·표준대로 안전한지 측정으로 검증하는 일',
      readingTime: 11,
      group: '반도체장비',
    },
    {
      id: 'optical-equipment-maintenance',
      href: '/sources/ncs-semi/optical-equipment-maintenance/',
      title: '반도체 광학 장비 유지보수',
      summary: '빛으로 두께·먼지·성분을 재는 계측 장비를 셋업하고 관리하는 일',
      readingTime: 10,
      group: '반도체장비',
    },
    {
      id: 'vacuum-plasma-maintenance',
      href: '/sources/ncs-semi/vacuum-plasma-maintenance/',
      title: '반도체 진공 플라스마 장비 유지보수',
      summary: '진공펌프·RF·플라스마 발생부의 원리와 예방정비·고장 대응을 다루는 일',
      readingTime: 9,
      group: '반도체장비',
    },
    {
      id: 'chemical-gas-maintenance',
      href: '/sources/ncs-semi/chemical-gas-maintenance/',
      title: '반도체 케미컬 가스 장비 유지보수',
      summary: '약액·가스 공급 계통을 셋업하고 잔류 가스를 비우고 누출에 대응하는 일',
      readingTime: 11,
      group: '반도체장비',
    },
    {
      id: 'equipment-safety',
      href: '/sources/ncs-semi/equipment-safety/',
      title: '반도체 장비 안전관리',
      summary: '장비를 만들고 세우고 고치는 매 순간 협착·고전압·잔류 가스에서 사람을 지키는 일',
      readingTime: 10,
      group: '반도체장비',
    },
  ],
};

/**
 * 반도체고 교과서 「반도체 기초」 — 공정기초(daegu)의 선행편: 개념·산업·물성·소자.
 * 원자료 `data/school-text/20260415_102949_반도체기초_렛유인_/`를 고등학생 눈높이로 **전면 재작성**
 * (daegu 저작권 원칙 일괄: 원문 문장·도판 미사용, 수치·정의만 근거 + 원저자·발행처 표기).
 * 10모듈 전체 등록 완료 — 등록 순서 = 교과서 목차 순서 = 이전/다음 내비 순서.
 * sections 항목과 `schoolTextMdx.tsx` REGISTRY 로더는 반드시 쌍으로 관리한다
 * (로더 누락 시 실패 모드는 schoolTextMdx.tsx 헤더 주석 참고).
 */
export const HS_SEMI_BASICS: Source = {
  id: 'hs-semicon-basics',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 기초',
  subtitle: '반도체고 교과서 — 개념·산업·물성·소자, 공정기초의 선행편',
  attribution: '조우현·김준호',
  publisher: '렛유인',
  license: 'fair-use',
  order: 4,
  accent: 'school',
  category: 'hs-textbook',
  sections: [
    {
      id: 'semicon-overview',
      href: '/sources/hs-semicon-basics/semicon-overview/',
      title: '반도체 개요',
      summary: '반도체란 무엇인가 — 도체와 부도체 사이, 시스템·메모리·센서로 나뉘는 반도체 제품의 큰 그림',
      readingTime: 11,
      group: '반도체 개념',
    },
    {
      id: 'semicon-industry',
      href: '/sources/hs-semicon-basics/semicon-industry/',
      title: '반도체 산업',
      summary: '5,800억 달러 시장과 밸류체인 — 팹리스·파운드리·OSAT·IDM이 만드는 생태계',
      readingTime: 14,
      group: '반도체 개념',
    },
    {
      id: 'semicon-careers',
      href: '/sources/hs-semicon-basics/semicon-careers/',
      title: '반도체 직무',
      summary: '공정 설계부터 인프라·안전까지 — 반도체 엔지니어의 포지션 지도와 취업 요건',
      readingTime: 10,
      group: '반도체 개념',
    },
    {
      id: 'physical-properties',
      href: '/sources/hs-semicon-basics/physical-properties/',
      title: '반도체 물리적 특성',
      summary: '자유전자와 정공, 실리콘 결정, 그리고 에너지 밴드로 읽는 도체·반도체·부도체',
      readingTime: 13,
      group: '반도체 특성',
    },
    {
      id: 'semicon-fundamentals',
      href: '/sources/hs-semicon-basics/semicon-fundamentals/',
      title: '반도체 기초',
      summary: '진성·외인성 반도체와 도핑, 페르미 레벨, 표동·확산 — 물성의 핵심',
      readingTime: 13,
      group: '반도체 특성',
    },
    {
      id: 'passive-components',
      href: '/sources/hs-semicon-basics/passive-components/',
      title: '수동소자',
      summary: '저항기·축전기·인덕터(R·L·C)의 원리와 반도체 공정에서의 구현',
      readingTime: 9,
      group: '반도체 소자',
    },
    {
      id: 'diode',
      href: '/sources/hs-semicon-basics/diode/',
      title: '다이오드',
      summary: 'PN 접합과 공핍영역, 순방향·역방향, 항복, 그리고 쇼트키·옴 접합',
      readingTime: 13,
      group: '반도체 소자',
    },
    {
      id: 'bjt',
      href: '/sources/hs-semicon-basics/bjt/',
      title: 'BJT',
      summary: '최초의 트랜지스터 — 이미터·베이스·콜렉터와 전류 증폭의 원리',
      readingTime: 9,
      group: '반도체 소자',
    },
    {
      id: 'mosfet',
      href: '/sources/hs-semicon-basics/mosfet/',
      title: 'MOSFET',
      summary: 'MOS 커패시터부터 문턱 전압·단채널 효과, HKMG·FinFET·GAA까지',
      readingTime: 20,
      group: '반도체 소자',
    },
    {
      id: 'cmos-image-sensor',
      href: '/sources/hs-semicon-basics/cmos-image-sensor/',
      title: 'CMOS 이미지 센서',
      summary: '빛을 숫자로 바꾸는 반도체의 눈 — 포토다이오드와 CIS 구조의 진화',
      readingTime: 12,
      group: '반도체 소자',
    },
  ],
};

/**
 * 대구반도체고 교과서 「반도체 공정기초」 — 공정 원리를 교과서 단원 순서 그대로.
 * 원자료 `data/school-text/daegu/`(상업 출판 교재)를 고등학생 눈높이로 **전면 재작성**.
 * 저작권: 원문 문장·도판(244개) 미사용, 수치·정의만 근거로 재서술 + 원저자·발행처 표기.
 * 확장: `src/content/sources/daegu-hs-process/{module}.mdx` 작성 + `daeguMdx.tsx` 로더 등록 +
 * 아래 sections에 목차 순서대로 추가 (등록 순서 = 이전/다음 내비 순서).
 */
export const DAEGU_HS: Source = {
  id: 'daegu-hs-process',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 공정기초',
  subtitle: '대구반도체고 교과서 — 공정 원리를 단원 순서 그대로',
  attribution: '조우현·김준호',
  publisher: '렛유인',
  license: 'fair-use',
  order: 5,
  accent: 'school',
  category: 'hs-textbook',
  sections: [
    {
      id: 'process-overview',
      href: '/sources/daegu-hs-process/process-overview/',
      title: '반도체 공정 개요',
      summary: '8대 공정과 전공정·후공정, 웨이퍼 제작, 클린룸 — 반도체 공정의 큰 그림',
      readingTime: 8,
      group: '반도체 공정 개념',
    },
    {
      id: 'equipment-parameters',
      href: '/sources/daegu-hs-process/equipment-parameters/',
      title: '공정 설비와 파라미터',
      summary: '챔버·진공·플라즈마로 배우는 공정 설비의 작동 원리',
      readingTime: 15,
      group: '반도체 공정 개념',
    },
    {
      id: 'photo',
      href: '/sources/daegu-hs-process/photo/',
      title: '포토 공정',
      summary: '포토마스크·감광제·노광부터 다중패턴·EUV까지, 포토 공정 전 과정',
      readingTime: 18,
      group: '반도체 공정 Ⅰ',
    },
    {
      id: 'etch',
      href: '/sources/daegu-hs-process/etch/',
      title: '식각 공정',
      summary: '습식·건식식각, 플라즈마·RIE, 고밀도 플라즈마와 원자층식각(ALE)까지',
      readingTime: 20,
      group: '반도체 공정 Ⅰ',
    },
    {
      id: 'thin-film',
      href: '/sources/daegu-hs-process/thin-film/',
      title: '박막 공정',
      summary: 'PVD·CVD·ALD로 박막을 쌓는 원리와 품질을 가르는 세 잣대',
      readingTime: 14,
      group: '반도체 공정 Ⅰ',
    },
    {
      id: 'metallization',
      href: '/sources/daegu-hs-process/metallization/',
      title: '금속 배선 공정',
      summary: '실리사이드부터 구리 전해 도금까지, 배선 재료의 변천사',
      readingTime: 13,
      group: '반도체 공정 Ⅰ',
    },
    {
      id: 'oxidation',
      href: '/sources/daegu-hs-process/oxidation/',
      title: '산화 공정',
      summary: '열산화막의 특성·성장 원리와 산화·질화 공정 장비 이해하기',
      readingTime: 12,
      group: '반도체 공정 Ⅱ',
    },
    {
      id: 'doping',
      href: '/sources/daegu-hs-process/doping/',
      title: '도핑 공정',
      summary: '확산·이온주입·에피택시로 실리콘에 전기 성질을 심는 세 가지 방법',
      readingTime: 17,
      group: '반도체 공정 Ⅱ',
    },
    {
      id: 'cmp',
      href: '/sources/daegu-hs-process/cmp/',
      title: 'CMP 공정',
      summary: '슬러리와 패드로 웨이퍼를 갈아 평평하게 만드는 CMP 공정',
      readingTime: 12,
      group: '반도체 공정 Ⅱ',
    },
    {
      id: 'cleaning',
      href: '/sources/daegu-hs-process/cleaning/',
      title: '세정 공정',
      summary: '웨이퍼 오염을 씻어내는 습식·건식 세정 기술의 원리와 비교',
      readingTime: 11,
      group: '반도체 공정 Ⅱ',
    },
  ],
};

/**
 * 반도체고 교과서 「반도체기초기술1」 — 반도체장비 기술자 양성 실무 5과목
 * (전자소자·기계가공·설계제도·공유압기술·C프로그래밍).
 * 원자료 `data/school-text/20260413_171220_반도체기초기술1_크리아트_/` 전면 재작성
 * (daegu 저작권 원칙 일괄). ⚠️ 원문 물리 페이지 순환 배치 — 챕터Ⅰ(electronic-devices)만
 * 재구성 순서 적용(Design §3.1), 챕터Ⅱ~Ⅴ는 원문 라인 순서 그대로.
 * 확장: `src/content/sources/hs-basic-tech-1/{module}.mdx` 작성 + `schoolTextMdx.tsx`
 * 로더 등록 + 아래 sections에 목차 순서대로 추가 (완성 모듈만).
 */
export const HS_BASIC_TECH_1: Source = {
  id: 'hs-basic-tech-1',
  kind: 'textbook',
  language: 'ko',
  title: '반도체기초기술 1',
  subtitle: '반도체고 교과서 — 전자소자부터 설계제도·공유압·C프로그래밍까지, 장비 기술의 기초',
  attribution: '정예원 외 4인',
  publisher: '크리아트출판사',
  license: 'fair-use',
  order: 6,
  accent: 'school',
  category: 'hs-textbook',
  sections: [
    {
      id: 'electronic-devices',
      href: '/sources/hs-basic-tech-1/electronic-devices/',
      title: '전자 소자',
      summary: '색띠로 저항값 읽기부터 다이오드·트랜지스터 검사까지, 부품을 다루는 실무 기초',
      readingTime: 16,
      group: '전기·전자 기초',
    },
    {
      id: 'dc-circuits',
      href: '/sources/hs-basic-tech-1/dc-circuits/',
      title: '직류 회로',
      summary: '옴의 법칙과 직·병렬 합성 저항, 키르히호프의 법칙으로 회로 읽기',
      readingTime: 11,
      group: '전기·전자 기초',
    },
    {
      id: 'measurement',
      href: '/sources/hs-basic-tech-1/measurement/',
      title: '측정 기술',
      summary: '버니어캘리퍼스·마이크로미터로 반도체 장비 부품을 정밀하게 재는 법',
      readingTime: 10,
      group: '기계 가공 기술',
    },
    {
      id: 'milling',
      href: '/sources/hs-basic-tech-1/milling/',
      title: '밀링 가공',
      summary: '밀링 머신의 규격·절삭 공구·드릴 설치로 배우는 기계 가공의 기초',
      readingTime: 13,
      group: '기계 가공 기술',
    },
    {
      id: 'drafting-standards',
      href: '/sources/hs-basic-tech-1/drafting-standards/',
      title: '제도의 규격과 통칙',
      summary: 'KS 도면 규격과 선의 종류 — 반도체 장비 도면이 통일된 언어를 쓰는 이유',
      readingTime: 13,
      group: '반도체장비 설계',
    },
    {
      id: 'drawing-methods',
      href: '/sources/hs-basic-tech-1/drawing-methods/',
      title: '기본 도법에 의한 도면 그리기',
      summary: '정투상법으로 입체를 평면 도면에 옮기는 기본 도법',
      readingTime: 9,
      group: '반도체장비 설계',
    },
    {
      id: 'sectional-views',
      href: '/sources/hs-basic-tech-1/sectional-views/',
      title: '단면도 그리기',
      summary: '보이지 않는 내부 구조를 잘라서 보여주는 단면도의 종류와 표시법',
      readingTime: 8,
      group: '반도체장비 설계',
    },
    {
      id: 'pneumatics-basics',
      href: '/sources/hs-basic-tech-1/pneumatics-basics/',
      title: '공압 기술의 개요',
      summary: '압력 단위와 보일·샤를의 법칙 — 압축 공기로 반도체 장비를 움직이는 원리',
      readingTime: 12,
      group: '반도체장비 공유압기술',
    },
    {
      id: 'pneumatics-equipment',
      href: '/sources/hs-basic-tech-1/pneumatics-equipment/',
      title: '공압 발생장치와 조정기기',
      summary: '공기 압축기·정화기기·실린더로 구성되는 공압 시스템',
      readingTime: 14,
      group: '반도체장비 공유압기술',
    },
    {
      id: 'hydraulics-equipment',
      href: '/sources/hs-basic-tech-1/hydraulics-equipment/',
      title: '유압 발생장치와 조정기기',
      summary: '유압 시스템의 구성과 제어밸브로 큰 힘을 정밀하게 다루는 법',
      readingTime: 10,
      group: '반도체장비 공유압기술',
    },
    {
      id: 'c-basics',
      href: '/sources/hs-basic-tech-1/c-basics/',
      title: 'C언어의 기초',
      summary: '컴파일·변수·자료형 — 장비를 움직이는 코드의 첫걸음',
      readingTime: 12,
      group: '프로그래밍',
    },
    {
      id: 'c-programming',
      href: '/sources/hs-basic-tech-1/c-programming/',
      title: 'C프로그래밍 활용',
      summary: '연산자·함수와 실습 예제로 익히는 C프로그래밍 활용',
      readingTime: 14,
      group: '프로그래밍',
    },
  ],
};

/**
 * 반도체고 교과서 「반도체기초기술2」 — 「반도체기초기술1」의 응용편
 * (교류·디지털 회로, 장비 제조·선반, 투상도·CAD, 공유압 회로·유지보수·실습,
 * 마이크로프로세서·아두이노). 원자료
 * data/school-text/20260414_071612_반도체기초기술2_크리아트_/ 전면 재작성
 * (daegu 저작권 원칙 일괄). 원문 페이지 배치 정순 — book1식 순환 역산 불필요.
 * 실습 반복 구간은 "대표 상세 + 변형 표" 압축, 안전 유의사항은 전건 보존(Design §4).
 * 확장: `src/content/sources/hs-basic-tech-2/{module}.mdx` 작성 + `schoolTextMdx.tsx`
 * 로더 등록 + 아래 sections에 목차 순서대로 추가 (완성 모듈만).
 */
export const HS_BASIC_TECH_2: Source = {
  id: 'hs-basic-tech-2',
  kind: 'textbook',
  language: 'ko',
  title: '반도체기초기술 2',
  subtitle:
    '반도체고 교과서 — 교류·디지털 회로부터 CAD·공유압 실습·아두이노까지, 장비 기술의 응용',
  attribution: '정예원 외 4인',
  publisher: '크리아트출판사',
  license: 'fair-use',
  order: 7,
  accent: 'school',
  category: 'hs-textbook',
  sections: [
    {
      id: 'ac-circuits',
      href: '/sources/hs-basic-tech-2/ac-circuits/',
      title: '교류 회로',
      summary: '주파수·실횻값·임피던스부터 정류·정전압 회로까지, 교류를 다루는 법',
      readingTime: 13,
      group: '전기·전자 기초',
    },
    {
      id: 'digital-circuits',
      href: '/sources/hs-basic-tech-2/digital-circuits/',
      title: '디지털 회로',
      summary: '0과 1만으로 논리를 만드는 법 — 진법·게이트부터 가산기 실습까지',
      readingTime: 14,
      group: '전기·전자 기초',
    },
    {
      id: 'equipment-manufacturing',
      href: '/sources/hs-basic-tech-2/equipment-manufacturing/',
      title: '반도체 장비 제조',
      summary: '절삭·비절삭 가공으로 장비의 금속 부품 수만 개를 만드는 큰 그림',
      readingTime: 9,
      group: '기계 가공 기술',
    },
    {
      id: 'machine-tools',
      href: '/sources/hs-basic-tech-2/machine-tools/',
      title: '범용 공작 기계',
      summary: '재료가 도는 공작 기계, 선반 — 구조부터 다단축 가공 실습까지',
      readingTime: 11,
      group: '기계 가공 기술',
    },
    {
      id: 'special-projections',
      href: '/sources/hs-basic-tech-2/special-projections/',
      title: '특수 투상도 그리기',
      summary: '등각·부등각·사·투시 투상도 — 한 장에 입체감을 담는 네 가지 도법',
      readingTime: 8,
      group: '반도체장비 설계',
    },
    {
      id: 'development-drawings',
      href: '/sources/hs-basic-tech-2/development-drawings/',
      title: '전개도 그리기',
      summary: '입체를 펼쳐 철판 도면으로 — 전개도법 세 가지와 상관선의 원리',
      readingTime: 8,
      group: '반도체장비 설계',
    },
    {
      id: 'cad-drafting',
      href: '/sources/hs-basic-tech-2/cad-drafting/',
      title: '컴퓨터를 이용한 제도',
      summary: '손 제도에서 CAD로 — 좌표계·도면층부터 3D 모델링까지 핵심 개념',
      readingTime: 13,
      group: '반도체장비 설계',
    },
    {
      id: 'electropneumatic-circuits',
      href: '/sources/hs-basic-tech-2/electropneumatic-circuits/',
      title: '전기공압 회로 구성하기',
      summary: '접점·릴레이·논리 회로로 실린더의 작동 순서를 설계하는 법',
      readingTime: 14,
      group: '반도체장비 공유압기술',
    },
    {
      id: 'pneumatics-maintenance',
      href: '/sources/hs-basic-tech-2/pneumatics-maintenance/',
      title: '공압 장비의 유지·보수',
      summary: '예방정비로 압축기·필터·실린더를 오래, 안전하게 쓰는 법',
      readingTime: 11,
      group: '반도체장비 공유압기술',
    },
    {
      id: 'pneumatics-practice',
      href: '/sources/hs-basic-tech-2/pneumatics-practice/',
      title: '공압 실습 과제',
      summary: '직접·자동·순차 조작으로 단계를 밟는 복동 실린더 실습 3종',
      readingTime: 10,
      group: '반도체장비 공유압기술',
    },
    {
      id: 'electrohydraulic-circuits',
      href: '/sources/hs-basic-tech-2/electrohydraulic-circuits/',
      title: '전기유압 회로 구성하기',
      summary: '유량·방향·압력 제어밸브의 역할과 전기로 유압을 조종하는 법',
      readingTime: 14,
      group: '반도체장비 공유압기술',
    },
    {
      id: 'hydraulics-practice',
      href: '/sources/hs-basic-tech-2/hydraulics-practice/',
      title: '유압 실습 과제',
      summary: '미터 인·아웃부터 로킹·감압·시간 지연까지, 유압 회로 실습 8종',
      readingTime: 12,
      group: '반도체장비 공유압기술',
    },
    {
      id: 'microprocessor-basics',
      href: '/sources/hs-basic-tech-2/microprocessor-basics/',
      title: '마이크로프로세서 기초',
      summary: '손톱만 한 칩 속의 CPU·메모리·레지스터 — ATmega8535 들여다보기',
      readingTime: 13,
      group: '프로그래밍',
    },
    {
      id: 'microprocessor-practice',
      href: '/sources/hs-basic-tech-2/microprocessor-practice/',
      title: '마이크로프로세서 실습',
      summary: '코드 작성부터 칩에 굽기까지 — 개발 사이클 4단계와 LED 점등',
      readingTime: 9,
      group: '프로그래밍',
    },
    {
      id: 'arduino-practice',
      href: '/sources/hs-basic-tech-2/arduino-practice/',
      title: '아두이노 실습',
      summary: '초음파 3색 LED부터 블루투스 제어까지, 아두이노 실습 8종',
      readingTime: 14,
      group: '프로그래밍',
    },
  ],
};

/**
 * 반도체고 교과서 「반도체 포토·에칭」 — 포토·에칭 공정과 장비의 구조·운용·정비
 * (2015 개정 교육과정, 충청북도교육청 인정 2019-12-26). 원자료
 * data/school-text/20260415_163233_반도체_포토에칭_에이치앤지_/ 전면 재작성
 * (daegu 저작권 원칙 일괄). 원문 페이지 배치 정순.
 * ⚠️ 장비 모델(NSR-2205i11D·MARK-7·TE8500) 매뉴얼형 5개 중단원은
 * "장비 유형 일반화 특칙"(Design §4) 적용 — 조작 시퀀스 재현 금지.
 * 확장: `src/content/sources/hs-photo-etch/{module}.mdx` 작성 + `schoolTextMdx.tsx`
 * 로더 등록 + 아래 sections에 목차 순서대로 추가 (완성 모듈만).
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
  sections: [
    {
      id: 'process-overview',
      href: '/sources/hs-photo-etch/process-overview/',
      title: '반도체 공정의 개요',
      summary: '8대 공정의 큰 흐름 속에서 포토·에칭이 맡는 자리 찾기',
      readingTime: 8,
      group: '반도체 포토 공정',
    },
    {
      id: 'photo-process',
      href: '/sources/hs-photo-etch/photo-process/',
      title: '반도체 포토 공정의 개요',
      summary: '감광액 도포·노광·현상 — 트랙과 스테퍼가 회로를 새기는 순서',
      readingTime: 14,
      group: '반도체 포토 공정',
    },
    {
      id: 'photomask',
      href: '/sources/hs-photo-etch/photomask/',
      title: '포토 마스크 공정',
      summary: '원판 한 장이 수만 웨이퍼를 찍는다 — 마스크 제작과 3중 검사',
      readingTime: 11,
      group: '반도체 포토 공정',
    },
    {
      id: 'fab-cleanroom',
      href: '/sources/hs-photo-etch/fab-cleanroom/',
      title: '반도체 공정실 및 설비',
      summary: '먼지 한 톨과의 전쟁 — FAB 라인 구조와 청정복 착용 5단계',
      readingTime: 9,
      group: '반도체 포토 공정',
    },
    {
      id: 'track-equipment',
      href: '/sources/hs-photo-etch/track-equipment/',
      title: '트랙 장비의 구조와 기능',
      summary: '노광기 옆 자동 인화 라인 — 트랙 장비의 구조와 웨이퍼 반송 흐름',
      readingTime: 13,
      group: '포토 장비의 구조와 기능',
    },
    {
      id: 'exposure-equipment',
      href: '/sources/hs-photo-etch/exposure-equipment/',
      title: '노광 장비의 개요',
      summary: "얼라이너에서 스캐너까지 — 노광 장비가 걸어온 '더 가는 붓'의 역사",
      readingTime: 9,
      group: '포토 장비의 구조와 기능',
    },
    {
      id: 'stepper-structure',
      href: '/sources/hs-photo-etch/stepper-structure/',
      title: 'NSR-2205i11D 장비의 구조와 기능',
      summary: '스테퍼의 보편 구조 — 빛이 지나는 길과 정렬·포커스 계통',
      readingTime: 11,
      group: '포토 장비의 구조와 기능',
    },
    {
      id: 'track-operation',
      href: '/sources/hs-photo-etch/track-operation/',
      title: 'MARK-7 장비의 운용',
      summary: '트랙 장비를 순서대로 켜고 끄는 이유, 그리고 레시피 운용',
      readingTime: 12,
      group: '포토 장비의 운용',
    },
    {
      id: 'stepper-operation',
      href: '/sources/hs-photo-etch/stepper-operation/',
      title: 'NSR-2205i11D 장비의 운용',
      summary: '정렬·포커스·노광량 — 스테퍼를 정밀하게 부리는 운용의 원리',
      readingTime: 10,
      group: '포토 장비의 운용',
    },
    {
      id: 'photo-practice',
      href: '/sources/hs-photo-etch/photo-practice/',
      title: '포토 장비 실습과제',
      summary: '필터·컵 교환 실습으로 배우는 트랙 예방정비의 기본기',
      readingTime: 10,
      group: '포토 장비의 운용',
    },
    {
      id: 'etch-process',
      href: '/sources/hs-photo-etch/etch-process/',
      title: '에칭 공정',
      summary: '습식·건식 식각과 가스별 특성 — 장비 기술자가 돌리는 파라미터',
      readingTime: 16,
      group: '에칭 공정 및 장비',
    },
    {
      id: 'etch-equipment',
      href: '/sources/hs-photo-etch/etch-equipment/',
      title: '에칭 장비의 구성 요소',
      summary: '진공 속 수술실 — 에칭 챔버를 지키는 다섯 계통 뜯어보기',
      readingTime: 14,
      group: '에칭 공정 및 장비',
    },
    {
      id: 'etcher-structure',
      href: '/sources/hs-photo-etch/etcher-structure/',
      title: 'TE8500 장비의 구조 및 기능',
      summary: '카세트에서 챔버까지 — 웨이퍼가 거치는 에처의 몸속 구조',
      readingTime: 12,
      group: '에칭 장비의 운용',
    },
    {
      id: 'etcher-maintenance',
      href: '/sources/hs-photo-etch/etcher-maintenance/',
      title: 'TE8500 장비의 유지·보수',
      summary: '도달압력·리크 체크부터 — 에처를 지키는 Daily·Weekly PM',
      readingTime: 12,
      group: '에칭 장비의 운용',
    },
    {
      id: 'etch-practice',
      href: '/sources/hs-photo-etch/etch-practice/',
      title: '에칭 장비 실습과제',
      summary: '구성도 그리기부터 밸브 분해·조립까지 — 에칭 장비 실습 7종',
      readingTime: 10,
      group: '에칭 장비의 운용',
    },
  ],
};

/**
 * 반도체고 교과서 「반도체 박막·확산」 — 박막(증착)·확산 공정과 장비의
 * 구조·조작·유지보수 (2015 개정 교육과정, 충청북도교육청 인정 2019-12-26,
 * P3 「포토·에칭」과 같은 시리즈 자매편). 원자료
 * data/school-text/20260415_205038_반도체박막확산_에이치앤지_/ 전면 재작성.
 * ⚠️ 장비 매뉴얼 밀도 시리즈 최고(P-5000 CVD·TEL α-8 퍼니스, 터치 메뉴 시퀀스)
 * — "장비 일반화 특칙 강화판"(Design §4) 적용, 조작·터치 시퀀스 재현 금지.
 * 확장: `src/content/sources/hs-thinfilm-diffusion/{module}.mdx` 작성 +
 * `schoolTextMdx.tsx` 로더 등록 + 아래 sections에 목차 순서대로 추가 (완성 모듈만).
 */
export const HS_THINFILM_DIFFUSION: Source = {
  id: 'hs-thinfilm-diffusion',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 박막·확산',
  subtitle:
    '반도체고 교과서 — 박막(증착)·확산 공정부터 CVD 클러스터·퍼니스 장비의 구조·운용·정비까지',
  attribution: '이재선 외 4인',
  publisher: '에이치앤지',
  license: 'fair-use',
  order: 9,
  accent: 'school',
  category: 'hs-textbook',
  sections: [
    {
      id: 'thinfilm-process',
      href: '/sources/hs-thinfilm-diffusion/thinfilm-process/',
      title: '박막 공정의 개요',
      summary: 'PVD와 CVD — 웨이퍼 위에 도체·부도체·반도체 막을 쌓는 법',
      readingTime: 12,
      group: '공정의 개요',
    },
    {
      id: 'diffusion-process',
      href: '/sources/hs-thinfilm-diffusion/diffusion-process/',
      title: '확산 공정의 개요',
      summary: '산화와 LP-CVD — 쌓지 않고 스며들어 웨이퍼를 바꾸는 법',
      readingTime: 9,
      group: '공정의 개요',
    },
    {
      id: 'thinfilm-equipment',
      href: '/sources/hs-thinfilm-diffusion/thinfilm-equipment/',
      title: '박막 장비의 구조 및 기능',
      summary: '카세트에서 챔버까지 — 매엽식 클러스터 CVD 장비의 몸속 구조',
      readingTime: 15,
      group: '박막 장비',
    },
    {
      id: 'thinfilm-maintenance',
      href: '/sources/hs-thinfilm-diffusion/thinfilm-maintenance/',
      title: '박막 장비의 조작 및 유지보수',
      summary: '조작 화면 읽기부터 벤트·리크 체크까지 — CVD 장비 PM의 논리',
      readingTime: 13,
      group: '박막 장비',
    },
    {
      id: 'thinfilm-practice',
      href: '/sources/hs-thinfilm-diffusion/thinfilm-practice/',
      title: '박막 장비의 실습',
      summary: '챔버 벤트부터 MFC 교체까지 — 박막 장비 실습 7종',
      readingTime: 11,
      group: '박막 장비',
    },
    {
      id: 'diffusion-equipment',
      href: '/sources/hs-thinfilm-diffusion/diffusion-equipment/',
      title: '확산 장비의 구조 및 기능',
      summary: '웨이퍼 수십 장을 한 번에 굽는 배치식 — 수직형 퍼니스의 구조',
      readingTime: 11,
      group: '확산 장비',
    },
    {
      id: 'diffusion-maintenance',
      href: '/sources/hs-thinfilm-diffusion/diffusion-maintenance/',
      title: '확산 장비의 조작 및 유지보수',
      summary: '레시피 화면부터 가스라인 리크 체크까지 — 확산로 조작과 정비',
      readingTime: 14,
      group: '확산 장비',
    },
    {
      id: 'diffusion-practice',
      href: '/sources/hs-thinfilm-diffusion/diffusion-practice/',
      title: '확산 장비의 실습',
      summary: '오토셔터부터 튜브 분해까지 — 확산로 실습 6종',
      readingTime: 11,
      group: '확산 장비',
    },
  ],
};

/**
 * 반도체고 교과서 「반도체 조립·검사」 — 후공정(패키징) 조립·검사 공정과
 * 쏘잉·다이 본딩·프로브 테스트·파티클 카운터 장비의 구조·조작·유지보수
 * (2015 개정 교육과정, 충청북도교육청 인정 15-충북-63-고교-19-004 —
 * 「포토·에칭」(-002)·「박막·확산」(-003)과 같은 시리즈 3권째). 원자료
 * data/school-text/20260415_182247_반도체조립검사_에이치앤지_/ 전면 재작성.
 * ⚠️ 조작 서술 노골("조작버튼 F3 Enter"·AC 전원 시퀀스) — "장비 일반화
 * 특칙"(Design §4) 적용, 버튼·화면 조작 시퀀스 재현 금지.
 * 확장: `src/content/sources/hs-assembly-inspection/{module}.mdx` 작성 +
 * `schoolTextMdx.tsx` 로더 등록 + 아래 sections에 목차 순서대로 추가 (완성 모듈만).
 */
export const HS_ASSEMBLY_INSPECTION: Source = {
  id: 'hs-assembly-inspection',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 조립·검사',
  subtitle:
    '반도체고 교과서 — 패키징 조립 공정부터 쏘잉·다이 본딩 장비, 프로브 테스트·파티클 카운터 검사까지',
  attribution: '김경원 외 3인',
  publisher: '에이치앤지',
  license: 'fair-use',
  order: 10,
  accent: 'school',
  category: 'hs-textbook',
  sections: [
    {
      id: 'packaging-overview',
      href: '/sources/hs-assembly-inspection/packaging-overview/',
      title: '반도체 조립 개요',
      summary: '웨이퍼에서 검은 칩까지 — 패키지의 네 가지 일과 조립 공정 8단계',
      readingTime: 11,
      group: '조립 개요',
    },
    {
      id: 'sawing-process',
      href: '/sources/hs-assembly-inspection/sawing-process/',
      title: '쏘잉 공정 및 장비 개요',
      summary: '판 초콜릿 쪼개듯 — 웨이퍼가 낱개 칩으로 갈라지는 다이싱의 첫 지도',
      readingTime: 6,
      group: '쏘잉 장비',
    },
    {
      id: 'sawing-equipment',
      href: '/sources/hs-assembly-inspection/sawing-equipment/',
      title: '쏘잉 장비의 구조 및 기능',
      summary: '테이프 마운터와 쏘잉 머신 — 절삭을 만드는 네 계통 뜯어보기',
      readingTime: 9,
      group: '쏘잉 장비',
    },
    {
      id: 'sawing-operation',
      href: '/sources/hs-assembly-inspection/sawing-operation/',
      title: '쏘잉 장비의 조작',
      summary: '준비→자동 절삭→종료 — 순서에 담긴 안전과 정밀의 논리',
      readingTime: 11,
      group: '쏘잉 장비',
    },
    {
      id: 'sawing-practice',
      href: '/sources/hs-assembly-inspection/sawing-practice/',
      title: '쏘잉 장비의 모듈 실습 및 유지·보수',
      summary: '블레이드 교체부터 그리스 도포까지 — 쏘잉 장비 예방정비의 리듬',
      readingTime: 13,
      group: '쏘잉 장비',
    },
    {
      id: 'diebond-process',
      href: '/sources/hs-assembly-inspection/diebond-process/',
      title: '다이 본딩 공정 및 장비 개요',
      summary: '양품 칩에 다리를 놓다 — 다이 본딩과 리드 프레임',
      readingTime: 6,
      group: '다이 본딩 장비',
    },
    {
      id: 'diebond-equipment',
      href: '/sources/hs-assembly-inspection/diebond-equipment/',
      title: '다이 본딩 장비의 구조 및 기능',
      summary: '집는 손과 풀 짜는 손 — 다이 본더와 에폭시 디스펜서의 구조',
      readingTime: 9,
      group: '다이 본딩 장비',
    },
    {
      id: 'diebond-operation',
      href: '/sources/hs-assembly-inspection/diebond-operation/',
      title: '다이 본딩 장비의 조작',
      summary: '초기화·필링·노즐 티칭 — 다이 본딩 조작 순서의 논리',
      readingTime: 11,
      group: '다이 본딩 장비',
    },
    {
      id: 'diebond-practice',
      href: '/sources/hs-assembly-inspection/diebond-practice/',
      title: '다이 본딩 장비의 모듈 실습 및 유지·보수',
      summary: '에폭시 디스펜서 분해·조립과 윤활 관리 — 다이 본더 예방정비',
      readingTime: 9,
      group: '다이 본딩 장비',
    },
    {
      id: 'inspection-overview',
      href: '/sources/hs-assembly-inspection/inspection-overview/',
      title: '반도체 검사 개요',
      summary: '웨이퍼 레벨과 패키지 레벨 — 두 번 검사하는 이유',
      readingTime: 11,
      group: '검사 개요',
    },
    {
      id: 'probe-test',
      href: '/sources/hs-assembly-inspection/probe-test/',
      title: '프로브 테스트 장비',
      summary: '머리카락보다 가는 바늘 수백 개 — 프로버의 정렬과 접촉',
      readingTime: 15,
      group: '프로브 테스트 장비',
    },
    {
      id: 'particle-counter',
      href: '/sources/hs-assembly-inspection/particle-counter/',
      title: '파티클 카운터 장비',
      summary: '레이저 빛으로 먼지를 세다 — 웨이퍼 표면 검사, 클린룸의 눈',
      readingTime: 12,
      group: '파티클 카운터 장비',
    },
  ],
};

export const HS_EQUIPMENT_MAINTENANCE: Source = {
  id: 'hs-equipment-maintenance',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 장비 유지 보수',
  subtitle:
    '반도체고 교과서 — 장비 산업·직무부터 공정/요소/설계 기술, 예방보전·TPM·장비별 유지보수까지',
  attribution: '왕현철 외 3인',
  publisher: '충남반도체마이스터고등학교',
  license: 'fair-use',
  order: 11,
  accent: 'school',
  category: 'hs-textbook',
  sections: [
    {
      id: 'industry-trend',
      href: '/sources/hs-equipment-maintenance/industry-trend/',
      title: '반도체 장비 산업과 개발 직무',
      summary: '누가 반도체 장비를 만드나 — 전공정 80%·후공정 20%, 글로벌 5대 기업과 장비 개발 5단계',
      readingTime: 8,
      group: '장비 산업 동향',
    },
    {
      id: 'process-wafer-photo',
      href: '/sources/hs-equipment-maintenance/process-wafer-photo/',
      title: '웨이퍼 제조·포토 장비',
      summary: '잉곳에서 노광까지 — 회로를 새기는 첫 장비들을 정비 기술자의 눈으로',
      readingTime: 8,
      group: '공정 장비',
    },
    {
      id: 'process-etch-deposition',
      href: '/sources/hs-equipment-maintenance/process-etch-deposition/',
      title: '에칭·증착 장비',
      summary: '깎고 쌓는 두 장비 — 식각 챔버와 박막 증착 설비의 구조',
      readingTime: 9,
      group: '공정 장비',
    },
    {
      id: 'process-frontend-backend',
      href: '/sources/hs-equipment-maintenance/process-frontend-backend/',
      title: '전공정·후공정 장비',
      summary: '이온 주입부터 다이싱·검사까지 — 나머지 공정 장비 한눈에',
      readingTime: 10,
      group: '공정 장비',
    },
    {
      id: 'element-vacuum-gas',
      href: '/sources/hs-equipment-maintenance/element-vacuum-gas/',
      title: '진공·가스 공급 기술',
      summary: '챔버를 비우고 채우다 — 펌프와 가스 라인, 스크러버의 안전',
      readingTime: 9,
      group: '요소 기술',
    },
    {
      id: 'element-plasma',
      href: '/sources/hs-equipment-maintenance/element-plasma/',
      title: '플라스마 기술',
      summary: '제4의 물질 상태 — RF로 만드는 플라스마와 고주파 안전',
      readingTime: 6,
      group: '요소 기술',
    },
    {
      id: 'element-pneumatic-thermal',
      href: '/sources/hs-equipment-maintenance/element-pneumatic-thermal/',
      title: '공압·온도 제어 기술',
      summary: '압축 공기와 열 — 장비를 움직이고 온도를 지키는 유틸리티',
      readingTime: 9,
      group: '요소 기술',
    },
    {
      id: 'element-power',
      href: '/sources/hs-equipment-maintenance/element-power/',
      title: '전원 공급 기술',
      summary: '안정된 전기가 정밀을 만든다 — 장비 전원과 접지',
      readingTime: 7,
      group: '요소 기술',
    },
    {
      id: 'design-concept-mechanical',
      href: '/sources/hs-equipment-maintenance/design-concept-mechanical/',
      title: '콘셉트·기구 설계',
      summary: '장비를 그리다 — 사양 검토부터 3D 기구 설계까지',
      readingTime: 15,
      group: '설계 기술',
    },
    {
      id: 'design-electrical',
      href: '/sources/hs-equipment-maintenance/design-electrical/',
      title: '전장 설계',
      summary: '멈춤이 곧 안전 — 인터로크·비상정지·안전 PLC 설계',
      readingTime: 9,
      group: '설계 기술',
    },
    {
      id: 'design-control-software',
      href: '/sources/hs-equipment-maintenance/design-control-software/',
      title: '장비 제어·S/W 설계',
      summary: '장비를 움직이는 두뇌 — 제어 하드웨어와 소프트웨어',
      readingTime: 12,
      group: '설계 기술',
    },
    {
      id: 'maintenance-fundamentals',
      href: '/sources/hs-equipment-maintenance/maintenance-fundamentals/',
      title: '유지보수 개론',
      summary: '고장 나기 전에 손본다 — 예방보전·TPM·SEMI 표준',
      readingTime: 9,
      group: '장비 관리',
    },
    {
      id: 'maintenance-setup',
      href: '/sources/hs-equipment-maintenance/maintenance-setup/',
      title: '장비 셋업',
      summary: '새 장비를 들이는 절차 — 설치·검수부터 운영 중 정비까지',
      readingTime: 6,
      group: '장비 관리',
    },
    {
      id: 'maintenance-by-type',
      href: '/sources/hs-equipment-maintenance/maintenance-by-type/',
      title: '주요 장비별 유지보수',
      summary: '진공·광학·열·검사·이송 — 장비마다 다른 정비의 급소와 에너지 격리',
      readingTime: 14,
      group: '장비 관리',
    },
  ],
};

export const HS_SEMICON_INFRA: Source = {
  id: 'hs-semicon-infra',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 인프라 일반',
  subtitle:
    '반도체고 교과서 — 산업안전과 건강관리: 공정별 유해요인·건강영향·작업환경관리 (전·후공정 전체)',
  attribution: '서울시교육청 인정',
  publisher: '서울특별시교육청',
  license: 'fair-use',
  order: 12,
  accent: 'school',
  category: 'hs-textbook',
  // 이번 사이클 = Ⅳ '산업안전과 건강관리' 트랙만 완주. 완성 모듈만 등록(로더와 짝).
  // 나머지 3단원(개요·전기설비·공조)은 후속 사이클 로드맵.
  // 등록 순서 = 교과서 목차 순서(제조환경 → 전공정 → 후공정) = 이전/다음 내비.
  sections: [
    {
      id: 'safety-management',
      href: '/sources/hs-semicon-infra/safety-management/',
      title: '안전보건 관리와 제조 환경',
      summary: '클린룸·방진복부터 산업안전보건법·위험성평가까지 — 반도체 안전의 토대',
      readingTime: 10,
      group: '안전보건 기초',
    },
    {
      id: 'safety-diffusion',
      href: '/sources/hs-semicon-infra/safety-diffusion/',
      title: '확산 공정 안전',
      summary: '위험은 멈췄을 때 새어 나온다 — 확산로 PM 작업의 아르신·불산 노출과 용혈성 빈혈',
      readingTime: 9,
      group: '전공정 안전',
    },
    {
      id: 'safety-photo',
      href: '/sources/hs-semicon-infra/safety-photo/',
      title: '포토 공정 안전',
      summary: '감광액·현상액의 두 얼굴 — HMDS·PR 유기용제·TMAH와 천식·생식독성·벤젠',
      readingTime: 8,
      group: '전공정 안전',
    },
    {
      id: 'safety-etch',
      href: '/sources/hs-semicon-infra/safety-etch/',
      title: '식각 공정 안전',
      summary: '깎아 내는 힘의 대가 — 습식 산·건식 플라즈마 가스와 화상·후두암',
      readingTime: 8,
      group: '전공정 안전',
    },
    {
      id: 'safety-deposition',
      href: '/sources/hs-semicon-infra/safety-deposition/',
      title: '증착 공정 안전',
      summary: '쌓는 가스의 위험 — 실란의 자연발화와 밀폐 공간 질식',
      readingTime: 7,
      group: '전공정 안전',
    },
    {
      id: 'safety-ion-implant',
      href: '/sources/hs-semicon-infra/safety-ion-implant/',
      title: '이온 주입 공정 안전',
      summary: '보이지 않는 두 위험 — 도판트 독성 가스와 전리 방사선',
      readingTime: 8,
      group: '전공정 안전',
    },
    {
      id: 'safety-cmp',
      href: '/sources/hs-semicon-infra/safety-cmp/',
      title: '연마(CMP) 공정 안전',
      summary: '갈아 내며 튀는 것들 — 슬러리·강알칼리 미스트와 피부 화상',
      readingTime: 6,
      group: '전공정 안전',
    },
    {
      id: 'safety-backend-mechanical',
      href: '/sources/hs-semicon-infra/safety-backend-mechanical/',
      title: '후공정 안전 ① 후면연마·절단·칩접착',
      summary: '칩을 자르고 붙일 때 — TMAH 화상·실리콘 분진·에폭시 천식',
      readingTime: 9,
      group: '후공정 안전',
    },
    {
      id: 'safety-backend-chemical',
      href: '/sources/hs-semicon-infra/safety-backend-chemical/',
      title: '후공정 안전 ② 몰드·마킹·도금·솔더볼',
      summary: '열로 굳히고 도금할 때 — EMC 벤젠·삼산화안티몬과 발암 위험',
      readingTime: 10,
      group: '후공정 안전',
    },
    {
      id: 'safety-backend-test',
      href: '/sources/hs-semicon-infra/safety-backend-test/',
      title: '후공정 안전 ③ 열적 테스트·X선 검사',
      summary: '가열·투과 검사의 뒷면 — 휘발성 유기물과 전리 방사선',
      readingTime: 6,
      group: '후공정 안전',
    },
  ],
};

export const SOURCES: Source[] = [
  EPI_BOOK,
  OSHA_SCS,
  NCS_SEMI,
  HS_SEMI_BASICS,
  DAEGU_HS,
  HS_BASIC_TECH_1,
  HS_BASIC_TECH_2,
  HS_PHOTO_ETCH,
  HS_THINFILM_DIFFUSION,
  HS_ASSEMBLY_INSPECTION,
  HS_EQUIPMENT_MAINTENANCE,
  HS_SEMICON_INFRA,
];

export function getOrderedSources(): Source[] {
  return [...SOURCES].sort((a, b) => a.order - b.order);
}

export interface SourceGroup {
  category: SourceCategory;
  label: string;
  sources: Source[];
}

/**
 * order 순 자료원을 UI 그룹으로 분할.
 * - `standalone`: category 없는 독립 자료원
 * - `groups`: category별 묶음 (category 등장 순서 유지, 라벨은 SOURCE_CATEGORY_LABELS 파생)
 * category를 순회하므로 새 category 추가 시 자동으로 그룹이 생긴다 (하드코딩·무음 탈락 없음).
 */
export function getGroupedSources(): { standalone: Source[]; groups: SourceGroup[] } {
  const ordered = getOrderedSources();
  const standalone = ordered.filter((s) => !s.category);
  const byCategory = new Map<SourceCategory, Source[]>();
  for (const s of ordered) {
    if (!s.category) continue;
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }
  const groups = [...byCategory.entries()].map(([category, sources]) => ({
    category,
    label: SOURCE_CATEGORY_LABELS[category],
    sources,
  }));
  return { standalone, groups };
}

export function getSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}

export function getSourceSection(
  sourceId: string,
  sectionId: string,
): { source: Source; section: SourceSection } | undefined {
  const source = getSource(sourceId);
  if (!source) return undefined;
  const section = source.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  return { source, section };
}
