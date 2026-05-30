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

export const SOURCES: Source[] = [EPI_BOOK, OSHA_SCS];

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
