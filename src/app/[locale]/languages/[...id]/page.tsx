import { executeServerAction } from 'next-sa/client';
import { notFound } from 'next/navigation';
import { getLanguage } from '@/app/actions';
// import { fetchLanguages } from '@/services/piston';
import { getTranslate } from '@/translations/determine-locale';
import type { PageProps } from '@/types';
import { generateBaseMetadata } from '../../metadata';
import Content from './content';

export async function generateMetadata(p: PageProps<['id[]']>) {
  const input = decodeURIComponent(p.params.id.join('/'));
  const language = await executeServerAction(getLanguage, input);
  if (!language) notFound();

  const t = getTranslate(p.params.locale);
  return generateBaseMetadata(t, `/${p.params.locale}/${input}`, {
    title: t.evaluate.seo.title({ language_name: language.name }),
    description: t.evaluate.seo.description({ language_name: language.name }),
  });
}

// TODO: Some client renderering warning or something, need to fix this
// export async function generateStaticParams() {
//   const languages = await fetchLanguages();
//   return languages.map((language) => ({ language: language.id.split('/') }));
// }

export default async function Page(p: PageProps<['id[]']>) {
  const input = decodeURIComponent(p.params.id.join('/'));
  const language = await executeServerAction(getLanguage, input);
  if (!language) notFound();

  return <Content language={language} />;
}
