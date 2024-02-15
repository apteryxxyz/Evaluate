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
    headers: new Headers({
      'Content-Type': response.headers.get('content-type')!,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }),
  });
}

export const GET = handler;
export const POST = handler;

export function OPTIONS() {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  });
  return new Response(null, { status: 200, headers });
}
