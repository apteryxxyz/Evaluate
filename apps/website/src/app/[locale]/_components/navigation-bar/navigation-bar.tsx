'use client';

import { Button } from '@evaluate/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@evaluate/ui/sheet';
import { MapIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslate } from '~/contexts/translate';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeSwitcher } from './theme-switcher';

export function NavigationBar() {
  return (
    <header className="container h-14">
      <DesktopNavigationBar />
      <MobileNavigationBar />
    </header>
  );
}

export function DesktopNavigationBar() {
  const t = useTranslate();

  return (
    <div className="hidden md:flex items-center h-full gap-2">
      <Link href="/" className="inline-flex items-center gap-2">
        <Image
          src="/android-chrome-192x192.png"
          alt="Evaluate logo"
          width={36}
          height={36}
        />
        <span className="text-primary font-bold text-xl">Evaluate</span>
      </Link>

      <nav className="inline-flex items-center gap-6">
        <Button variant="ghost" asChild>
          <a
            href="/products/discord-bot"
            rel="noreferrer noopener"
            target="_blank"
          >
            {t.discord_bot()}
          </a>
        </Button>
      </nav>

      <div className="ml-auto">
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export function MobileNavigationBar() {
  const t = useTranslate();

  return (
    <div className="flex md:hidden items-center h-full">
      <Link href="/" className="inline-flex items-center gap-2">
        <Image
          src="/android-chrome-192x192.png"
          alt="Evaluate logo"
          width={36}
          height={36}
        />
        <span className="text-primary font-bold text-xl">Evaluate</span>
      </Link>

      <div className="ml-auto">
        <LocaleSwitcher />
        <ThemeSwitcher />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MapIcon />
              <span className="sr-only">{t.screen_reader.toggle_menu()}</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="flex flex-col gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2"
            >
              <Image
                src="/android-chrome-192x192.png"
                alt="Evaluate logo"
                width={36}
                height={36}
              />
              <span className="text-primary font-bold text-xl">Evaluate</span>
            </Link>

            <nav className="grid grid-cols-2">
              <Button variant="outline" asChild>
                <a
                  href="/products/discord-bot"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {t.discord_bot()}
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
