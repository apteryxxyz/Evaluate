'use client';

import { cn } from '@evaluate/ui';
import { Button } from '@evaluate/ui/button';
import { useTranslate } from '~/contexts/translate';

export function NavigationBar(p: { isHeader?: true } | { isSheet?: true }) {
  const t = useTranslate();
  if (!t) return null;

  return (
    <nav
      className={cn(
        'gap-6',
        'isHeader' in p && 'hidden md:inline-flex items-center',
        'isSheet' in p && 'grid grid-cols-2',
      )}
    >
      <Button variant={'isHeader' in p ? 'ghost' : 'outline'} asChild>
        <a
          href="/products/discord-bot"
          rel="noreferrer noopener"
          target="_blank"
        >
          {t.discord_bot()}
        </a>
      </Button>
    </nav>
  );
}
