import { ApiError, ApiRouteBuilder } from '@builders/next/server';
import { z } from 'zod';
import {
  fetchLanguages,
  getLanguage,
  searchLanguages,
} from '@/services/piston';

export const GET = new ApiRouteBuilder()
  .setSearch(
    z.object({
      query: z.string().min(1).max(52).optional(),
      id: z.string().min(1).max(52).optional(),
    }),
  )
  .setDefinition(async ({ search }) => {
    if (!('id' in search)) {
      if (!('query' in search)) return fetchLanguages();
      return searchLanguages(search.query!);
    }

    const language = await getLanguage(search.id!);
    if (!language) throw new ApiError(404, 'Language not found');
    return [language];
  });
