'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@evaluate/react/components/card';
import type { PartialRuntime } from '@evaluate/types';
import { CodeIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ImageWithFallback } from '~/components/image-fallback';
import { type RGB, getDominantColour } from '~/utilities/get-colour';

export function PlaygroundCard(p: {
  runtime: PartialRuntime;
  hash?: string;
}) {
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
            src={p.runtime.icon && makeIconUrl(p.runtime.icon)}
            width={24}
            height={24}
            alt={`${p.runtime.name} icon`}
            crossOrigin="anonymous"
            fallback={<CodeIcon />}
            onLoad={() => setColour(getDominantColour(imageRef.current!))}
          />

          <CardTitle level={2}>{p.runtime.name}</CardTitle>
        </div>
        <CardDescription>v{p.runtime.versions.at(-1)!}</CardDescription>
      </CardHeader>

      <Link
        suppressHydrationWarning
        className="absolute inset-0"
        href={`/playgrounds/${p.runtime.id}${p.hash ? `#${p.hash}` : ''}`}
        prefetch={false}
      >
        <span className="sr-only">{`Open ${p.runtime.name} Playground`}</span>
      </Link>
    </Card>
  );
}

function makeIconUrl(icon: string) {
  return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/940f2ea7a6fcdc0221ab9a8fc9454cc585de11f0/icons/${icon}.svg`;
}
