/**
 * Cross-link 통제 어휘 + 인덱스 타입.
 *
 * Design: docs/02-design/features/cross-link-system.design.md §3.1
 *
 * ⚠️ 어휘 확장 시 반드시 두 곳을 함께 수정해야 한다:
 *   1. 이 파일의 TOPICS / HAZARDS 배열
 *   2. src/data/schema-enum.json (빌드 스크립트용 JSON 미러)
 *
 * 빌드 스크립트(.mjs)는 TypeScript를 직접 import 할 수 없으므로
 * JSON 미러로 단일 진실을 유지한다.
 */

// ─────────────────────────────────────────────────────────────
// Topic — 주제축 (현재 21개, Plan §6.2 ≤22 한도)
// ─────────────────────────────────────────────────────────────

export const TOPICS = [
  // foundation
  'ghs',
  'sds-label',
  'chemical-inventory',
  // process safety
  'cleanroom',
  'wafer-fab',
  'photolithography',
  'etching',
  'diffusion',
  'deposition',
  'ion-implantation',
  'cmp',
  'packaging',
  // hazard themes
  'gas-safety',
  'liquid-chemicals',
  'compressed-gas',
  'cryogenic',
  'storage-compatibility',
  // controls
  'engineering-controls',
  'ppe',
  'emergency-response',
  // health
  'occupational-disease',
  'exposure-monitoring',
  'industrial-hygiene',
] as const;

export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  ghs: 'GHS',
  'sds-label': 'SDS·라벨',
  'chemical-inventory': '화학물질 목록·관리',
  cleanroom: '클린룸',
  'wafer-fab': '웨이퍼 제조',
  photolithography: '포토리소그래피',
  etching: '식각',
  diffusion: '확산',
  deposition: '증착',
  'ion-implantation': '이온주입',
  cmp: 'CMP',
  packaging: '패키징',
  'gas-safety': '가스 안전',
  'liquid-chemicals': '액체 화학물질',
  'compressed-gas': '압축가스',
  cryogenic: '극저온',
  'storage-compatibility': '저장·양립성',
  'engineering-controls': '엔지니어링 통제',
  ppe: '개인보호장구',
  'emergency-response': '비상 대응',
  'occupational-disease': '직업병',
  'exposure-monitoring': '노출 모니터링',
  'industrial-hygiene': '산업위생',
};

// ─────────────────────────────────────────────────────────────
// Hazard — 위험 분류축 (현재 12개)
// ─────────────────────────────────────────────────────────────

export const HAZARDS = [
  'flammable',
  'pyrophoric',
  'oxidizer',
  'corrosive',
  'toxic',
  'acute-toxic',
  'carcinogen',
  'reproductive-toxin',
  'sensitizer',
  'compressed-gas',
  'cryogenic',
  'reactive',
] as const;

export type Hazard = (typeof HAZARDS)[number];

export const HAZARD_LABELS_CL: Record<Hazard, string> = {
  flammable: '인화성',
  pyrophoric: '자연발화성',
  oxidizer: '산화성',
  corrosive: '부식성',
  toxic: '독성',
  'acute-toxic': '급성 독성',
  carcinogen: '발암성',
  'reproductive-toxin': '생식독성',
  sensitizer: '감작성',
  'compressed-gas': '압축가스',
  cryogenic: '극저온',
  reactive: '반응성',
};

// ─────────────────────────────────────────────────────────────
// Chemical ID — lib/types.ts의 Chemical['id'] 재사용
// ─────────────────────────────────────────────────────────────

export type ChemicalId = string;

// ─────────────────────────────────────────────────────────────
// 작성 단위 (per section, _links.json 파일 형식)
// ─────────────────────────────────────────────────────────────

export interface SectionLinks {
  topics?: Topic[];
  hazards?: Hazard[];
  chemicals?: ChemicalId[];
}

export interface SourceLinksFile {
  [sectionId: string]: SectionLinks;
}

// ─────────────────────────────────────────────────────────────
// 빌드 산출물 (src/data/cross-link.json)
// ─────────────────────────────────────────────────────────────

export const CROSS_LINK_SCHEMA_VERSION = 1 as const;

export interface CrossLinkIndex {
  /** Schema version. Breaking change 시 증가. lookup.ts가 호환성 확인. */
  version: typeof CROSS_LINK_SCHEMA_VERSION;
  /** 빌드 시점 ISO timestamp */
  generatedAt: string;
  /** 인덱스에 포함된 자료원 ID 목록 (스냅샷) */
  sources: string[];
  /** 정방향: "{sourceId}::{sectionId}" → SectionLinks */
  bySection: Record<string, SectionLinks>;
  /** 역방향: topic → SectionRef[] */
  byTopic: Partial<Record<Topic, SectionRef[]>>;
  /** 역방향: hazard → SectionRef[] */
  byHazard: Partial<Record<Hazard, SectionRef[]>>;
  /** 역방향: chemicalId → SectionRef[] */
  byChemical: Record<ChemicalId, SectionRef[]>;
  /** chemicals.json에 없는 미등록 ID (경고 추적, graceful degradation) */
  unknownChemicals: ChemicalId[];
}

export interface SectionRef {
  sourceId: string;
  sectionId: string;
}

// ─────────────────────────────────────────────────────────────
// Runtime 조회용 (lookup.ts 반환)
// ─────────────────────────────────────────────────────────────

export interface RelatedItem {
  sourceId: string;
  sectionId: string;
  title: string;
  href: string;
  /** 공유 태그 — chip 표시용 */
  sharedTopics: Topic[];
  sharedHazards: Hazard[];
  sharedChemicals: ChemicalId[];
  /** 정렬용: 공유 태그 총수 */
  shareScore: number;
}

export interface RelatedGroup {
  sourceId: string;
  items: RelatedItem[];
}

// ─────────────────────────────────────────────────────────────
// Composite key helpers
// ─────────────────────────────────────────────────────────────

/** "{sourceId}::{sectionId}" 키 생성. */
export function makeSectionKey(sourceId: string, sectionId: string): string {
  return `${sourceId}::${sectionId}`;
}

export function parseSectionKey(key: string): SectionRef {
  const [sourceId, sectionId] = key.split('::');
  return { sourceId, sectionId };
}
