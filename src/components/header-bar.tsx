'use client';

import { MapIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLocale } from '@/contexts/locale';
import { useTranslate } from '@/contexts/translate';
import { addLocale } from '@/utilities/url-helpers';
import { IdentifyCodeButton } from './identify-code-button';
import { LanguageSearchBar } from './language-search-bar';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function HeaderBar() {
  const t = useTranslate();
  const locale = useLocale();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  return (
    <header className="container flex">
      <div className="flex gap-2 w-full whitespace-nowrap">
        <Link href={addLocale('/', locale)} className="flex items-center gap-2">
          <Image
            src="https://japi.rest/discord/v1/user/946755134443102258/avatar"
            alt="Evaluate logo."
            width={36}
            height={36}
          />
          <span className="text-primary font-bold text-xl">Evaluate</span>
        </Link>

        <nav className="hidden md:inline-block space-x-2">
          <IdentifyCodeButton />

          <Button variant="outline" asChild>
            <Link href="/bot">{t.discord_bot()}</Link>
          </Button>
        </nav>
      </div>

      <div className="ml-auto hidden md:flex">
        <LocaleSwitcher />
        <ThemeSwitcher />
        <LanguageSearchBar className="ml-1" />
      </div>

      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetTrigger asChild>
          <Button className="ml-auto md:hidden" variant="outline">
            <MapIcon size={16} />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="top" className="flex flex-col gap-2">
          <Link
            onClick={() => setIsMobileSheetOpen(false)}
            href={addLocale('/', locale)}
            className="flex items-center gap-2"
          >
            <Image
              src="https://japi.rest/discord/v1/user/946755134443102258/avatar"
              alt="evaluate logo"
              width={36}
              height={36}
            />
            <span className="text-primary font-bold text-xl">Evaluate</span>
          </Link>

          <IdentifyCodeButton
            onIdentifyDone={() => setIsMobileSheetOpen(false)}
          />

          <Button
            variant="outline"
            onClick={() => setIsMobileSheetOpen(false)}
            asChild
          >
            <Link href="/bot">{t.discord_bot()}</Link>
          </Button>

          <div className="flex justify-end">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>

          <LanguageSearchBar onSearchDone={() => setIsMobileSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
