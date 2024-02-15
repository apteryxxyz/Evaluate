import { NextRequest } from 'next/server';

function handler(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace('/api/ingest', '');
  const url = new URL(pathname, 'https://app.posthog.com/');
  url.search = request.nextUrl.searchParams.toString();

  const originRequest = new NextRequest(request);
  originRequest.headers.delete('cookie');
  return fetch(url.toString(), originRequest);
}

export const GET = handler;
export const POST = handler;
