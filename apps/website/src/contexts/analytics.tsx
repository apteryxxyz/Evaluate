import { WebsiteAnalytics } from '@evaluate/analytics';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { absoluteUrl } from '~/utilities/url-helpers';

export const AnalyticsContext = //
  createContext<WebsiteAnalytics | null>(null);
AnalyticsContext.displayName = 'AnalyticsContext';
export const AnalyticsConsumer = AnalyticsContext.Consumer;

export function AnalyticsProvider(p: React.PropsWithChildren) {
  if (
    process.env.NODE_ENV !== 'production' ||
    !process.env.NEXT_PUBLIC_UMAMI_ID
  )
    return <>{p.children}</>;

  const analytics = useMemo(
    () =>
      new WebsiteAnalytics(
        process.env.NEXT_PUBLIC_UMAMI_ID!,
        absoluteUrl('/api/send'),
      ),
    [],
  );

  const pathname = usePathname();
  // biome-ignore lint/correctness/useExhaustiveDependencies: Trigger page view on pathname change
  useEffect(() => void analytics.track(), [pathname]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {p.children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
