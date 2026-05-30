#!/usr/bin/env node
/**
 * Build the cross-link index for the semiconductor-academy site.
 *
 * Inputs (manifest-driven discovery):
 *   - src/data/schema-enum.json      (Topic/Hazard controlled vocabulary)
 *   - src/data/chemicals.json        (known chemical IDs)
 *   - src/data/_book-links.json      (book source tags, special-cased)
 *   - src/content/sources/{id}/_links.json  (other sources, glob-discovered)
 *
 * Output:
 *   - src/data/cross-link.json
 *
 * Failure modes:
 *   exit 1  — unknown topic/hazard, JSON parse error
 *   exit 0  — success (warnings for unknown chemicals are non-fatal)
 *
 * Design: docs/02-design/features/cross-link-system.design.md §4.1
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SCHEMA_ENUM_PATH = join(ROOT, 'src/data/schema-enum.json');
const CHEMICALS_PATH = join(ROOT, 'src/data/chemicals.json');
const BOOK_LINKS_PATH = join(ROOT, 'src/data/_book-links.json');
const OTHER_SOURCES_DIR = join(ROOT, 'src/content/sources');
const OUTPUT_PATH = join(ROOT, 'src/data/cross-link.json');

const BOOK_SOURCE_ID = 'epi-semi-hazards';
const SCHEMA_VERSION = 1;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function loadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    console.error(`[build-cross-link] ERROR: failed to read ${path}`);
    console.error(`  ${err.message}`);
    process.exit(1);
  }
}

function stripCommentKeys(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    out[k] = v;
  }
  return out;
}

function dirExists(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function fileExists(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/** Suggest closest enum value (Levenshtein distance). */
function suggest(value, options) {
  const d = (a, b) => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[m][n];
  };
  return options
    .map((o) => ({ o, d: d(value, o) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map(({ o }) => o);
}

// ─────────────────────────────────────────────────────────────
// Load vocabularies
// ─────────────────────────────────────────────────────────────

const schemaEnum = loadJson(SCHEMA_ENUM_PATH);
const TOPICS = new Set(schemaEnum.topics);
const HAZARDS = new Set(schemaEnum.hazards);

if (schemaEnum.version !== SCHEMA_VERSION) {
  console.error(
    `[build-cross-link] ERROR: schema-enum.json version (${schemaEnum.version}) ≠ build script version (${SCHEMA_VERSION})`,
  );
  process.exit(1);
}

const chemicalsList = loadJson(CHEMICALS_PATH);
const KNOWN_CHEMICALS = new Set(chemicalsList.map((c) => c.id));

// ─────────────────────────────────────────────────────────────
// Discover sources (manifest-driven via filesystem)
// ─────────────────────────────────────────────────────────────

/** @type {Array<{ sourceId: string, links: Record<string, any>, path: string }>} */
const sourceLinks = [];

// 1. Book source (special-cased — _book-links.json is in src/data/)
if (fileExists(BOOK_LINKS_PATH)) {
  sourceLinks.push({
    sourceId: BOOK_SOURCE_ID,
    links: stripCommentKeys(loadJson(BOOK_LINKS_PATH)),
    path: BOOK_LINKS_PATH,
  });
}

// 2. Other sources — glob src/content/sources/{id}/_links.json
if (dirExists(OTHER_SOURCES_DIR)) {
  for (const entry of readdirSync(OTHER_SOURCES_DIR)) {
    const sourceDir = join(OTHER_SOURCES_DIR, entry);
    if (!dirExists(sourceDir)) continue;
    const linksPath = join(sourceDir, '_links.json');
    if (!fileExists(linksPath)) continue;
    sourceLinks.push({
      sourceId: entry,
      links: stripCommentKeys(loadJson(linksPath)),
      path: linksPath,
    });
  }
}

if (sourceLinks.length === 0) {
  console.warn('[build-cross-link] WARNING: no sources discovered. Output will be empty.');
}

// ─────────────────────────────────────────────────────────────
// Validate + accumulate
// ─────────────────────────────────────────────────────────────

const bySection = {};
const byTopic = {};
const byHazard = {};
const byChemical = {};
const unknownChemicals = new Set();
const errors = [];

let topicTagCount = 0;
let hazardTagCount = 0;
let chemicalTagCount = 0;

for (const { sourceId, links, path } of sourceLinks) {
  for (const [sectionId, raw] of Object.entries(links)) {
    if (typeof raw !== 'object' || raw === null) continue;
    const section = stripCommentKeys(raw);

    const validTopics = [];
    const validHazards = [];
    const validChemicals = [];

    // Topics
    if (Array.isArray(section.topics)) {
      for (const t of section.topics) {
        if (!TOPICS.has(t)) {
          errors.push(
            `unknown topic "${t}" in ${sourceId}/${sectionId} (${path})\n` +
              `    Did you mean: ${suggest(t, [...TOPICS]).join(', ')}?`,
          );
          continue;
        }
        validTopics.push(t);
        topicTagCount++;
      }
    }

    // Hazards
    if (Array.isArray(section.hazards)) {
      for (const h of section.hazards) {
        if (!HAZARDS.has(h)) {
          errors.push(
            `unknown hazard "${h}" in ${sourceId}/${sectionId} (${path})\n` +
              `    Did you mean: ${suggest(h, [...HAZARDS]).join(', ')}?`,
          );
          continue;
        }
        validHazards.push(h);
        hazardTagCount++;
      }
    }

    // Chemicals (graceful: warn, keep)
    if (Array.isArray(section.chemicals)) {
      for (const c of section.chemicals) {
        if (!KNOWN_CHEMICALS.has(c)) {
          unknownChemicals.add(c);
        }
        validChemicals.push(c);
        chemicalTagCount++;
      }
    }

    const sectionKey = `${sourceId}::${sectionId}`;
    bySection[sectionKey] = {
      topics: validTopics,
      hazards: validHazards,
      chemicals: validChemicals,
    };

    const ref = { sourceId, sectionId };
    for (const t of validTopics) {
      (byTopic[t] ||= []).push(ref);
    }
    for (const h of validHazards) {
      (byHazard[h] ||= []).push(ref);
    }
    for (const c of validChemicals) {
      (byChemical[c] ||= []).push(ref);
    }
  }
}

if (errors.length > 0) {
  console.error('[build-cross-link] ERROR: vocabulary violations:');
  for (const e of errors) console.error(`  - ${e}`);
  console.error(`\n  Available topics (${TOPICS.size}):`);
  console.error(`    ${[...TOPICS].join(', ')}`);
  console.error(`\n  Available hazards (${HAZARDS.size}):`);
  console.error(`    ${[...HAZARDS].join(', ')}`);
  console.error(
    `\n  Fix vocabulary in _links.json files OR extend src/lib/cross-link/schema.ts + src/data/schema-enum.json.`,
  );
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// Compute bidirectional book ↔ OSHA links (for stats)
// ─────────────────────────────────────────────────────────────

function countBidirectional() {
  const bookSections = new Set(
    Object.entries(bySection)
      .filter(([k]) => k.startsWith(`${BOOK_SOURCE_ID}::`))
      .map(([k]) => k),
  );
  let count = 0;
  for (const tagMap of [byTopic, byHazard, byChemical]) {
    for (const refs of Object.values(tagMap)) {
      const inBook = refs.filter((r) => r.sourceId === BOOK_SOURCE_ID);
      const others = refs.filter((r) => r.sourceId !== BOOK_SOURCE_ID);
      count += inBook.length * others.length;
    }
  }
  // Each pair counted once per shared tag — return raw "tag-edge" count.
  // For unique bidirectional pairs we'd dedupe, but for monitoring the raw is fine.
  return count;
}

// ─────────────────────────────────────────────────────────────
// Emit
// ─────────────────────────────────────────────────────────────

/** @type {import('../src/lib/cross-link/schema').CrossLinkIndex} */
const index = {
  version: SCHEMA_VERSION,
  generatedAt: new Date().toISOString(),
  sources: sourceLinks.map((s) => s.sourceId).sort(),
  bySection,
  byTopic,
  byHazard,
  byChemical,
  unknownChemicals: [...unknownChemicals].sort(),
};

writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2) + '\n', 'utf8');

// ─────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────

const sectionCount = Object.keys(bySection).length;
const bidirectional = countBidirectional();

console.log(`[build-cross-link] discovered ${sourceLinks.length} source(s): ${index.sources.join(', ')}`);
console.log(`[build-cross-link] scanned ${sectionCount} section(s)`);
console.log(`[build-cross-link] tagged: topics ${topicTagCount}, hazards ${hazardTagCount}, chemicals ${chemicalTagCount}`);
console.log(`[build-cross-link] bidirectional tag-edges (book ↔ other): ${bidirectional}`);
if (unknownChemicals.size > 0) {
  console.warn(
    `[build-cross-link] WARNING: ${unknownChemicals.size} unknown chemical id(s) (kept as stub):`,
  );
  for (const c of unknownChemicals) console.warn(`    - ${c}`);
}
console.log(`[build-cross-link] wrote ${OUTPUT_PATH}`);
