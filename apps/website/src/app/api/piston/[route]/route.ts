import type { NextRequest } from 'next/server';
import env from '~/env';

function matchOrigin(origin: string, pattern: string) {
  if (pattern === '*') return true;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexPattern = `^${escaped.replace(/\*/g, '[^.]+')}$`;
  const regex = new RegExp(regexPattern);
  return regex.test(origin);
}

function withOriginCheck(
  handler: (
    req: NextRequest,
    ctx: RouteContext<'/api/piston/[route]'>,
  ) => Promise<Response>,
) {
  return async (req: NextRequest, ctx: RouteContext<'/api/piston/[route]'>) => {
    const origin = req.headers.get('origin') ?? '';
    const allowed = env.ALLOWED_ORIGIN.some((o) => matchOrigin(origin, o));
    if (!origin || !allowed) return new Response(null, { status: 403 });
    return handler(req, ctx);
  };
}

const BASE_URL = 'https://emkc.org/api/v2/piston';

async function handleRequest(
  req: NextRequest,
  { params }: RouteContext<'/api/piston/[route]'>,
) {
  const { route } = await params;
  const url = new URL(`${BASE_URL}/${route}${req.nextUrl.search}`);

  const upstream = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: env.PISTON_API_KEY,
    },
    body:
      req.method !== 'GET' && req.method !== 'HEAD'
        ? await req.text()
        : undefined,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? '' },
  });
}

export const GET = handleRequest;
export const POST = withOriginCheck(handleRequest);
export const OPTIONS = withOriginCheck(handleRequest);
