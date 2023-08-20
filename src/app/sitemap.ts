import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { MetadataRoute } from 'next/types';
import { locales } from 'translations';
import { fetchLanguages } from '@/services/piston';
import { absoluteUrl } from '@/utilities/url-helpers';

async function loadStaticPaths() {
  const manifestPath = join(process.cwd(), '.next', 'routes-manifest.json');
  const manifestContent = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent) as RoutesManifest;

  return manifest.staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${route.page}`),
      lastModified: new Date(),
    })),
  ) satisfies MetadataRoute.Sitemap;
}

async function loadDynamicPaths() {
  const languages = await fetchLanguages();

  return languages.flatMap((language) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}/${language.id}`),
      lastModified: new Date(),
    })),
  ) satisfies MetadataRoute.Sitemap;
}

export default async function Sitemap() {
  return [
    ...(await loadStaticPaths().catch(() => [])),
    ...(await loadDynamicPaths().catch(() => [])),
  ] satisfies MetadataRoute.Sitemap;
}

export interface RoutesManifest {
  version: number;
  pages404: boolean;
  caseSensitive: boolean;
  basePath: string;
  redirects: {
    source: string;
    destination: string;
    internal: boolean;
    statusCode: number;
    regex: string;
  }[];
  headers: unknown[];
  dynamicRoutes: {
    page: string;
    regex: string;
    routeKeys: Record<string, string>;
    namedRegex: string;
  }[];
  staticRoutes: {
    page: string;
    regex: string;
    routeKeys: Record<string, string>;
    namedRegex: string;
  }[];
  dataRoutes: unknown[];
  rsc: {
    header: string;
    varyHeader: string;
    contentTypeHeader: string;
  };
  rewrites: {
    source: string;
    destination: string;
    regex: string;
  }[];
}
