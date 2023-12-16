import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fetchLanguages } from '@evaluate/execute';
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

  return manifest.dynamicRoutes
    .map((r) => r.page.replace('/[locale]', '') || '/')
    .filter((r) => !r.includes('['))
    .map((r) => ({
      url: absoluteUrl(r),
      lastModified: new Date(),
    })) satisfies MetadataRoute.Sitemap;
}

async function loadDynamicPaths() {
  const languages = await fetchLanguages();

  return languages.map((l) => ({
    url: absoluteUrl(`/languages/${l.id}`),
    lastModified: new Date(),
  })) satisfies MetadataRoute.Sitemap;
}

export default async function getSitemap() {
  const entries = [...(await loadStaticPaths()), ...(await loadDynamicPaths())];
  return entries satisfies MetadataRoute.Sitemap;
}
