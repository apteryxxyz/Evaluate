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

import { Toaster } from '@evaluate/react/components/toast';
import { TooltipProvider } from '@evaluate/react/components/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';
import { injectPageTracking } from '~/services/analytics';
import { getQueryConfig, getTRPCConfig, trpc } from '~/services/trpc';
import { BreakpointIndicator } from './breakpoint-indicator';

export function BodyProviders(p: React.PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient(getQueryConfig()));
  const [trpcClient] = useState(() => trpc.createClient(getTRPCConfig()));

  useEffect(() => {
    injectPageTracking();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {p.children}
          <ReactQueryDevtools initialIsOpen={false} />
          <BreakpointIndicator />
          <SpeedInsights />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
