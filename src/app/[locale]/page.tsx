'use server';

import { queryLanguages } from '@/api/languages/route';
import type { PageProps } from '@/types';
import Content from './content';

export default async function Page(_p: PageProps<['locale']>) {
  const languages = await queryLanguages({ search: {}, body: undefined });
  return <Content languages={languages} />;
}
