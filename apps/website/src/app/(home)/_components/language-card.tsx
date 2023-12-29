'use client';

import type { Language } from '@evaluate/execute';
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
import { useCallback, useMemo, useState } from 'react';
import { useTranslate } from '~/contexts/translate';

export function LanguageCard(p: Language) {
  const t = useTranslate();

  const [isHovered, setIsHovered] = useState(false);
  const [pinned, setPinned] = useLocalStorage<string[]>('evaluate.pinned', []);
  const isPinned = useMemo(() => pinned.includes(p.id), [p.id, pinned]);
  const togglePin = useCallback(
    () =>
      setPinned((r) =>
        isPinned ? r.filter((id) => id !== p.id) : [...r, p.id],
      ),
    [isPinned, p.id, setPinned],
  );

  return (
    <Card
      className="relative duration-300 hover:border-primary bg-transparent bg-glow"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setTimeout(() => setIsHovered(false), 2000)}
    >
      <CardHeader>
        <CardTitle>{p.name}</CardTitle>

        <CardDescription>
          {p.version && t.languages.version({ language_version: p.version })}
        </CardDescription>
      </CardHeader>

      <Link
        href={p.id}
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
            (isHovered || isPinned) && 'flex',
          )}
          onClick={togglePin}
        >
          <PinIcon size={16} fill={isPinned ? 'currentColor' : undefined} />
          <span className="sr-only">
            {isPinned
              ? t.screen_reader.unpin_language()
              : t.screen_reader.pin_language()}
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
