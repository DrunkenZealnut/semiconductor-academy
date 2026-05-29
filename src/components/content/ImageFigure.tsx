'use client';

import { useState } from 'react';
import { Lightbox } from './Lightbox';

interface Props {
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  attribution?: string;
  maxWidth?: number;
}

export function ImageFigure({
  src,
  alt,
  caption,
  source,
  attribution,
  maxWidth = 600,
}: Props) {
  const [open, setOpen] = useState(false);
  // basePath 적용을 위해 환경변수 사용
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const fullSrc = src.startsWith('/') ? `${basePath}${src}` : src;

  return (
    <figure className="not-prose my-6 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`이미지 확대: ${alt}`}
        className="block overflow-hidden rounded-lg ring-1 ring-slate-200 transition hover:ring-2 hover:ring-brand-500 dark:ring-slate-700"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fullSrc}
          alt={alt}
          loading="lazy"
          style={{ maxWidth, width: '100%', display: 'block' }}
        />
      </button>
      {caption && (
        <figcaption className="mt-2 max-w-[600px] text-center text-sm text-slate-600 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
      {(source || attribution) && (
        <p className="mt-1 max-w-[600px] text-center text-xs italic text-slate-500 dark:text-slate-500">
          {source && <>출처: {source}</>}
          {source && attribution && ' · '}
          {attribution}
        </p>
      )}
      {open && <Lightbox src={fullSrc} alt={alt} onClose={() => setOpen(false)} />}
    </figure>
  );
}
