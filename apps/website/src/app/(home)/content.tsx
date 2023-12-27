'use client';

import { Language } from '@evaluate/execute';
import { Fragment } from 'react';
import { useLanguages } from '~/contexts/languages';
import { useTranslate } from '~/contexts/translate';
import {
  LanguageCard,
  SkeletonLanguageCard,
} from './_components/language-card';
import { SearchInput } from './_components/search-input';
import LoadingPage from './loading';

export default function LanguagesContent(p: { languages: Language[] }) {
  const t = useTranslate();
  const { languages, filteredLanguages } = useLanguages(p.languages);

  if (!t) return <LoadingPage />;
  return (
    <>
      <section className="py-24 md:py-36">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold"
          style={{ maxWidth: '1000px' }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed to use `.replace` on the translation
          dangerouslySetInnerHTML={{
            __html: t.seo
              .headline()
              .replace(
                /Evaluate(\.)?/,
                (_, p1 = '') =>
                  `<span class="text-primary-gradient">Evaluate${p1}</span>`,
              ),
          }}
        />

        <p className="pt-2" style={{ maxWidth: '700px' }}>
          {t.seo.sub_headline()}
        </p>
      </section>

      <div>
        <h1 className="text-2xl font-bold">{t.languages()}</h1>
      </div>

      <SearchInput />

      <div className="language-cards-container grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
