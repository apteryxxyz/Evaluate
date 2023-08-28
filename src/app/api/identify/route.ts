import { z } from 'zod';
import { ApiError, createApiRoute } from '@/builders/api-route';
import { identifyCode } from '@/services/assistant';

export const { handler: POST } = createApiRoute()
  .body('text', z.string().nonempty().max(1000))
  .definition(async ({ body }) => {
    const result = await identifyCode({ code: body });
    if (result === null) throw new ApiError(500, 'Failed to identify code');
    return result;
  });
