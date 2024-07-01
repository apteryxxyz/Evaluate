import type { AppRouter } from '@evaluate/server';
import type { QueryClientConfig } from '@tanstack/react-query';
import {
  type CreateTRPCClientOptions,
  httpBatchLink,
  loggerLink,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import SuperJSON from 'superjson';
import { env } from '~/env';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  return env.WEBSITE_URL;
}

export function getQueryConfig() {
  const MAX_RETRIES = 3;
  const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

  return {
    defaultOptions: {
      queries: {
        retry(failureCount, error) {
          return (
            failureCount <= MAX_RETRIES &&
            // @ts-expect-error - error.status is not defined in the type
            !HTTP_STATUS_TO_NOT_RETRY.includes(error.status)
          );
        },
      },
    },
  } satisfies QueryClientConfig;
}

export function getTRPCConfig() {
  return {
    links: [
      loggerLink({
        enabled: (opts) =>
          (process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined') ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: `${getBaseUrl()}/api/v1/trpc`,
        transformer: SuperJSON,
      }),
    ],
  } satisfies CreateTRPCClientOptions<AppRouter>;
}

export const trpc = createTRPCReact<AppRouter>({});
