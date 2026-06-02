'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Chip } from '@/components/ui/Chip';
import { SOURCE_LANGUAGE_LABELS } from '@/lib/types';
import type { SourceLanguage } from '@/lib/types';

const STORAGE_KEY = 'osha-scs-lang';
const DEFAULT_LANG: SourceLanguage = 'ko';

interface LanguageToggleProps {
  /** 영문 본문 (항상 존재) */
  en: ReactNode;
  /** 한글 본문. null이면 토글 미노출 + 영문 단독 (FR-7) */
  ko: ReactNode | null;
  /** 영문 선택 시 출처 안내 */
  enNotice: ReactNode;
  /** 한글 선택 시 출처 안내 */
  koNotice: ReactNode;
}

/**
 * OSHA SCS 본문 언어(영/한) 인페이지 토글.
 *
 * - 서버가 두 언어 본문을 모두 렌더해 `ReactNode`로 전달하면, 비활성 본문은 `hidden`으로 숨긴다.
 *   정적 export 환경에서 네트워크 요청 없이 즉시 전환된다 (FR-4).
 * - 언어 선택은 `localStorage`에 저장하고 마운트 후 복원한다 (FR-6).
 * - Hydration 안전: 초기 렌더는 `ko ? DEFAULT_LANG : 'en'` 정적값 → SSR/CSR 일치.
 *   localStorage 복원은 `useEffect`(마운트 후)로만 수행한다.
 */
export function LanguageToggle({ en, ko, enNotice, koNotice }: LanguageToggleProps) {
  const [lang, setLang] = useState<SourceLanguage>(ko ? DEFAULT_LANG : 'en');

  useEffect(() => {
    if (!ko) return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ko') setLang(saved);
  }, [ko]);

  function choose(next: SourceLanguage) {
    setLang(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <>
      {ko ? (
        <div
          role="group"
          aria-label="본문 언어 선택"
          className="mb-6 flex items-center gap-2"
        >
          <Chip
            pressed={lang === 'ko'}
            onClick={() => choose('ko')}
            aria-label="한국어 번역 보기"
          >
            한국어
          </Chip>
          <Chip
            pressed={lang === 'en'}
            onClick={() => choose('en')}
            aria-label="View English original"
          >
            {SOURCE_LANGUAGE_LABELS.en}
          </Chip>
        </div>
      ) : null}

      <p className="mb-6 text-xs text-slate-500 dark:text-slate-500">
        {lang === 'ko' && ko ? koNotice : enNotice}
      </p>

      {/* 두 본문 모두 DOM에 존재, 비활성은 hidden 처리 (FR-4/FR-5) */}
      <div hidden={lang !== 'en'}>{en}</div>
      {ko ? <div hidden={lang !== 'ko'}>{ko}</div> : null}
    </>
  );
}
