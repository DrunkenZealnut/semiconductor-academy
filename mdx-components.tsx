import type { ComponentProps } from 'react';
import type { MDXComponents } from 'mdx/types';
import { LayeredExplain } from '@/components/content/LayeredExplain';
import { Term } from '@/components/content/Term';
import { Callout } from '@/components/content/Callout';
import { SafetyDisclaimer } from '@/components/content/SafetyDisclaimer';
import { SourceQuote } from '@/components/content/SourceQuote';
import { HazardBadge } from '@/components/content/HazardBadge';
import { ChapterNav } from '@/components/content/ChapterNav';
import { ImageFigure } from '@/components/content/ImageFigure';
import { ChapterRef } from '@/components/chapter/ChapterRef';
import { SourceRef } from '@/components/sources/SourceRef';
import { ChemicalCard } from '@/components/chemicals/ChemicalCard';
import { ProcessDiagram } from '@/components/process/ProcessDiagram';
import {
  LayerStack,
  CompareCards,
  FlowSteps,
  NodeGraph,
  TruthTable,
  ValueBars,
  TreeBranch,
  LatticeDiagram,
  CurvePlot,
  Timeline,
  ScaleRuler,
  LabeledFigure,
} from '@/components/diagram';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    LayeredExplain,
    Term,
    Callout,
    SafetyDisclaimer,
    SourceQuote,
    HazardBadge,
    ChapterNav,
    ChapterRef,
    SourceRef,
    ImageFigure,
    ChemicalCard,
    ProcessDiagram,
    // 자체 도해 세트 12종 — 등록 누락은 빌드가 아니라 런타임 공백으로 나타난다
    LayerStack,
    CompareCards,
    FlowSteps,
    NodeGraph,
    TruthTable,
    ValueBars,
    TreeBranch,
    LatticeDiagram,
    CurvePlot,
    Timeline,
    ScaleRuler,
    LabeledFigure,
    // 폭이 넓은 표는 페이지 대신 표 자체가 가로 스크롤되도록 감싼다 (모바일)
    table: (props: ComponentProps<'table'>) => (
      <div className="overflow-x-auto">
        <table {...props} />
      </div>
    ),
    ...components,
  };
}
