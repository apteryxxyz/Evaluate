'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import analytics from '~/services/analytics';

export function PageView() {
  if (!analytics || typeof window === 'undefined') return null;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = useMemo(() => {
    if (typeof window === 'undefined') return;
    let url = window.origin + pathname;
    if (searchParams.toString()) url += `?${searchParams.toString()}`;
    return url;
  }, [pathname, searchParams]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: URL changes whenever search params change, but we don't care about that
  useEffect(() => {
    analytics?.capture('$pageview', { $current_url: url });
  }, [pathname]);

  return null;
}
