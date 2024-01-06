import { fetchLanguages, getLanguage } from '@evaluate/languages';
import { getTranslate } from '@evaluate/translate';
import { notFound } from 'next/navigation';
import { generateBaseMetadata } from '~/app/metadata';
import { PageProps } from '~/types';
import LanguageContent from './content';

export async function generateStaticParams() {
  const languages = await fetchLanguages();
  return languages.map((l) => ({ language: l.id.split('/') }));
}

export async function generateMetadata(p: PageProps<['id[]']>) {
  const id = decodeURIComponent(p.params.id.join('/'));
  const language = await getLanguage(id).catch(() => void 0);
  if (!language) notFound();

  const t = getTranslate('en');
  return generateBaseMetadata(`/${p.params.id}`, {
    title: t.evaluate.seo.title({ language_name: language.name }),
    description: t.evaluate.seo.description({ language_name: language.name }),
  });
}

export default async function LanguagePage(p: PageProps<['id[]']>) {
  const id = decodeURIComponent(p.params.id.join('/'));
  const language = await getLanguage(id).catch(() => void 0);
  if (!language) notFound();

  return <LanguageContent language={language} />;
}
