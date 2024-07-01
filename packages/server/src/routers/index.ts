import { createTRPCRouter } from '~/services/trpc';
import { aiRouter } from './ai/router';

export type AppRouter = typeof appRouter;
export const appRouter = createTRPCRouter({
  ai: aiRouter,
});
