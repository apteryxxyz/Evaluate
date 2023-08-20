'use server';

import { executeServerAction } from 'next-sa/client';
import type { PageProps } from '@/types';
import { fetchLanguages } from './actions';
import Content from './content';

export default async function Page(_p: PageProps<['locale']>) {
  const languages = await executeServerAction(fetchLanguages);
  return <Content languages={languages} />;
}
