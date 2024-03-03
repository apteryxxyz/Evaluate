'use client';

import { Button } from '@evaluate/react/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@evaluate/react/components/dropdown-menu';
import { Locale, locales } from '@evaluate/translate';
import { LanguagesIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslate } from '~/contexts/translate';
import { addLocale } from '~/utilities/url-helpers';

export function LocaleSwitcher() {
  const t = useTranslate();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="no-ph-capture aspect-square"
        >
          <LanguagesIcon size={16} />
          {t && <span className="sr-only">{t.sr.change_locale()}</span>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {Object.entries(locales)
          .slice(locales.length)
          .map(([key, name]) => (
            <DropdownMenuItem key={key} asChild>
              <Button variant="ghost" asChild>
                <a
                  href={addLocale(pathname, key as Locale, false)}
                  className="cursor-pointer w-full"
                >
                  {name}
                </a>
              </Button>
            </DropdownMenuItem>
          ))}

        <DropdownMenuItem className="p-0" onClick={() => false}>
          <Button asChild className="w-full">
            <a href="/translate" target="_blank" rel="noreferrer noopener">
              Help Translate
            </a>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
