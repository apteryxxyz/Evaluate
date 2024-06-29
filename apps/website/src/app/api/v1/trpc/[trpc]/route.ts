import { appRouter } from '@evaluate/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

async function handler(request: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/v1/trpc',
    req: request,
    router: appRouter,
    createContext() {
      return { request };
    },
  });
}

export { handler as GET, handler as POST };
