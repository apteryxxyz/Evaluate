'use client';

import Image from 'next/image';
import { forwardRef, isValidElement, useState } from 'react';

export const ImageWithFallback = forwardRef<
  React.ElementRef<typeof Image>,
  Omit<React.ComponentProps<typeof Image>, 'src'> & {
    src?: string | undefined;
    fallback: string | React.ReactElement;
  }
>((p, ref) => {
  const [errored, setErrored] = useState(!p.src);
  if (errored && typeof p.fallback === 'string')
    return <Image ref={ref} {...p} src={p.fallback} />;
  if (errored && isValidElement(p.fallback)) return p.fallback;
  return (
    <Image ref={ref} {...p} src={p.src!} onError={() => setErrored(true)} />
  );
});
