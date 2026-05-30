/**
 * Cross-link runtime lookup.
 *
 * Design: docs/02-design/features/cross-link-system.design.md §4.2
 *
 * 핵심 책임:
 * - 같은 source 내 자기 참조 자동 제외
 * - 자료원 그룹화 + source.order 정렬
 * - shareScore desc 정렬, 그룹당 maxPerGroup (default 6) 제한
 * - sources.ts에서 section의 title/href를 resolve해 RelatedItem으로 변환
 */

import crossLinkData from '@/data/cross-link.json';
import { getOrderedSources, getSourceSection } from '@/lib/sources';
import {
  type ChemicalId,
  CROSS_LINK_SCHEMA_VERSION,
  type CrossLinkIndex,
  type Hazard,
  makeSectionKey,
  type RelatedGroup,
  type RelatedItem,
  type SectionLinks,
  type SectionRef,
  type Topic,
} from './schema';

const index = crossLinkData as unknown as CrossLinkIndex;

if (index.version !== CROSS_LINK_SCHEMA_VERSION) {
  // 빌드와 런타임이 다른 schema 버전을 사용하면 즉시 알리기.
  console.warn(
    `[cross-link] schema version mismatch: data=${index.version}, runtime=${CROSS_LINK_SCHEMA_VERSION}`,
  );
}

const DEFAULT_MAX_PER_GROUP = 6;

interface LookupOptions {
  /** 그룹당 최대 항목 수 (기본 6) */
  maxPerGroup?: number;
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * 특정 section과 cross-link된 다른 자료원의 항목 조회.
 *
 * - 같은 sourceId 자기 참조는 제외
 * - 자료원 그룹별 (source.order 오름차순)
 * - 그룹 내: shareScore desc → section.order asc → sectionId asc
 * - 그룹당 maxPerGroup 항목 제한
 */
export function lookupRelated(
  sourceId: string,
  sectionId: string,
  options: LookupOptions = {},
): RelatedGroup[] {
  const maxPerGroup = options.maxPerGroup ?? DEFAULT_MAX_PER_GROUP;
  const ownTags = index.bySection[makeSectionKey(sourceId, sectionId)];
  if (!ownTags) return [];

  // 후보 ref 수집 + 공유 태그 합산
  const candidates = collectCandidates(ownTags, (ref) => ref.sourceId !== sourceId);

  return groupAndSort(candidates, maxPerGroup);
}

/**
 * 특정 chemical을 다루는 모든 자료원의 섹션 조회.
 * /chemicals/[id] 페이지의 ChemicalSourceHub용.
 *
 * - 자료원 그룹별 (source.order 오름차순)
 * - 그룹 내: section.order asc → sectionId asc
 * - 자기 참조 개념 없음 (chemical id는 자료원과 무관)
 */
export function lookupByChemical(
  chemicalId: ChemicalId,
  options: LookupOptions = {},
): RelatedGroup[] {
  const maxPerGroup = options.maxPerGroup ?? DEFAULT_MAX_PER_GROUP;
  const refs = index.byChemical[chemicalId] ?? [];

  // 공유 태그는 자체 chemical 1개 (shareScore = 1)
  const items = refs
    .map((ref) => buildRelatedItem(ref, { sharedChemicals: [chemicalId] }))
    .filter((it): it is RelatedItem => it !== null);

  return groupAndSort(items, maxPerGroup);
}

/** 디버그/툴링용 */
export function getCrossLinkSchemaVersion(): number {
  return index.version;
}

/** 미등록 chemical ID 목록 (graceful degradation 추적) */
export function getUnknownChemicals(): ChemicalId[] {
  return index.unknownChemicals;
}

// ─────────────────────────────────────────────────────────────
// Internal
// ─────────────────────────────────────────────────────────────

function collectCandidates(
  ownTags: SectionLinks,
  filter: (ref: SectionRef) => boolean,
): RelatedItem[] {
  // sourceKey -> sharedTopics/Hazards/Chemicals
  const acc = new Map<
    string,
    {
      ref: SectionRef;
      topics: Set<Topic>;
      hazards: Set<Hazard>;
      chemicals: Set<ChemicalId>;
    }
  >();

  function ensure(ref: SectionRef) {
    const key = makeSectionKey(ref.sourceId, ref.sectionId);
    let entry = acc.get(key);
    if (!entry) {
      entry = { ref, topics: new Set(), hazards: new Set(), chemicals: new Set() };
      acc.set(key, entry);
    }
    return entry;
  }

  for (const t of ownTags.topics ?? []) {
    for (const ref of index.byTopic[t] ?? []) {
      if (!filter(ref)) continue;
      ensure(ref).topics.add(t);
    }
  }
  for (const h of ownTags.hazards ?? []) {
    for (const ref of index.byHazard[h] ?? []) {
      if (!filter(ref)) continue;
      ensure(ref).hazards.add(h);
    }
  }
  for (const c of ownTags.chemicals ?? []) {
    for (const ref of index.byChemical[c] ?? []) {
      if (!filter(ref)) continue;
      ensure(ref).chemicals.add(c);
    }
  }

  const items: RelatedItem[] = [];
  for (const { ref, topics, hazards, chemicals } of acc.values()) {
    const it = buildRelatedItem(ref, {
      sharedTopics: [...topics],
      sharedHazards: [...hazards],
      sharedChemicals: [...chemicals],
    });
    if (it) items.push(it);
  }
  return items;
}

function buildRelatedItem(
  ref: SectionRef,
  shared: {
    sharedTopics?: Topic[];
    sharedHazards?: Hazard[];
    sharedChemicals?: ChemicalId[];
  },
): RelatedItem | null {
  const resolved = getSourceSection(ref.sourceId, ref.sectionId);
  if (!resolved) return null;
  const sharedTopics = shared.sharedTopics ?? [];
  const sharedHazards = shared.sharedHazards ?? [];
  const sharedChemicals = shared.sharedChemicals ?? [];
  return {
    sourceId: ref.sourceId,
    sectionId: ref.sectionId,
    title: resolved.section.title,
    href: resolved.section.href,
    sharedTopics,
    sharedHazards,
    sharedChemicals,
    shareScore: sharedTopics.length + sharedHazards.length + sharedChemicals.length,
  };
}

function groupAndSort(items: RelatedItem[], maxPerGroup: number): RelatedGroup[] {
  // 자료원별 그룹화
  const groups = new Map<string, RelatedItem[]>();
  for (const it of items) {
    (groups.get(it.sourceId) ?? groups.set(it.sourceId, []).get(it.sourceId)!).push(it);
  }

  // sourceId → order 매핑
  const sourceOrder = new Map<string, number>();
  for (const s of getOrderedSources()) sourceOrder.set(s.id, s.order);

  const result: RelatedGroup[] = [];
  for (const [sourceId, list] of groups) {
    list.sort((a, b) => {
      if (b.shareScore !== a.shareScore) return b.shareScore - a.shareScore;
      return a.sectionId.localeCompare(b.sectionId);
    });
    result.push({ sourceId, items: list.slice(0, maxPerGroup) });
  }

  result.sort((a, b) => {
    const oa = sourceOrder.get(a.sourceId) ?? Number.MAX_SAFE_INTEGER;
    const ob = sourceOrder.get(b.sourceId) ?? Number.MAX_SAFE_INTEGER;
    return oa - ob;
  });

  return result;
}
