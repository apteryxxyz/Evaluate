'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useAnalytics } from '~/contexts/analytics';

export function PageView() {
  const analytics = useAnalytics();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const url = useMemo(() => {
    let url = window.origin + pathname;
    if (searchParams.toString()) url += `?${searchParams.toString()}`;
    return url;
  }, [pathname, searchParams]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: url is not a dependency
  useEffect(() => {
    analytics?.capture('$pageview', { $current_url: url });
    return () => void analytics?.capture('$pageleave', { $current_url: url });
  }, [analytics, pathname]);

  return null;
}
