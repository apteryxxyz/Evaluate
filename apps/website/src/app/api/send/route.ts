import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-umami-id') === process.env.UMAMI_ID
  )
    await fetch('https://us.umami.is/api/send', {
      method: 'POST',
      headers: request.headers,
      body: await request.text(),
    });

  return new NextResponse('', { status: 200 });
}
