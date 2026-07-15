import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getSourceSection } from '@/lib/sources';

interface Props {
  source: string;
  section: string;
  /** 칩에 표시할 짧은 라벨. 생략 시 섹션 제목 그대로. */
  label?: string;
}

/**
 * MDX 본문에서 다른 자료원 섹션(OSHA part, NCS 모듈 등)을 가리키는 인라인 칩 링크.
 * ChapterRef(책 챕터 전용)의 자료원 범용 버전 — basePath는 next/link가 처리한다.
 */
export function SourceRef({ source, section, label }: Props) {
  const found = getSourceSection(source, section);
  if (!found) return null;
  return (
    <Link
      href={found.section.href}
      className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-sm font-semibold text-brand-700 no-underline hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-300"
    >
      {label ?? found.section.title}
      <ChevronRight className="size-3" />
    </Link>
  );
}
