import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fetchRuntimes } from '@evaluate/engine/runtimes';
import type { MetadataRoute } from 'next/types';
import { env } from '~/env';

interface RoutesManifest {
  staticRoutes: { page: string }[];
  dynamicRoutes: { page: string }[];
}

async function loadStaticPaths(): Promise<MetadataRoute.Sitemap> {
  const manifestPath = join(process.cwd(), '.next', 'routes-manifest.json');
  const manifest = await readFile(manifestPath, 'utf8')
    .then((c) => JSON.parse(c) as RoutesManifest)
    .catch(() => ({ staticRoutes: [], dynamicRoutes: [] }));

  return manifest.staticRoutes
    .filter((r) => !r.page.startsWith('/_'))
    .map((r) => ({
      url: `${env.WEBSITE_URL}${r.page}`,
      lastModified: new Date(),
    }));
}

async function loadDynamicPaths(): Promise<MetadataRoute.Sitemap> {
  const runtimes = await fetchRuntimes();
  return runtimes.map((r) => ({
    url: `${env.WEBSITE_URL}/playgrounds/${r.id}`,
    lastModified: new Date(),
  }));
}

export default async function getSitemap() {
  const staticPaths = await loadStaticPaths();
  const dynamicPaths = await loadDynamicPaths();
  return [...staticPaths, ...dynamicPaths];
}
