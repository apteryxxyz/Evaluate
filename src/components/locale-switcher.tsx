import { LanguagesIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from 'translations';
import { languages } from 'translations';
import { useTranslate } from '@/contexts/translate';
import { addLocale, removeLocale } from '@/utilities/url-helpers';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function LocaleSwitcher() {
  const t = useTranslate();
  const pathname = usePathname();

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
              href={addLocale(removeLocale(pathname), locale as Locale)}
              className="hover:cursor-pointer"
            >
              {language}
            </Link>
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
