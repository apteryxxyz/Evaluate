import { createApiRoute } from '@/builders/api-route';
import { executeCode, executeCodeOptionsSchema } from '@/services/piston';

export const { handler: POST } = createApiRoute()
  .body('json', executeCodeOptionsSchema)
  .definition(async ({ body }) => executeCode(body));
