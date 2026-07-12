import type { ComponentProps } from 'react';
import type { MDXComponents } from 'mdx/types';
import { LayeredExplain } from '@/components/content/LayeredExplain';
import { Term } from '@/components/content/Term';
import { Callout } from '@/components/content/Callout';
import { SourceQuote } from '@/components/content/SourceQuote';
import { HazardBadge } from '@/components/content/HazardBadge';
import { ChapterNav } from '@/components/content/ChapterNav';
import { ImageFigure } from '@/components/content/ImageFigure';
import { ChapterRef } from '@/components/chapter/ChapterRef';
import { ChemicalCard } from '@/components/chemicals/ChemicalCard';
import { ProcessDiagram } from '@/components/process/ProcessDiagram';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    LayeredExplain,
    Term,
    Callout,
    SourceQuote,
    HazardBadge,
    ChapterNav,
    ChapterRef,
    ImageFigure,
    ChemicalCard,
    ProcessDiagram,
    // 폭이 넓은 표는 페이지 대신 표 자체가 가로 스크롤되도록 감싼다 (모바일)
    table: (props: ComponentProps<'table'>) => (
      <div className="overflow-x-auto">
        <table {...props} />
      </div>
    ),
    ...components,
  };
}
