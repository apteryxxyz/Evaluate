import { fetchLanguages, getLanguage } from '@evaluate/execute';
import { getTranslate } from '@evaluate/translate';
import { notFound } from 'next/navigation';
import type { PageProps } from '~/types';
import { generateBaseMetadata } from '../../metadata';
import Content from './content';

export async function generateStaticParams() {
  const languages = await fetchLanguages();
  return languages.map((l) => ({ language: l.id.split('/') }));
}

export async function generateMetadata(p: PageProps<['id[]']>) {
  const input = decodeURIComponent(p.params.id.join('/'));
  const language = await getLanguage(input).catch(() => undefined);
  if (!language) return notFound();

  const t = getTranslate(p.params.locale);
  return generateBaseMetadata([p.params.locale, `/${input}`], {
    title: t.evaluate.seo.title({ language_name: language.name }),
    description: t.evaluate.seo.description({ language_name: language.name }),
  });
}

export default async function Page(p: PageProps<['id[]']>) {
  const input = decodeURIComponent(p.params.id.join('/'));
  const language = await getLanguage(input).catch(() => undefined);
  if (!language) return notFound();

  return <Content language={language} />;
}
