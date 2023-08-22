import { executeServerAction } from 'next-sa/client';
import { notFound } from 'next/navigation';
import { getLanguage } from '@/app/actions';
// import { fetchLanguages } from '@/services/piston';
import { getTranslate } from '@/translations/determine-locale';
import type { PageProps } from '@/types';
import { generateBaseMetadata } from '../../metadata';
import Content from './content';

export async function generateMetadata(p: PageProps<['language[]']>) {
  const input = decodeURIComponent(p.params.language.join('/'));
  const language = await executeServerAction(getLanguage, input);
  if (!language) notFound();

  const t = getTranslate(p.params.locale);
  return generateBaseMetadata(t, `/${p.params.locale}/${input}`, {
    title: t.evaluate.seo.title({ language: language.name }),
    description: t.evaluate.seo.description({ language: language.name }),
  });
}

// TODO: Some client renderering warning or something, need to fix this
// export async function generateStaticParams() {
//   const languages = await fetchLanguages();
//   return languages.map((language) => ({ language: language.id.split('/') }));
// }

export default async function Page(p: PageProps<['language[]']>) {
  const input = decodeURIComponent(p.params.language.join('/'));
  const language = await executeServerAction(getLanguage, input);
  if (!language) notFound();

  return <Content language={language} />;
}
