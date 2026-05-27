import chaptersJson from '@/data/chapters.json';
import type { Chapter, ChapterCategory } from './types';

export const chapters = chaptersJson as Chapter[];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getChapterByOrder(order: number): Chapter | undefined {
  return chapters.find((c) => c.order === order);
}

export function getOrderedChapters(): Chapter[] {
  return [...chapters].sort((a, b) => a.order - b.order);
}

export function getChaptersByCategory(category: ChapterCategory): Chapter[] {
  return getOrderedChapters().filter((c) => c.category === category);
}

export function getAdjacentChapters(order: number): { prev?: Chapter; next?: Chapter } {
  return {
    prev: order > 1 ? getChapterByOrder(order - 1) : undefined,
    next: order < chapters.length ? getChapterByOrder(order + 1) : undefined,
  };
}
