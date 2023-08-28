import { z } from 'zod';
import { ApiError, createApiRoute } from '@/builders/api-route';
import {
  fetchLanguages,
  getLanguage,
  searchLanguages,
} from '@/services/piston';

export const { handler: GET, executor: queryLanguages } = createApiRoute()
  .search(
    z.union([
      z.object({ query: z.string().min(1).max(52) }),
      z.object({ id: z.string().min(1).max(52) }),
      z.object({}),
    ]),
  )
  .definition(async ({ search }) => {
    if (!('id' in search)) {
      if (!('query' in search)) return fetchLanguages();
      return searchLanguages(search.query);
    }

    const language = await getLanguage(search.id);
    if (!language) throw new ApiError(404, 'Language not found');
    return [language];
  });
