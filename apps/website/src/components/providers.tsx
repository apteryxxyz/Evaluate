'use client';

import { TooltipProvider } from '@evaluate/react/components/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ServerThemeProvider } from 'next-themes';
import { useState } from 'react';
import { BreakpointIndicator } from './breakpoint-indicator';
import { PageView } from './page-view';

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

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        {p.children}
        <ReactQueryDevtools initialIsOpen={false} />
        <BreakpointIndicator />
        <SpeedInsights />
        <PageView />
      </QueryClientProvider>
    </TooltipProvider>
  );
}
