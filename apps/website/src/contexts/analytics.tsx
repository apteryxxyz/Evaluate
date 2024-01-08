import { Analytics } from '@evaluate/analytics/client';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo } from 'react';

export const AnalyticsContext = createContext<Analytics | null>(null);
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
      new Analytics(
        process.env.NEXT_PUBLIC_UMAMI_ID!,
        process.env.NEXT_PUBLIC_WEBSITE_URL,
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
  return useContext(AnalyticsContext)!;
}
