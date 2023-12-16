'use client';

import type { Language } from '@evaluate/execute';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@evaluate/ui/card';
import { Skeleton } from '@evaluate/ui/skeleton';
import Link from 'next/link';
import { useTranslate } from '~/contexts/translate';

export function LanguageCard(p: Language) {
  const t = useTranslate();

  return (
    <Card className="relative hover:scale-110 duration-300 hover:border-primary">
      <CardHeader>
        <CardTitle>{p.name}</CardTitle>

        <CardDescription>
          {p.version && t.languages.version({ language_version: p.version })}
        </CardDescription>
      </CardHeader>

      <Link
        href={`/languages/${p.id}`}
        className="inset-0 absolute"
        // The user is unlikely to click most cards, no point in prefetching
        prefetch={false}
      />
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
