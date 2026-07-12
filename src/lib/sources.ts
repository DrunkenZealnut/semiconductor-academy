/**
 * 자료원(Source) 레지스트리
 * Design: docs/02-design/features/multi-source-learning-platform.design.md §3.1
 *
 * - EPI_BOOK: 「반도체 산업의 유해인자」 (윤충식 외) — 17 챕터를 SourceSection으로 노출
 * - OSHA_SCS: OSHA Semiconductor Chemical Safety 5 Part — Phase B에서 본문 추가
 */

import { chapters } from './chapters';
import type { Chapter, Source, SourceSection } from './types';

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
      id: 'custom-layout-verification',
      href: '/sources/ncs-semi/custom-layout-verification/',
      title: '커스텀 레이아웃 검증',
      summary: '그린 도면이 공장의 규칙과 회로에 맞는지 DRC·LVS로 확인하는 일',
      readingTime: 9,
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
      id: 'flip-package-development',
      href: '/sources/ncs-semi/flip-package-development/',
      title: '플립 패키지 개발',
      summary: '칩을 뒤집어 기판에 직접 붙이는 첨단 패키지를 개발하는 일',
      readingTime: 10,
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
      id: 'material-safety',
      href: '/sources/ncs-semi/material-safety/',
      title: '반도체 재료 안전관리',
      summary: 'MSDS부터 폐기물까지 — 화학 재료의 위험을 알고 재고 대비하는 일',
      readingTime: 10,
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
      id: 'flipchip-materials',
      href: '/sources/ncs-semi/flipchip-materials/',
      title: '반도체용 플립칩 재료 제조',
      summary: '범프·언더필 등 플립칩 패키지 재료를 만들고 신뢰성을 시험하는 일',
      readingTime: 9,
      group: '반도체재료',
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
      id: 'equipment-assembly',
      href: '/sources/ncs-semi/equipment-assembly/',
      title: '반도체 장비 기구 조립 검증',
      summary: '조립한 장비 기구가 정밀도 기준을 만족하는지 검증하는 일',
      readingTime: 10,
      group: '반도체장비',
    },
  ],
};

export const SOURCES: Source[] = [EPI_BOOK, OSHA_SCS, NCS_SEMI];

export function getOrderedSources(): Source[] {
  return [...SOURCES].sort((a, b) => a.order - b.order);
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
