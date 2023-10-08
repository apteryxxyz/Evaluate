'use server';

import { GET as queryLanguages } from '@/api/languages/route';
import type { PageProps } from '@/types';
import Content from './content';

export default async function Page(_p: PageProps<['locale']>) {
  const languages = await queryLanguages({ search: {}, body: undefined });
  // @ts-expect-error - Incorrect types
  return <Content languages={languages} />;
}
