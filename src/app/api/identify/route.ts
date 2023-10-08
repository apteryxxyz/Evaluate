import { ApiError, ApiRouteBuilder } from '@builders/next/server';
import { z } from 'zod';
import { identifyCode } from '@/services/assistant';

export const POST = new ApiRouteBuilder()
  .setBody('text/plain', z.string().nonempty().max(1000))
  .setDefinition(async ({ body }) => {
    const result = await identifyCode({ code: body });
    if (result === null) throw new ApiError(500, 'Failed to identify code');
    return result;
  });
