import { initTRPC } from '@trpc/server';
import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import SuperJSON from 'superjson';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { aiRatelimiter } from './upstash';

export const t = initTRPC.context<{ request: Request }>().create({
  transformer: SuperJSON,
  errorFormatter(options) {
    if (options.error.cause instanceof ZodError) {
      const error = fromZodError(
        options.error.cause, //
        { prefix: '', prefixSeparator: '' },
      );

      return {
        code: TRPC_ERROR_CODES_BY_KEY.BAD_REQUEST,
        message: error.message,
        data: {
          ...options.shape.data,
          code: 'BAD_REQUEST',
          httpStatus: 400,
        },
      };
    }

    return options.shape;
  },
});

export const createTRPCRouter = t.router;
export const aiProcedure = t.procedure.use(aiRatelimiter);
