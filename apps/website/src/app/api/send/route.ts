import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-umami-id') !== process.env.UMAMI_ID
  )
    return new NextResponse(null, { status: 403 });

  const response = await fetch('https://us.umami.is/api/send', {
    method: 'POST',
    headers: new Headers(request.headers),
    body: await request.text(),
  });

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: new Headers(response.headers),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'Content-Type, X-Umami-Id',
    },
  });
}
