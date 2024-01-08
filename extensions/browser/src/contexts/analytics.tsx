import { Analytics } from '@evaluate/analytics/extensions/browser';
import { createContext, useContext, useMemo } from 'react';
import { absoluteUrl } from '~/utilities/url-helpers';

export const AnalyticsContext = createContext<Analytics<'client'> | null>(null);
AnalyticsContext.displayName = 'AnalyticsContext';
export const AnalyticsConsumer = AnalyticsContext.Consumer;

export function AnalyticsProvider(p: React.PropsWithChildren) {
  if (
    process.env.NODE_ENV !== 'production' ||
    !process.env.PLASMO_PUBLIC_UMAMI_ID
  )
    return <>{p.children}</>;

  const analytics = useMemo(
    () =>
      new Analytics(
        process.env.PLASMO_PUBLIC_UMAMI_ID!,
        absoluteUrl('/api/send'),
      ),
    [],
  );

  return (
    <AnalyticsContext.Provider value={analytics}>
      {p.children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
