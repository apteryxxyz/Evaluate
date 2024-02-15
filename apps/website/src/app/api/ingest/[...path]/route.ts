import { NextRequest, NextResponse } from 'next/server';

async function handler(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace('/api/ingest', '');
  const url = new URL(pathname, 'https://app.posthog.com/');
  url.search = request.nextUrl.searchParams.toString();

  try {
    const response = await fetch(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body ? await request.arrayBuffer() : undefined,
    });

    return new NextResponse(await response.arrayBuffer(), {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('[api/ingest]', error);
    return new NextResponse(null, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
