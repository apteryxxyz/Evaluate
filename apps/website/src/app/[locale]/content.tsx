'use client';

import type { Language } from '@evaluate/execute';
import { Fragment } from 'react';
import { useLanguages } from '~/contexts/languages';
import { useTranslate } from '~/contexts/translate';
import {
  LanguageCard,
  SkeletonLanguageCard,
} from './_components/language-card';
import { SearchInput } from './_components/search-input';

export default function LanguagesContent(p: { languages: Language[] }) {
  const t = useTranslate();
  const { languages, filteredLanguages } = useLanguages(p.languages);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">{t.languages()}</h1>
      </div>

      <SearchInput />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {!languages.length &&
          [...(new Array(70) as unknown[])].map((_, index) => (
            <SkeletonLanguageCard key={String(index)} />
          ))}

        {filteredLanguages.map((l) => (
          <Fragment key={l.id}>
            <LanguageCard {...l} key={l.key} />
          </Fragment>
        ))}
      </div>
    </>
  );
}
