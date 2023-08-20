'use client';

import { Fragment } from 'react';
import { LanguageCard, SkeletonLanguageCard } from '@/components/language-card';
import { useLanguages } from '@/contexts/languages';
import { useTranslate } from '@/contexts/translate';
import type { Language } from '@/services/piston';

interface ContentProps {
  languages: Language[];
}
export default function Content(p: ContentProps) {
  const t = useTranslate();
  const languages = useLanguages(p.languages);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">{t.languages()}</h1>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {!languages.initial.length &&
          [...(new Array(70) as unknown[])].map((_, index) => (
            <SkeletonLanguageCard key={index} />
          ))}

        {languages.filtered.map((language) => (
          <Fragment key={language.id}>
            <LanguageCard {...language} key={language.key} />
          </Fragment>
        ))}
      </div>
    </>
  );
}
