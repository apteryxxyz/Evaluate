'use client';

import { Button } from '@evaluate/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@evaluate/ui/sheet';
import { MapIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguages } from '~/contexts/languages';
import { useTranslate } from '~/contexts/translate';
import { LocaleSwitcher } from './locale-switcher';
import { NavigationBar } from './navigation-bar';
import { ThemeSwitcher } from './theme-switcher';

export function HeaderBar() {
  const t = useTranslate();
  const { languages, setFilteredLanguages } = useLanguages();

  return (
    <header className="container h-14 flex items-center gap-2">
      <Link
        href="/"
        className="inline-flex items-center gap-2"
        onClick={() => setFilteredLanguages(languages)}
      >
        <Image src="/icon.png" alt="Evaluate logo" width={36} height={36} />
        <span className="text-primary font-bold text-xl">Evaluate</span>
      </Link>

      <NavigationBar isHeader />

      <div className="ml-auto">
        <LocaleSwitcher />
        <ThemeSwitcher />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MapIcon />
              {t && (
                <span className="sr-only">{t.screen_reader.toggle_menu()}</span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="flex flex-col gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2"
            >
              <Image
                src="/icon.png"
                alt="Evaluate logo"
                width={36}
                height={36}
              />
              <span className="text-primary font-bold text-xl">Evaluate</span>
            </Link>

            <NavigationBar isSheet />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
