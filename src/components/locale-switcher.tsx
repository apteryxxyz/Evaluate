import { LanguagesIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Locale } from 'translations';
import { languages } from 'translations';
import { useTranslate } from '@/contexts/translate';
import { addLocale } from '@/utilities/url-helpers';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function LocaleSwitcher() {
  const t = useTranslate();
  const pathname = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname;
    return `/${path.split('/').slice(2).join('/')}`;
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <LanguagesIcon />
          <span className="sr-only">{t.screen_reader.change_locale()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {Object.entries(languages).map(([locale, language]) => (
          <DropdownMenuItem key={locale} asChild>
            <Link
              href={addLocale(pathname, locale as Locale)}
              className="hover:cursor-pointer"
            >
              {language}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem asChild>
          <Button asChild>
            <a
              href="/translate"
              className="hover:cursor-pointer"
              target="_blank"
              rel="noreferrer noopener"
            >
              Help Translate
            </a>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
