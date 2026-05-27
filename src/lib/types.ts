/**
 * 공통 타입 정의
 * Design 문서: docs/02-design/features/semiconductor-academy-site.design.md (§3)
 */

export type ProcessId =
  | 'wafer'
  | 'cleaning'
  | 'diffusion'
  | 'photolithography'
  | 'etching'
  | 'deposition'
  | 'ion-implantation'
  | 'cmp'
  | 'packaging';

export type ChemicalCategory =
  | 'solvent'
  | 'acid'
  | 'base'
  | 'gas'
  | 'metal'
  | 'photoresist'
  | 'slurry'
  | 'dopant'
  | 'byproduct';

export type HazardType =
  | 'carcinogen-1'
  | 'carcinogen-2a'
  | 'reproductive-toxin'
  | 'mutagen'
  | 'corrosive'
  | 'acute-toxic'
  | 'sensitizer';

export interface SourceRef {
  page: number;
  section: string;
}

export interface Chemical {
  id: string;
  nameKo: string;
  nameEn: string;
  formula?: string;
  casNo?: string;
  category: ChemicalCategory;
  usedIn: ProcessId[];
  hazards: HazardType[];
  hazardSummary: string;
  easyExplain: string;
  detailMd?: string;
  sourceRef: SourceRef;
}

export interface ProcessStep {
  id: string;
  nameKo: string;
  description: string;
  duration?: string;
}

export interface Process {
  id: ProcessId;
  order: number;
  nameKo: string;
  nameEn: string;
  slug: string;
  oneLine: string;
  analogy: string;
  iconName: string;
  color: string;
  steps: ProcessStep[];
  chemicals: string[];
  hazardKeywords: string[];
}

export interface Term {
  id: string;
  termKo: string;
  termEn?: string;
  shortDef: string;
  fullDef?: string;
  relatedTerms?: string[];
}

export interface ChapterFrontmatter {
  title: string;
  slug: string;
  order: number;
  category: 'intro' | 'foundation' | 'process' | 'hazard' | 'disease';
  readingTime: number;
  description: string;
  sourceChapter: string;
  sourcePages: [number, number];
  relatedProcesses?: ProcessId[];
  relatedChemicals?: string[];
}

/** 유해성 타입별 한국어 라벨 */
export const HAZARD_LABELS: Record<HazardType, string> = {
  'carcinogen-1': '발암성 1군',
  'carcinogen-2a': '발암성 2A군',
  'reproductive-toxin': '생식독성',
  mutagen: '변이원성',
  corrosive: '부식성',
  'acute-toxic': '급성 독성',
  sensitizer: '감작성',
};

/** 분류 한국어 라벨 */
export const CATEGORY_LABELS: Record<ChemicalCategory, string> = {
  solvent: '유기용제',
  acid: '산',
  base: '염기',
  gas: '가스',
  metal: '금속',
  photoresist: '포토레지스트',
  slurry: '슬러리',
  dopant: '도펀트',
  byproduct: '부산물',
};

/** 유해성 → 컬러 토큰 매핑 */
export const HAZARD_COLOR: Record<HazardType, string> = {
  'carcinogen-1': 'hazard-critical',
  'carcinogen-2a': 'hazard-high',
  'reproductive-toxin': 'hazard-high',
  mutagen: 'hazard-high',
  corrosive: 'hazard-moderate',
  'acute-toxic': 'hazard-critical',
  sensitizer: 'hazard-moderate',
};
