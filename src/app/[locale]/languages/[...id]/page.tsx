import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { GET as queryLanguages } from '@/api/languages/route';
import { fetchLanguages } from '@/services/piston';
import type { Language } from '@/services/piston';
import { getTranslate } from '@/translations/determine-locale';
import type { PageProps } from '@/types';
import { generateBaseMetadata } from '../../metadata';
import Content from './content';
import Loading from './loading';

export async function generateMetadata(p: PageProps<['id[]']>) {
  const input = decodeURIComponent(p.params.id.join('/'));
  const language = await queryLanguages({
    search: { id: input },
    body: undefined,
  })
    .then((l) => (l as unknown as Language[])[0])
    .catch(() => notFound());

  const t = getTranslate(p.params.locale);
  return generateBaseMetadata(t, `/${p.params.locale}/${input}`, {
    title: t.evaluate.seo.title({ language_name: language.name }),
    description: t.evaluate.seo.description({ language_name: language.name }),
  });
}

export async function generateStaticParams() {
  const languages = await fetchLanguages();
  return languages.map((language) => ({ language: language.id.split('/') }));
}

export default async function Page(p: PageProps<['id[]']>) {
  const input = decodeURIComponent(p.params.id.join('/'));
  const language = await queryLanguages({
    search: { id: input },
    body: undefined,
  })
    .then((l) => (l as unknown as Language[])[0])
    .catch(() => notFound());

  return (
    <Suspense fallback={<Loading />}>
      <Content language={language} />
    </Suspense>
  );
}
