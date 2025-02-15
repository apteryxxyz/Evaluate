'use client';

import { ServerThemeProvider } from 'next-themes';

export function HtmlProviders(p: React.PropsWithChildren) {
  return (
    <ServerThemeProvider
      attribute="class"
      defaultTheme="system"
      cookieName="evaluate.theme"
      storageKey="evaluate.theme"
      enableSystem
      disableTransitionOnChange
    >
      {p.children}
    </ServerThemeProvider>
  );
}

const MAX_RETRIES = 3;
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];
import { Toaster } from '@evaluate/components/toast';
import { TooltipProvider } from '@evaluate/components/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';
import { injectPageEventCapturing } from '~/services/posthog';
import { BreakpointIndicator } from './breakpoint-indicator';

export function BodyProviders(p: React.PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry(failureCount, error) {
              return (
                failureCount <= MAX_RETRIES &&
                // @ts-expect-error
                !HTTP_STATUS_TO_NOT_RETRY.includes(error.status)
              );
            },
          },
        },
      }),
  );

  useEffect(() => {
    injectPageEventCapturing();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {p.children}
        <ReactQueryDevtools initialIsOpen={false} />
        <BreakpointIndicator />
        <SpeedInsights />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
