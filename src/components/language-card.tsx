import { useTranslate } from '@/contexts/translate';
import type { Language } from '@/services/piston';
import { LinkWithLocale } from './link-with-locale';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function LanguageCard(p: Language) {
  const t = useTranslate();

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{p.name}</CardTitle>

        <CardDescription>
          {p.version && t.languages.version({ language_version: p.version })}
        </CardDescription>
      </CardHeader>

      <LinkWithLocale
        href={`/languages/${p.id}`}
        className="inset-0 absolute"
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
