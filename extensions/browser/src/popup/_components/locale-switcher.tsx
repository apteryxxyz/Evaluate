import { Button } from '@evaluate/react/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@evaluate/react/components/dropdown-menu';
import { Locale, locales } from '@evaluate/translate';
import { LanguagesIcon } from 'lucide-react';
import { useTranslate } from '~contexts/translate';

export function LocaleSwitcher() {
  const t = useTranslate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="aspect-square">
          <LanguagesIcon size={16} />
          {t && (
            <span className="sr-only">{t.screen_reader.change_locale()}</span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {Object.entries(locales)
          .slice(locales.length)
          .map(([key, name]) => (
            <DropdownMenuItem key={key} asChild>
              <Button
                variant="ghost"
                className="w-full cursor-pointer"
                onClick={() => t.setLocale(key as Locale)}
              >
                {name}
              </Button>
            </DropdownMenuItem>
          ))}

        <DropdownMenuItem className="p-0" onClick={() => false}>
          <Button asChild className="w-full">
            <a
              href="https://translate.evaluate.run/"
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
