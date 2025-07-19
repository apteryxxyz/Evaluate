import fetch from '@evaluate/fetch';
import { memoize } from 'es-toolkit/function';
import Fuse from 'fuse.js';
import {
  encodeRuntimeId,
  getRuntimeAliases,
  getRuntimeName,
  getRuntimePopularity,
  getRuntimeTags,
} from './getters.js';
import { PistonRuntime, Runtime } from './shapes.js';

/** Fetches the runtimes from the Piston API */
export const fetchAllRuntimes = memoize(
  async () => {
    const rawRuntimes = await fetch('https://emkc.org/api/v2/piston/runtimes')
      .then((r) => r.json())
      .then(PistonRuntime.array().parse);

    const runtimes = new Map<string, Runtime>();
    for (const r of rawRuntimes) {
      const id = encodeRuntimeId(r.language, r.runtime);
      if (!id) continue;
      runtimes.set(
        id,
        Runtime.parse({
          id,
          name: getRuntimeName(id)!,
          version: r.version,
          aliases: getRuntimeAliases(id)!,
          popularity: getRuntimePopularity(id)!,
          tags: getRuntimeTags(id)!,
        }),
      );
    }
    return Array.from(runtimes.values());
  },
  { getCacheKey: JSON.stringify },
);

/** Search the runtimes by a query  */
export const searchForRuntimes = memoize(
  async (query: string | string[]) => {
    const queries = Array.isArray(query) ? query : [query];
    if (queries.length === 0) return [];

    const runtimes = await fetchAllRuntimes();
    const keys = ['name', 'aliases', 'tags'];
    const fuse = new Fuse(runtimes, { keys, threshold: 0.35 });

    return queries
      .flatMap((q) => fuse.search(q).map((r) => r.item))
      .filter((r, i, a) => a.indexOf(r) === i)
      .sort((a, b) => b.popularity - a.popularity);
  },
  { getCacheKey: JSON.stringify },
);

/** Fetch a single runtime by its ID */
export const fetchRuntimeById = memoize(async (id: string) => {
  const runtimes = await fetchAllRuntimes();
  return runtimes.find((r) => r.id === id);
});
