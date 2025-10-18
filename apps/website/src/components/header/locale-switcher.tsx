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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const localisedHref = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (/^[a-z]{2}(-[A-Z]{2})?$/.test(segments[0]!)) segments[0] = locale;
    else segments.unshift(locale);
    return `/${segments.join('/')}${searchParams.size ? '?' : ''}${searchParams}`;
  }, [locale, pathname, searchParams]);

  const updatePreferredLocale = useCallback(() => {
    // biome-ignore lint/suspicious/noDocumentCookie: update the locale cookie
    document.cookie = `preferred-locale=${locale}; max-age=31536000; path=/`;
  }, [locale]);

  return (
    <Link
      href={localisedHref}
      {...props}
      onClick={() => {
        updatePreferredLocale();
        router.push(localisedHref);
        return false;
      }}
    >
      {new Intl.DisplayNames([locale], { type: 'language' }).of(locale)}
    </Link>
  );
}
