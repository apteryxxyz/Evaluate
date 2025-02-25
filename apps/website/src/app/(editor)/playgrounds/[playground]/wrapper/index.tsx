'use client';

import { useMediaQuery } from '@evaluate/hooks/media-query';
import { Children } from 'react';
import { DesktopWrapper } from './desktop';
import { MobileWrapper } from './mobile';
import { EditorWrapperSkeleton } from './skeleton';

export function EditorWrapper({ children }: React.PropsWithChildren) {
  if (Children.count(children) !== 3) throw new Error('Invalid children');
  const isDesktop = useMediaQuery('lg');

  if (isDesktop === undefined) return <EditorWrapperSkeleton />;
  if (isDesktop) return <DesktopWrapper>{children}</DesktopWrapper>;
  return <MobileWrapper>{children}</MobileWrapper>;
}
