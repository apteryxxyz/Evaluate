'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAnalytics } from '~/contexts/analytics';

export function PageView() {
  const analytics = useAnalytics();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (analytics && pathname) {
      let url = window.origin + pathname;
      if (searchParams.toString()) url += `?${searchParams.toString()}`;
      analytics.capture('$pageview', { $current_url: url });
    }
  }, [analytics, pathname, searchParams]);

  return null;
}
