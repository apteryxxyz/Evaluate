'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@evaluate/components/card';
import type { PartialRuntime } from '@evaluate/shapes';
import { CodeIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ImageWithFallback } from '~/components/image-fallback';
import { type RGB, getDominantColour } from './get-colour';

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
}: { runtime: PartialRuntime; hash?: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [colour, setColour] = useState<RGB>();

  return (
    <Card
      style={{ '--colour': `rgb(${colour?.r}, ${colour?.g}, ${colour?.b})` }}
      className="relative duration-300 hover:border-[var(--colour)]"
    >
      <CardHeader className="h-full justify-center">
        <div className="flex items-center justify-start gap-2">
          <ImageWithFallback
            ref={imageRef}
            src={runtime.icon && makeIconUrl(runtime.icon)}
            width={24}
            height={24}
            alt={`${runtime.name} icon`}
            crossOrigin="anonymous"
            fallback={<CodeIcon />}
            onLoad={() => setColour(getDominantColour(imageRef.current!))}
          />

          <CardTitle level={2}>{runtime.name}</CardTitle>
        </div>
        <CardDescription>v{runtime.versions.at(-1)!}</CardDescription>
      </CardHeader>

      <Link
        suppressHydrationWarning
        className="absolute inset-0"
        href={`/playgrounds/${runtime.id}${hash ? `#${hash}` : ''}`}
        prefetch={false}
      >
        <span className="sr-only">{`Open ${runtime.name} Playground`}</span>
      </Link>
    </Card>
  );
}

function makeIconUrl(icon: string) {
  return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/940f2ea7a6fcdc0221ab9a8fc9454cc585de11f0/icons/${icon}.svg`;
}
