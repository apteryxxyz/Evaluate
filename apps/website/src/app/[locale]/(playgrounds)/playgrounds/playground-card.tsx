'use client';

import { Button } from '@evaluate/components/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@evaluate/components/card';
import { Say } from '@sayable/react';
import { CodeIcon, PinIcon } from 'lucide-react';
import { getRuntimeIconUrl, type Runtime } from 'piston.ts';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ImageWithFallback } from '~/components/image-fallback';
import { LocalisedLink } from '~/components/localised-link';
import { useLocalStorage } from '~/hooks/local-storage';
import { getDominantColour, type RGB } from './get-colour';

declare module 'react' {
  namespace CSS {
    interface Properties {
      [key: `--${string}`]: string;
    }
  }
}

export function PlaygroundCard({
  runtime,
  hash,
}: {
  runtime: typeof Runtime._output;
  hash?: string;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [colour, setColour] = useState<RGB>();

  const [pinnedRuntimes, setPinnedRuntimes] = //
    useLocalStorage<string[]>('evaluate.pinned', []);
  const pinned = useMemo(
    () => pinnedRuntimes.includes(runtime.id),
    [pinnedRuntimes, runtime.id],
  );
  const togglePin = useCallback(() => {
    if (pinned) {
      setPinnedRuntimes(pinnedRuntimes.filter((id) => id !== runtime.id));
    } else {
      setPinnedRuntimes([...pinnedRuntimes, runtime.id]);
    }
  }, [pinned, pinnedRuntimes, runtime.id, setPinnedRuntimes]);

  return (
    <Card
      style={{ '--_': `rgb(${colour?.r}, ${colour?.g}, ${colour?.b})` }}
      className="group relative min-h-[110px] border-2 duration-300 hover:border-(--_)"
      data-pinned={pinned}
    >
      <CardHeader className="h-full justify-center">
        <div className="flex items-center justify-start gap-2">
          <ImageWithFallback
            ref={imageRef}
            src={getRuntimeIconUrl(runtime.id) || ''}
            width={24}
            height={24}
            alt={`${runtime.name} icon`}
            crossOrigin="anonymous"
            fallback={<CodeIcon />}
            onLoad={() => setColour(getDominantColour(imageRef.current!))}
          />

          <CardTitle level={2}>{runtime.name}</CardTitle>
        </div>

        <CardDescription>v{runtime.version}</CardDescription>
      </CardHeader>

      <LocalisedLink
        suppressHydrationWarning
        className="absolute inset-0"
        href={`/playgrounds/${runtime.id}${hash ? `#${hash}` : ''}`}
        prefetch={false}
      >
        <span className="sr-only">
          <Say>Open {runtime.name} Playground</Say>
        </span>
      </LocalisedLink>

      <div className="absolute top-0 right-0">
        <Button
          size="icon"
          variant="ghost"
          className="!bg-transparent text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-data-[pinned=true]:opacity-100"
          onClick={togglePin}
        >
          <PinIcon
            size={16}
            className="group-data-[pinned=true]:fill-current"
          />
        </Button>
      </div>
    </Card>
  );
}
