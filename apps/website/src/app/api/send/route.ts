import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-umami-id') !== process.env.UMAMI_ID
  )
    return new NextResponse(null, { status: 403 });

  const response = await fetch(
    'https://us.umami.is/api/send', //
    { method: 'POST', headers: request.headers, body: request.body },
  );
  void response;

  return new NextResponse(null);

  // const headers = new Headers(request.headers);
  // const body = await request.text();
  // const response = await fetch(
  //   'https://us.umami.is/api/send', //
  //   { method: 'POST', headers, body },
  // );

  // return new NextResponse(null, {
  //   status: response.status,
  //   headers: response.headers,
  // });
}

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     headers: {
//       'access-control-allow-origin': '*',
//       'access-control-allow-methods': 'POST, OPTIONS',
//       'access-control-allow-headers': 'Content-Type, X-Umami-Id',
//     },
//   });
// }
