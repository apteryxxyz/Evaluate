'use client';

import { Button } from '@evaluate/components/button';
import { Sheet, SheetContent, SheetTrigger } from '@evaluate/components/sheet';
import { useMediaQuery } from '@evaluate/hooks/media-query';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { Children, useCallback, useState } from 'react';
import { twMerge as cn } from 'tailwind-merge';
import { ThemeSwitcher } from './theme-switcher';

export function Header() {
  const isDesktop = useMediaQuery('lg');
  const Nav = isDesktop ? DesktopNavigationWrapper : MobileNavigationWrapper;

  const [open, setOpen] = useState(false);
  const closeByLink = useCallback(() => {
    setTimeout(() => setOpen(false), 100);
    return true;
  }, []);

  const pathname = usePathname();
  const isFullWidth = pathname.startsWith('/playgrounds/');

  return (
    <header className={cn('h-14 w-full px-4', !isFullWidth && 'container')}>
      <Nav open={open} setOpen={setOpen}>
        <Link href="/" className="flex items-center justify-center gap-1">
          <Image
            src="/images/icon.png"
            alt="Evaluate Logo"
            width={32}
            height={32}
            className="inline"
          />
          <span className="font-bold text-primary text-xl">Evaluate</span>
        </Link>

        <div>
          <Button variant="ghost" onClick={closeByLink} asChild>
            <Link href="/playgrounds">Playgrounds</Link>
          </Button>

          <Button
            variant="ghost"
            onClick={closeByLink}
            className="relative"
            asChild
          >
            <Link href="/products/browser-extension">
              Browser Extension
              <span className="absolute top-0 left-[5.8rem] text-primary text-xs">
                new
              </span>
            </Link>
          </Button>

          <Button variant="ghost" onClick={closeByLink} asChild>
            <Link href="/products/discord-bot">Discord Bot</Link>
          </Button>
        </div>

        <div>
          <ThemeSwitcher />
        </div>
      </Nav>
    </header>
  );
}

function DesktopNavigationWrapper(p: React.PropsWithChildren) {
  return (
    <nav
      className={cn(
        'flex h-full w-full items-center',
        '[&>div]:first-of-type:pl-3',
        '[&>div]:last-of-type:ml-auto',
      )}
    >
      {p.children}
    </nav>
  );
}

function MobileNavigationWrapper(
  p: React.PropsWithChildren<{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }>,
) {
  return (
    <div className="flex h-full w-full items-center">
      {Children.toArray(p.children)[0]}

      <Sheet open={p.open} onOpenChange={p.setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="ml-auto aspect-square"
          >
            <MenuIcon className="size-4" />
            <span className="sr-only">Toggle Mobile Navigation</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="border-l-0 bg-transparent"
          onClick={() => p.setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="h-full rounded-xl border-2 bg-card p-3"
          >
            <nav
              className={cn(
                'flex h-full flex-col gap-3',
                '[&>div]:first-of-type:flex [&>div]:first-of-type:flex-col [&>*]:[&>div]:first-of-type:justify-start',
                '[&>div]:last-of-type:mt-auto [&>div]:last-of-type:rounded-xl [&>div]:last-of-type:border',
              )}
            >
              {p.children}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
