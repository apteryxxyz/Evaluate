'use client';

import { Button } from '@evaluate/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@evaluate/components/dropdown-menu';
import { Say, useSay } from '@sayable/react';
import { LanguagesIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export function LocaleSwitcher() {
  const say = useSay();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <LanguagesIcon className="size-4" />
          <span className="sr-only">
            <Say>Change Language</Say>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {say.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className="capitalize cursor-pointer"
            asChild
          >
            <LocaleSwitcherItem locale={locale} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LocaleSwitcherItem({ locale, ...props }: { locale: string }) {
  const localisedHref = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.toString());
    const segments = url.pathname.split('/').filter(Boolean);
    if (/^[a-z]{2}(-[A-Z]{2})?$/.test(segments[0]!)) segments[0] = locale;
    else segments.unshift(locale);
    url.pathname = `/${segments.join('/')}`;
    url.searchParams.set('spl', '');
    return url.toString();
  }, [locale]);

  return (
    <Link href={localisedHref} {...props}>
      {new Intl.DisplayNames([locale], { type: 'language' }).of(locale)}
    </Link>
  );
}
