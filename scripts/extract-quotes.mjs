#!/usr/bin/env node
/**
 * Extract all SourceQuote + LayeredExplain.deep.quote from 17 chapter mdx files.
 * Output: src/data/quotes.json
 *
 * Strategy: line-based scanning for robustness over complex regex.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CHAPTERS_DIR = join(ROOT, 'src/content/chapters');
const CHAPTERS_META = JSON.parse(readFileSync(join(ROOT, 'src/data/chapters.json'), 'utf8'));
const OUTPUT = join(ROOT, 'src/data/quotes.json');

/** Map "01-risks-of-new-tech" -> chapter meta */
const chapterById = Object.fromEntries(
  CHAPTERS_META.map((c) => [c.id, c]),
);

/**
 * Strip JSX/HTML tags and decode common entities to plain text.
 * Keeps content of <strong>, <p>, etc.
 */
function toPlainText(jsx) {
  return jsx
    // remove className="..." attrs
    .replace(/\s+className=(?:"[^"]*"|\{[^}]*\})/g, '')
    // remove JSX fragment tags
    .replace(/<\/?>/g, '')
    // remove other JSX/HTML tags, keep inner text
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    // collapse whitespace
    .replace(/\s+/g, ' ')
    // common entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** Snippet for card preview (first ~120 chars) */
function makeSnippet(text, maxLen = 140) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Find a balanced block starting at `startIdx` where `src[startIdx]` is `open`,
 * returning the index of the matching `close`. Handles nested brackets.
 */
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

/**
 * Extract LayeredExplain blocks: <LayeredExplain ... /> (self-closing).
 * Captures deep.sourcePage, deep.sourceSection, deep.quote.
 */
function extractLayeredExplain(src, chapterId, chapterMeta) {
  const results = [];
  const openTag = '<LayeredExplain';
  let cursor = 0;
  let occurrence = 0;
  while (true) {
    const openIdx = src.indexOf(openTag, cursor);
    if (openIdx === -1) break;
    // find self-closing "/>" with balanced braces between
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

    // extract deep={{ ... }} from block
    const deepStart = block.indexOf('deep={{');
    if (deepStart === -1) continue;
    // find matching }} for deep — start at the first { after "deep="
    const firstBrace = block.indexOf('{', deepStart + 4); // after "deep"
    const innerBrace = block.indexOf('{', firstBrace + 1);
    if (innerBrace === -1) continue;
    const innerEnd = findBalanced(block, innerBrace, '{', '}');
    if (innerEnd === -1) continue;
    const deepBody = block.slice(innerBrace + 1, innerEnd);

    const pageMatch = deepBody.match(/sourcePage\s*:\s*(\d+)/);
    const sectionMatch = deepBody.match(/sourceSection\s*:\s*['"]([^'"]+)['"]/);
    const quoteIdx = deepBody.indexOf('quote:');
    let quoteText = '';
    if (quoteIdx !== -1) {
      // quote: (  <>...</>  ),
      const parenOpen = deepBody.indexOf('(', quoteIdx);
      if (parenOpen !== -1) {
        const parenClose = findBalanced(deepBody, parenOpen, '(', ')');
        if (parenClose !== -1) {
          const jsx = deepBody.slice(parenOpen + 1, parenClose);
          quoteText = toPlainText(jsx);
        }
      }
    }

    if (!quoteText) continue; // skip empty/placeholder ones

    occurrence++;
    results.push({
      id: `${chapterId}-le-${occurrence}`,
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

/**
 * Extract SourceQuote blocks: <SourceQuote page={N} section="..."> ... </SourceQuote>
 */
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

function main() {
  const files = readdirSync(CHAPTERS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .sort();

  const allQuotes = [];
  let leCount = 0;
  let sqCount = 0;

  for (const file of files) {
    const chapterId = file.replace(/\.mdx$/, '');
    const meta = chapterById[chapterId];
    if (!meta) {
      console.warn(`⚠️  No chapter meta for ${chapterId}, skipping`);
      continue;
    }
    const src = readFileSync(join(CHAPTERS_DIR, file), 'utf8');
    const layeredExplains = extractLayeredExplain(src, chapterId, meta);
    const sourceQuotes = extractSourceQuotes(src, chapterId, meta);
    leCount += layeredExplains.length;
    sqCount += sourceQuotes.length;
    allQuotes.push(...layeredExplains, ...sourceQuotes);
    console.log(
      `  ${chapterId}: LE=${layeredExplains.length}, SQ=${sourceQuotes.length}`,
    );
  }

  // Sort: by chapter then by type (layered-explain first, then source-quote in document order)
  allQuotes.sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    if (a.type !== b.type) return a.type === 'layered-explain' ? -1 : 1;
    return 0; // preserve insertion order within same group
  });

  writeFileSync(OUTPUT, JSON.stringify(allQuotes, null, 2), 'utf8');
  console.log('');
  console.log(`✅ Extracted ${allQuotes.length} quotes`);
  console.log(`   LayeredExplain: ${leCount}, SourceQuote: ${sqCount}`);
  console.log(`   Output: ${OUTPUT}`);
}

main();
