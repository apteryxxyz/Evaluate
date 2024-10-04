import Fuse from 'fuse.js';
import { z } from 'zod';
import {
  getRuntimeAliases,
  getRuntimeExamples,
  getRuntimeIcon,
  getRuntimeName,
  getRuntimePopularity,
  getRuntimeTags,
  isRuntimeIdentifier,
} from './getters';
import { makeIdentifier } from './identifier';
import {
  type PartialRuntime,
  PistonRuntime,
  type Runtime,
} from '@evaluate/types';

const Runtimes = new Map<string, PartialRuntime>();

/**
 * Fetches the runtimes from the Piston API.
 * @returns the runtimes
 */
export async function fetchRuntimes() {
  if (Runtimes.size) return Array.from(Runtimes.values());

  const pistonRuntimes = await fetch('https://emkc.org/api/v2/piston/runtimes')
    .then((response) => response.json())
    .then(z.array(PistonRuntime).parse);

  for (const piston of pistonRuntimes) {
    const identifier = makeIdentifier(piston.language, piston.runtime);
    if (!isRuntimeIdentifier(identifier)) continue;

    const evaluate = Runtimes.get(identifier);
    if (evaluate) {
      evaluate.versions.push(piston.version);
    } else {
      Runtimes.set(identifier, {
        id: identifier,
        name: getRuntimeName(identifier)!,
        versions: [piston.version],
        aliases: getRuntimeAliases(identifier)!,
        popularity: getRuntimePopularity(identifier)!,
        tags: getRuntimeTags(identifier)!,
        icon: getRuntimeIcon(identifier),
      });
    }
  }

  return Array.from(Runtimes.values())
    .sort((a, b) => b.popularity - a.popularity);
}

/**
 * Searches the runtimes by a query.
 * @param queries the query to search by
 * @returns the runtimes that match the query
 */
export async function searchRuntimes(...queries: string[]) {
  if (queries.length === 0) return [];

  const runtimes = await fetchRuntimes();
  const keys = ['name', 'aliases', 'tags'];
  const fuse = new Fuse(runtimes, { keys, threshold: 0.3 });

  return queries
    .flatMap((q) => fuse.search(q).map((r) => r.item))
    .filter((r, i, a) => a.indexOf(r) === i);
}

/**
 * Gets a runtime by its identifier.
 * @param identifier the identifier of the runtime
 * @param version the version of the runtime
 * @returns the runtime
 */
export async function getRuntime(identifier: string, version = 'latest') {
  const runtimes = await fetchRuntimes();
  const runtime = runtimes.find((r) => r.id === identifier);
  if (!runtime) return undefined;

  if (version === 'latest') version = runtime.versions.at(-1)!;
  const versioned = runtime.versions.find((v) => v === version);
  if (!versioned) return null;

  return {
    ...runtime,
    examples: getRuntimeExamples(identifier),
  } as Runtime;
}
