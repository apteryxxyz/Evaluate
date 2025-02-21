'use client';

import { useMediaQuery } from '@evaluate/hooks/media-query';
import dynamic from 'next/dynamic';
import { Children } from 'react';

const DesktopWrapper = dynamic(
  () => import('./desktop').then((m) => m.DesktopWrapper),
  { ssr: false },
);
const MobileWrapper = dynamic(
  () => import('./mobile').then((m) => m.MobileWrapper),
  { ssr: false },
);

export function EditorWrapper({ children }: React.PropsWithChildren) {
  if (Children.count(children) !== 3) throw new Error('Invalid children');
  const isDesktop = useMediaQuery('lg');
  if (isDesktop) return <DesktopWrapper>{children}</DesktopWrapper>;
  else return <MobileWrapper>{children}</MobileWrapper>;
}
