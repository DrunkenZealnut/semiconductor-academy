#!/usr/bin/env node
/**
 * Extract quotes from two sources:
 *   1) 책 「반도체 산업의 유해인자」 17 chapter mdx — LayeredExplain + SourceQuote
 *   2) OSHA Semiconductor Chemical Safety 5 Part mdx — Overview / LearningObjectives / Summary / Definitions
 *
 * Output: src/data/quotes.json
 *
 * Strategy: line-based scanning for robustness over complex regex.
 *
 * ⚠️ OSHA_PART_META must stay in sync with src/lib/sources.ts OSHA_SCS.sections.
 *    Single source of truth: src/lib/sources.ts — partTitle은 sources.ts의 section.title과
 *    글자 단위로 동일해야 한다 (UI carousel·OSHA 카드·sources 페이지 헤더 일관성).
 *    partHref도 sources.ts의 section.href와 동일 패턴 `/sources/osha-scs/{partId}/`.
 *    Same manual-mirror pattern as cross-link-system (5 entries — scripts→TS import 경계
 *    회피, 자동 동기화 비용 > 이득. 변경 시 양쪽 동시 수정 + npm run extract:quotes 검증).
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CHAPTERS_DIR = join(ROOT, 'src/content/chapters');
const OSHA_DIR = join(ROOT, 'src/content/sources/osha-scs');
const CHAPTERS_META = JSON.parse(readFileSync(join(ROOT, 'src/data/chapters.json'), 'utf8'));
const OUTPUT = join(ROOT, 'src/data/quotes.json');

const chapterById = Object.fromEntries(
  CHAPTERS_META.map((c) => [c.id, c]),
);

// =========================
// OSHA meta + selectors
// =========================

const OSHA_PART_META = [
  { partId: 'part-1a', partTitle: 'Part 1A · Introduction to GHS',                                          partHref: '/sources/osha-scs/part-1a/' },
  { partId: 'part-1b', partTitle: 'Part 1B · Communication, Controls, and Emergency Procedures',            partHref: '/sources/osha-scs/part-1b/' },
  { partId: 'part-2',  partTitle: 'Part 2 · Chemical Hazards, Controls, and Emergency Actions',             partHref: '/sources/osha-scs/part-2/' },
  { partId: 'part-3',  partTitle: 'Part 3 · Extremely Hazardous Chemicals',                                 partHref: '/sources/osha-scs/part-3/' },
  { partId: 'part-4',  partTitle: 'Part 4 · Hazardous Gas Systems and Controls',                            partHref: '/sources/osha-scs/part-4/' },
];

/**
 * Definition extraction selectors — exact heading match (no regex, no partial).
 * Adjusted for actual MDX heading text (Design §3.2의 일부 selector를 실제 헤딩에 맞춤).
 */
const OSHA_DEFINITION_SELECTORS = [
  // Part 1A
  { partId: 'part-1a', heading: '## 4. Three Types of Hazards',                     sectionRef: '§4 Three Types of Hazards' },
  { partId: 'part-1a', heading: '### 5.4 Pyrophoric Substances',                    sectionRef: '§5.4 Pyrophoric Substances' },
  { partId: 'part-1a', heading: '### 6.3 Hydrofluoric Acid (HF) — Special Hazard', sectionRef: '§6.3 HF Special Hazard' },
  // Part 1B
  { partId: 'part-1b', heading: '### 2.1 SDS Structure',                            sectionRef: '§2.1 SDS Structure' },
  // Part 2
  { partId: 'part-2',  heading: '### Flash Point',                                  sectionRef: 'Flash Point' },
  { partId: 'part-2',  heading: '## 6. Pyrophoric Chemicals',                       sectionRef: '§6 Pyrophoric Chemicals' },
  { partId: 'part-2',  heading: '### HF Exposure First Aid (Special Steps)',       sectionRef: 'HF Exposure First Aid' },
  // Part 3
  { partId: 'part-3',  heading: '## 5. Silane — Special Focus',                    sectionRef: '§5 Silane — Special Focus' },
  { partId: 'part-3',  heading: '## 1. Toxic Hydride Gases',                       sectionRef: '§1 Toxic Hydride Gases' },
  // Part 4
  { partId: 'part-4',  heading: '## 2. Cryogenic Cylinders (Dewars)',              sectionRef: '§2 Cryogenic Cylinders' },
  { partId: 'part-4',  heading: '## 5. Common Gas Controls',                       sectionRef: '§5 Common Gas Controls' },
];

// =========================
// Shared helpers
// =========================

function toPlainText(jsx) {
  return jsx
    .replace(/\s+className=(?:"[^"]*"|\{[^}]*\})/g, '')
    .replace(/<\/?>/g, '')
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** Strip markdown emphasis/links/code from a plain text fragment. */
function stripMarkdown(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeSnippet(text, maxLen = 140) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

/** Word-boundary truncate to maxLen with `…` suffix. */
function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLen * 0.7 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[§\.\(\)·—–\-]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function findBalanced(src, startIdx, open, close) {
  let depth = 0;
  for (let i = startIdx; i < src.length; i++) {
    if (src[i] === open) depth++;
    else if (src[i] === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Stop when blank line follows content, or next heading / horizontal rule. */
function isStopLine(line, bufLen) {
  if (line === '') return bufLen > 0;
  if (line === '---') return true;
  if (line.startsWith('## ') || line.startsWith('### ') || line.startsWith('#### ')) return true;
  return false;
}

// =========================
// 책 추출 (기존 동작 유지 + sourceId/language 부여)
// =========================

function extractLayeredExplain(src, chapterId, chapterMeta) {
  const results = [];
  const openTag = '<LayeredExplain';
  let cursor = 0;
  let occurrence = 0;
  while (true) {
    const openIdx = src.indexOf(openTag, cursor);
    if (openIdx === -1) break;
    let endIdx = openIdx + openTag.length;
    let braceDepth = 0;
    let curlyDepth = 0;
    let parenDepth = 0;
    let found = -1;
    while (endIdx < src.length) {
      const ch = src[endIdx];
      if (ch === '{') curlyDepth++;
      else if (ch === '}') curlyDepth--;
      else if (ch === '(') parenDepth++;
      else if (ch === ')') parenDepth--;
      else if (
        ch === '/' && src[endIdx + 1] === '>' &&
        curlyDepth === 0 && parenDepth === 0 && braceDepth === 0
      ) {
        found = endIdx + 2;
        break;
      }
      endIdx++;
    }
    if (found === -1) break;
    const block = src.slice(openIdx, found);
    cursor = found;

    const deepStart = block.indexOf('deep={{');
    if (deepStart === -1) continue;
    const firstBrace = block.indexOf('{', deepStart + 4);
    const innerBrace = block.indexOf('{', firstBrace + 1);
    if (innerBrace === -1) continue;
    const innerEnd = findBalanced(block, innerBrace, '{', '}');
    if (innerEnd === -1) continue;
    const deepBody = block.slice(innerBrace + 1, innerEnd);

    // summary(요약) 전용 블록은 원문 인용이 아니므로 추출 대상 제외.
    // deep.quote만 quotes.json으로 추출한다 (요약 구조적 배제).
    if (deepBody.indexOf('quote:') === -1) continue;
    const pageMatch = deepBody.match(/sourcePage\s*:\s*(\d+)/);
    const sectionMatch = deepBody.match(/sourceSection\s*:\s*['"]([^'"]+)['"]/);
    const quoteIdx = deepBody.indexOf('quote:');
    let quoteText = '';
    if (quoteIdx !== -1) {
      const parenOpen = deepBody.indexOf('(', quoteIdx);
      if (parenOpen !== -1) {
        const parenClose = findBalanced(deepBody, parenOpen, '(', ')');
        if (parenClose !== -1) {
          const jsx = deepBody.slice(parenOpen + 1, parenClose);
          quoteText = toPlainText(jsx);
        }
      }
    }

    if (!quoteText) continue;

    occurrence++;
    results.push({
      id: `${chapterId}-le-${occurrence}`,
      sourceId: 'epi-semi-hazards',
      language: 'ko',
      chapter: chapterMeta.order,
      chapterTitle: chapterMeta.title,
      chapterShortTitle: chapterMeta.shortTitle,
      chapterSlug: chapterMeta.slug,
      type: 'layered-explain',
      page: pageMatch ? Number(pageMatch[1]) : null,
      section: sectionMatch ? sectionMatch[1] : null,
      text: quoteText,
      snippet: makeSnippet(quoteText),
    });
  }
  return results;
}

function extractSourceQuotes(src, chapterId, chapterMeta) {
  const results = [];
  const openTag = '<SourceQuote';
  const closeTag = '</SourceQuote>';
  let cursor = 0;
  let occurrence = 0;
  while (true) {
    const openIdx = src.indexOf(openTag, cursor);
    if (openIdx === -1) break;
    const tagEndIdx = src.indexOf('>', openIdx);
    if (tagEndIdx === -1) break;
    const closeIdx = src.indexOf(closeTag, tagEndIdx);
    if (closeIdx === -1) break;

    const tagHead = src.slice(openIdx, tagEndIdx + 1);
    const inner = src.slice(tagEndIdx + 1, closeIdx);

    const pageMatch = tagHead.match(/page=\{?(\d+)\}?/);
    const sectionMatch = tagHead.match(/section=['"]([^'"]+)['"]/);

    const text = toPlainText(inner);
    if (text) {
      occurrence++;
      results.push({
        id: `${chapterId}-sq-${occurrence}`,
        sourceId: 'epi-semi-hazards',
        language: 'ko',
        chapter: chapterMeta.order,
        chapterTitle: chapterMeta.title,
        chapterShortTitle: chapterMeta.shortTitle,
        chapterSlug: chapterMeta.slug,
        type: 'source-quote',
        page: pageMatch ? Number(pageMatch[1]) : null,
        section: sectionMatch ? sectionMatch[1] : null,
        text,
        snippet: makeSnippet(text),
      });
    }
    cursor = closeIdx + closeTag.length;
  }
  return results;
}

// =========================
// OSHA 추출
// =========================

/**
 * Default sectionRef per kind — for Overview/LO/Summary entries that don't have a
 * heading-derived sectionRef. Ensures every OSHA quote has searchable metadata
 * (Fuse keys: sectionRef weight 0.15) and a readable label in the card header.
 * Definition entries already carry their selector's sectionRef.
 */
const OSHA_KIND_DEFAULT_REF = {
  overview: 'Course Overview',
  'learning-objectives': 'Learning Objectives',
  summary: 'Course Summary',
};

function makeOshaQuote(partMeta, kind, rawText, sectionRef) {
  const cleaned = stripMarkdown(rawText);
  const text = truncate(cleaned, 200);
  const finalRef = sectionRef ?? OSHA_KIND_DEFAULT_REF[kind];
  const slug = finalRef ? slugify(finalRef) : kind;
  return {
    id: `osha-scs::${partMeta.partId}::${kind}::${slug}`,
    sourceId: 'osha-scs',
    language: 'en',
    type: 'osha-section',
    kind,
    partId: partMeta.partId,
    partTitle: partMeta.partTitle,
    partHref: partMeta.partHref,
    ...(finalRef ? { sectionRef: finalRef } : {}),
    text,
    snippet: makeSnippet(text),
  };
}

/** Collect lines after `headingIdx` until a stop condition (blank-after-content / next heading / hr). */
function collectParagraph(lines, headingIdx) {
  const buf = [];
  for (let i = headingIdx + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (isStopLine(l, buf.length)) break;
    if (l === '') continue;
    buf.push(l);
  }
  return buf.join(' ').trim();
}

/**
 * Collect a paragraph block that may contain a leading sentence and a list.
 * Joins bullets/numbered items with '; ' for compact prose.
 */
function collectListBlock(lines, headingIdx) {
  const pre = [];
  const items = [];
  let seenItem = false;
  for (let i = headingIdx + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l === '---') break;
    if (l.startsWith('## ') || l.startsWith('### ') || l.startsWith('#### ')) break;
    if (l === '') {
      if (seenItem) break;
      continue;
    }
    const numMatch = l.match(/^\d+\.\s+(.*)$/);
    const bulletMatch = l.match(/^[-*]\s+(.*)$/);
    if (numMatch || bulletMatch) {
      items.push((numMatch ?? bulletMatch)[1]);
      seenItem = true;
    } else if (!seenItem) {
      pre.push(l);
    } else {
      // continuation line of a list item — append to last
      items[items.length - 1] = `${items[items.length - 1]} ${l}`;
    }
  }
  const preText = pre.join(' ').trim();
  const itemsText = items.join('; ').trim();
  if (itemsText) {
    return preText ? `${preText} ${itemsText}` : itemsText;
  }
  return preText;
}

function findHeadingIdx(lines, exact) {
  return lines.findIndex((l) => l.trim() === exact);
}

function extractOshaCourseOverview(src, partMeta) {
  const lines = src.split('\n');
  const idx = findHeadingIdx(lines, '## Course Overview');
  if (idx === -1) return null;
  const raw = collectParagraph(lines, idx);
  if (!raw) return null;
  return makeOshaQuote(partMeta, 'overview', raw, null);
}

function extractOshaLearningObjectives(src, partMeta) {
  const lines = src.split('\n');
  const idx = findHeadingIdx(lines, '### Learning Objectives');
  if (idx === -1) return null;
  const raw = collectListBlock(lines, idx);
  if (!raw) return null;
  return makeOshaQuote(partMeta, 'learning-objectives', raw, null);
}

function extractOshaCourseSummary(src, partMeta) {
  const lines = src.split('\n');
  const idx = findHeadingIdx(lines, '## Course Summary');
  if (idx === -1) return null;
  // Summary는 보통 numbered list가 본문 — collectListBlock 사용
  const raw = collectListBlock(lines, idx);
  if (!raw) return null;
  return makeOshaQuote(partMeta, 'summary', raw, null);
}

function extractOshaDefinitions(src, partMeta, selectors) {
  const results = [];
  const lines = src.split('\n');
  for (const sel of selectors) {
    if (sel.partId !== partMeta.partId) continue;
    const idx = findHeadingIdx(lines, sel.heading);
    if (idx === -1) {
      console.warn(`  ⚠️  OSHA selector miss: ${sel.partId} / ${sel.heading}`);
      continue;
    }
    const raw = collectParagraph(lines, idx);
    if (!raw) {
      console.warn(`  ⚠️  OSHA definition empty after heading: ${sel.partId} / ${sel.heading}`);
      continue;
    }
    results.push(makeOshaQuote(partMeta, 'definition', raw, sel.sectionRef));
  }
  return results;
}

function extractOshaPart(partMeta) {
  const file = join(OSHA_DIR, `${partMeta.partId}.mdx`);
  if (!existsSync(file)) {
    console.warn(`  ⚠️  OSHA MDX missing: ${file}`);
    return [];
  }
  const src = readFileSync(file, 'utf8');
  const quotes = [];
  const overview = extractOshaCourseOverview(src, partMeta);
  if (overview) quotes.push(overview);
  const lo = extractOshaLearningObjectives(src, partMeta);
  if (lo) quotes.push(lo);
  const summary = extractOshaCourseSummary(src, partMeta);
  if (summary) quotes.push(summary);
  quotes.push(...extractOshaDefinitions(src, partMeta, OSHA_DEFINITION_SELECTORS));
  return quotes;
}

// =========================
// Main
// =========================

function main() {
  const allQuotes = [];
  let leCount = 0;
  let sqCount = 0;
  let oshaCount = 0;

  // 책 추출
  console.log('📖 「반도체 산업의 유해인자」 추출');
  const files = readdirSync(CHAPTERS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .sort();
  for (const file of files) {
    const chapterId = file.replace(/\.mdx$/, '');
    const meta = chapterById[chapterId];
    if (!meta) {
      console.warn(`  ⚠️  No chapter meta for ${chapterId}, skipping`);
      continue;
    }
    const src = readFileSync(join(CHAPTERS_DIR, file), 'utf8');
    const layered = extractLayeredExplain(src, chapterId, meta);
    const sq = extractSourceQuotes(src, chapterId, meta);
    leCount += layered.length;
    sqCount += sq.length;
    allQuotes.push(...layered, ...sq);
    console.log(`  ${chapterId}: LE=${layered.length}, SQ=${sq.length}`);
  }

  // OSHA 추출
  console.log('');
  console.log('🏛 OSHA Semiconductor Chemical Safety 추출');
  for (const partMeta of OSHA_PART_META) {
    const quotes = extractOshaPart(partMeta);
    oshaCount += quotes.length;
    allQuotes.push(...quotes);
    const breakdown = quotes.reduce((acc, q) => {
      acc[q.kind] = (acc[q.kind] ?? 0) + 1;
      return acc;
    }, {});
    const summary = ['overview', 'learning-objectives', 'summary', 'definition']
      .map((k) => `${k[0].toUpperCase()}${breakdown[k] ?? 0}`)
      .join(' ');
    console.log(`  ${partMeta.partId}: total=${quotes.length} (${summary})`);
  }

  // Sort: 책 quotes (chapter, type) → OSHA quotes (partId, kind order)
  const OSHA_KIND_ORDER = ['overview', 'learning-objectives', 'definition', 'summary'];
  allQuotes.sort((a, b) => {
    const aOsha = a.sourceId === 'osha-scs';
    const bOsha = b.sourceId === 'osha-scs';
    if (aOsha !== bOsha) return aOsha ? 1 : -1;
    if (!aOsha) {
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      if (a.type !== b.type) return a.type === 'layered-explain' ? -1 : 1;
      return 0;
    }
    if (a.partId !== b.partId) return a.partId < b.partId ? -1 : 1;
    const ai = OSHA_KIND_ORDER.indexOf(a.kind);
    const bi = OSHA_KIND_ORDER.indexOf(b.kind);
    return ai - bi;
  });

  writeFileSync(OUTPUT, JSON.stringify(allQuotes, null, 2), 'utf8');
  console.log('');
  console.log(`✅ Extracted ${allQuotes.length} quotes`);
  console.log(`   책: LE=${leCount} + SQ=${sqCount} = ${leCount + sqCount}`);
  console.log(`   OSHA: ${oshaCount}`);
  console.log(`   Output: ${OUTPUT}`);
}

main();
