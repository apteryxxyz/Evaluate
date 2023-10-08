import { ApiRouteBuilder } from '@builders/next/server';
import { executeCode, executeCodeOptionsSchema } from '@/services/piston';

export const POST = new ApiRouteBuilder()
  .setBody('application/json', executeCodeOptionsSchema)
  .setDefinition(async ({ body }) => executeCode(body));
