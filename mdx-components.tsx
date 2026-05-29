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
    ...components,
  };
}
