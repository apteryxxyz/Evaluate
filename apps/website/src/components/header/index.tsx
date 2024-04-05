'use client';

import { Button } from '@evaluate/react/components/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@evaluate/react/components/sheet';
import { useMediaQuery } from '@evaluate/react/hooks/media-query';
import { cn } from '@evaluate/react/utilities/class-name';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { Children, useCallback, useMemo, useState } from 'react';
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
  const isFullWidth = useMemo(
    // TODO: Add challenges editor page when it is created
    () => pathname.startsWith('/playgrounds/'),
    [pathname],
  );

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
          <span className="font-bold text-xl text-primary">Evaluate</span>
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
              <span className="absolute top-0 left-[5.8rem] text-xs text-primary">
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
        'h-full w-full flex items-center',
        'first-of-type:[&>div]:pl-3',
        'last-of-type:[&>div]:ml-auto',
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
    <div className="w-full h-full flex items-center">
      {Children.toArray(p.children)[0]}

      <Sheet open={p.open} onOpenChange={p.setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="aspect-square ml-auto"
          >
            <MenuIcon className="size-4" />
            <span className="sr-only">Toggle Mobile Navigation</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="bg-transparent border-l-0"
          onClick={() => p.setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="rounded-xl border-2 bg-card h-full p-3"
          >
            <nav
              className={cn(
                'h-full flex flex-col gap-3',
                'first-of-type:[&>div]:flex first-of-type:[&>div]:flex-col [&>*]:first-of-type:[&>div]:justify-start',
                'last-of-type:[&>div]:mt-auto last-of-type:[&>div]:border last-of-type:[&>div]:rounded-xl',
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
