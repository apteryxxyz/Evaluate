import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fetchLanguages } from '@evaluate/languages';
import type { MetadataRoute } from 'next/types';
import { absoluteUrl } from '~/utilities/url-helpers';

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
    .filter((r) => !r.page.includes('[') && !r.page.startsWith('/_'))
    .map((r) => ({
      url: absoluteUrl(r.page),
      lastModified: new Date(),
    }));
}

async function loadDynamicPaths(): Promise<MetadataRoute.Sitemap> {
  const languages = await fetchLanguages();

  return languages.map((l) => ({
    url: absoluteUrl(`/languages/${l.id}`),
    lastModified: new Date(),
  }));
}

export default async function getSitemap() {
  return Promise.all([loadStaticPaths(), loadDynamicPaths()]) //
    .then((entries) => entries.flat());
}
