import Fuse from 'fuse.js';
import z from 'zod';
import { Callable } from './callable.js';
import { type Client, FETCH } from './client.js';
import {
  encodeRuntimeId,
  getRuntimeAliases,
  getRuntimeName,
  getRuntimePopularity,
  getRuntimeTags,
} from './getters.js';

export const Runtime = z
  .object({
    language: z.string(),
    version: z.string(),
    runtime: z.string().optional(),
    aliases: z.string().array(),
  })
  .transform((r) => {
    const id = encodeRuntimeId(r.language, r.runtime)!;
    return {
      id: id!,
      name: getRuntimeName(id!)!,
      version: r.version,
      aliases: getRuntimeAliases(id!)!,
      popularity: getRuntimePopularity(id!)!,
      tags: getRuntimeTags(id!)!,
    };
  });

export class Runtimes extends Callable<
  (options?: { force?: boolean }) => Promise<(typeof Runtime._output)[]>
> {
  #runtimes: (typeof Runtime._output)[] | null = null;

  constructor(client: Client) {
    super(async (options) => {
      return this.#runtimes && options?.force !== true
        ? this.#runtimes
        : client[FETCH]('/runtimes', {})
            .then((r) => r.json())
            .then(Runtime.array().parse)
            .then((r) => {
              const flat = r.reverse().map((rt) => [rt.id, rt] as const);
              const unique = [...new Map(flat).values()];
              return (this.#runtimes = unique);
            });
    });
  }

  async search(query: string | string[]) {
    const queries = Array.isArray(query) ? query : [query];
    if (queries.length === 0) return [];

    const runtimes = await this();
    const keys = ['name', 'aliases', 'tags'];
    const fuse = new Fuse(runtimes, { keys, threshold: 0.35 });

    return queries
      .flatMap((q) => fuse.search(q).map((r) => r.item))
      .filter((r, i, a) => a.indexOf(r) === i)
      .sort((a, b) => b.popularity - a.popularity);
  }

  async get(id: string) {
    return this().then((r) => r.find((r) => r.id === id));
  }
}
