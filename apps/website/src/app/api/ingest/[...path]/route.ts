import { NextRequest, NextResponse } from 'next/server';

async function handler(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace('/api/ingest', '');
  const url = new URL(pathname, 'https://app.posthog.com/');
  url.search = request.nextUrl.searchParams.toString();

  console.log('[api/ingest]', {
    from: request.nextUrl.toString(),
    to: url.toString(),
  });

  const response = await fetch(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body ? await request.arrayBuffer() : undefined,
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export const GET = handler;
export const POST = handler;
