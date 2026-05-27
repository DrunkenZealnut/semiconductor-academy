import Fuse from 'fuse.js';
import { chemicals } from './content';
import type { Chemical } from './types';

export const chemicalFuse = new Fuse(chemicals, {
  keys: [
    { name: 'nameKo', weight: 0.4 },
    { name: 'nameEn', weight: 0.3 },
    { name: 'formula', weight: 0.15 },
    { name: 'casNo', weight: 0.15 },
    { name: 'easyExplain', weight: 0.05 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: true,
});

export function searchChemicals(query: string): Chemical[] {
  if (!query.trim()) return chemicals;
  return chemicalFuse.search(query).map((r) => r.item);
}
