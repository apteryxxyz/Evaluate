import Link from 'next/link';
import { useLocale } from '@/contexts/locale';
import { addLocale } from '@/utilities/url-helpers';

type LinkWithLocaleProps = React.ComponentProps<typeof Link>;

export function LinkWithLocale({ href, ...p }: LinkWithLocaleProps) {
  const locale = useLocale();
  return <Link {...p} href={addLocale(href, locale)} />;
}
