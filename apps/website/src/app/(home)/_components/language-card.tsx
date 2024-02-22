'use client';

import type { Language } from '@evaluate/languages';
import { Button } from '@evaluate/react/components/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@evaluate/react/components/card';
import { Skeleton } from '@evaluate/react/components/skeleton';
import { useLocalStorage } from '@evaluate/react/hooks/local-storage';
import { cn } from '@evaluate/react/utilities/class-name';
import { PinIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { useTranslate } from '~/contexts/translate';

export function LanguageCard(p: Language) {
  const t = useTranslate();

  const linkHref = useMemo(() => {
    // Pass the data from the current search params to the language page
    // The browser extension uses this to prefill the editor
    const currentParams = new URLSearchParams(window.location.search);
    const data = currentParams.get('d');
    if (!data) return `/languages/${p.id}`;
    const nextParams = new URLSearchParams({ d: data });
    return `/languages/${p.id}?${nextParams.toString()}`;
  }, [p.id]);

  const [pinned, setPinned] = useLocalStorage<string[]>('evaluate.pinned', []);
  const isPinned = useMemo(() => pinned.includes(p.id), [p.id, pinned]);
  const togglePin = useCallback(() => {
    if (!isPinned) setPinned((r) => [...r, p.id]);
    else setPinned((r) => r.filter((id) => id !== p.id));
  }, [isPinned, p.id, setPinned]);

  if (!t) return <SkeletonLanguageCard />;
  return (
    <Card className="group relative duration-300 hover:border-primary bg-transparent bg-glow">
      <CardHeader>
        <CardTitle>{p.name}</CardTitle>

        <CardDescription>
          {p.version && t.language.version({ language_version: p.version })}
        </CardDescription>
      </CardHeader>

      <Link
        href={linkHref}
        className="inset-0 absolute"
        // The user is unlikely to click most cards, no point in prefetching
        prefetch={false}
      />

      <div className="absolute top-0 right-0">
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'hidden duration-300 text-muted-foreground !bg-transparent',
            isPinned ? 'flex' : 'group-hover:flex',
          )}
          onClick={togglePin}
        >
          <PinIcon size={16} fill={isPinned ? 'currentColor' : undefined} />
          <span className="sr-only">
            {isPinned ? t.language.pin() : t.language.unpin()}
          </span>
        </Button>
      </div>
    </Card>
  );
}

export function SkeletonLanguageCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-2/5 h-5" />
        <Skeleton className="w-1/2 h-4" />
      </CardHeader>
    </Card>
  );
}
