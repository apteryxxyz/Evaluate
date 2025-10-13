'use client';

import { useSay } from '@sayable/react';
import Link from 'next/link';

export function LocalisedLink({
  href,
  ...props
}: React.ComponentProps<typeof Link> & { locale?: string }) {
  const say = useSay();
  if (say.locale !== say.locales[0]) href = `/${say.locale}${href}`;
  return <Link {...props} href={href} />;
}
