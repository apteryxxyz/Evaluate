'use client';

import { Locale, locales } from '@evaluate/translate';
import { Button } from '@evaluate/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@evaluate/ui/dropdown-menu';
import { LanguagesIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslate } from '~/contexts/translate';
import { addLocale, removeLocale } from '~/utilities/url-helpers';

export function LocaleSwitcher() {
  const t = useTranslate();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="aspect-square">
          <LanguagesIcon />
          <span className="sr-only">{t.screen_reader.change_locale()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {Object.entries(locales)
          .slice(locales.length)
          .map(([key, name]) => (
            <DropdownMenuItem key={key} asChild>
              <Link
                href={addLocale(removeLocale(pathname), key as Locale)}
                className="hover:cursor-pointer"
                prefetch={false}
              >
                {name}
              </Link>
            </DropdownMenuItem>
          ))}

        <DropdownMenuItem className="p-0" onClick={() => false}>
          <Button asChild className="w-full">
            <a href="/translate" target="_blank" rel="noreferrer noopener">
              {/* TODO: translate? */}
              Help Translate
            </a>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
