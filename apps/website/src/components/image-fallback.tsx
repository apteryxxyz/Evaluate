'use client';

import Image from 'next/image';
import { isValidElement, useState } from 'react';

export function ImageWithFallback({
  src,
  fallback,
  ...props
}: Omit<React.ComponentProps<typeof Image>, 'src'> & {
  src?: string | undefined;
  fallback: string | React.ReactElement;
}) {
  const [errored, setErrored] = useState(!src);
  if (errored && typeof fallback === 'string')
    return <Image src={fallback} {...props} />;
  if (errored && isValidElement(fallback)) return fallback;
  return <Image src={src!} onError={() => setErrored(true)} {...props} />;
}
