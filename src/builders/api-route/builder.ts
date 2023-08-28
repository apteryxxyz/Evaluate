import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { ApiError } from './error';
import type { ApiRouteExecutor, ApiRouteHandler } from './types';

const CONTENT_TYPES = {
  text: 'text/plain',
  json: 'application/json',
} as const;

type Schema = z.ZodTypeAny;
type Accepts = keyof typeof CONTENT_TYPES;
type Search = Schema;
interface Body<
  TAccepts extends Accepts = Accepts,
  TSchema extends Schema = Schema,
> {
  accepts: TAccepts;
  schema: TSchema;
}

export interface ApiRouteOptions<
  TSearch extends Search | undefined = Search,
  TBody extends Body | undefined = Body,
> {
  search?: TSearch;
  body?: TBody;
}

export interface ApiRouteBuilder<TOptions extends ApiRouteOptions> {
  search<TSearch extends Search>(
    search: TSearch,
  ): ApiRouteBuilder<TOptions & { search: TSearch }>;

  body<TAccepts extends Accepts, TSchema extends Schema>(
    accepts: TAccepts,
    body: TSchema,
  ): ApiRouteBuilder<TOptions & { body: Body<TAccepts, TSchema> }>;

  definition<
    TSearch extends TOptions['search'] extends Search
      ? z.output<TOptions['search']>
      : undefined,
    TBody extends TOptions['body'] extends Body
      ? z.output<TOptions['body']['schema']>
      : undefined,
    TData,
  >(
    definition: (params: {
      request?: NextRequest;
      search: TSearch;
      body: TBody;
    }) => Promise<TData> | TData,
  ): {
    handler: ApiRouteHandler<TSearch, TBody, TData>;
    executor: ApiRouteExecutor<TSearch, TBody, TData>;
  };
}

function respondSuccess<TData>(data: TData) {
  return NextResponse.json({ success: true as const, data });
}

function respondError(...params: ConstructorParameters<typeof ApiError>) {
  const error = new ApiError(...params).toObject();
  return NextResponse.json(
    { success: false as const, error },
    { status: error.status },
  );
}

export const createApiRouteBuilder = <TOptions extends ApiRouteOptions = {}>(
  options: TOptions = {} as TOptions,
): ApiRouteBuilder<TOptions> => ({
  search(search) {
    return createApiRouteBuilder({
      ...options,
      search,
    });
  },

  body(accepts, schema) {
    return createApiRouteBuilder({
      ...options,
      body: { accepts, schema },
    });
  },

  definition(definition) {
    if (
      typeof definition !== 'function' ||
      definition.constructor.name !== 'AsyncFunction'
    )
      throw new TypeError(
        "Parameter for 'definition' must be an async function",
      );

    type TParams = Parameters<typeof definition>[0];
    type TSearch = TParams['search'];
    type TBody = TParams['body'];

    async function executor(data: {
      request?: NextRequest;
      search: TSearch;
      body: TBody;
    }) {
      /* --- Search Start --- */
      let search;
      if (options.search) {
        const parsedSearch = options.search.safeParse(data.search);
        if (parsedSearch.success) search = parsedSearch.data as TSearch;
        else throw new ApiError(400, 'Invalid search parameters');
      }
      /* --- Search End --- */

      /* --- Body Start --- */
      let body;
      if (options.body) {
        const parsedBody = options.body.schema.safeParse(data.body);
        if (parsedBody.success) body = parsedBody.data as TBody;
        else throw new ApiError(400, 'Invalid body content');
      }
      /* --- Body End --- */

      /* --- Execute Handler Start --- */
      try {
        return definition({ request: data.request, search, body } as TParams);
      } catch (cause) {
        if (cause instanceof ApiError) throw cause;
        throw new ApiError(500, 'Internal server error');
      }
      /* --- Execute Handler End --- */
    }

    async function handler(request: NextRequest) {
      /* --- Accepts Start --- */
      let contentType;
      if (options.body) {
        const incomingType =
          request.headers.get('content-type') ?? 'text/plain';
        const requiredType = CONTENT_TYPES[options.body.accepts];
        if (incomingType === requiredType) contentType = requiredType;
        else return respondError(406, 'Not acceptable content type');
      }
      /* --- Accepts End --- */

      /* --- Search & Body Start --- */
      const search = Object.fromEntries(request.nextUrl.searchParams);
      const body = await (contentType === CONTENT_TYPES.json
        ? request.json()
        : request.text()
      ).catch(() => null);
      /* --- Search & Body End --- */

      /* --- Execute Handler Start --- */
      try {
        const data = await executor({ request, search, body } as TParams);
        return respondSuccess(data);
      } catch (cause) {
        if (cause instanceof ApiError)
          return respondError(cause.status, cause.message);
        else
          return respondError(
            500,
            process.env.NODE_ENV === 'development'
              ? String(
                  typeof cause === 'object' && cause && 'message' in cause
                    ? cause.message
                    : cause,
                )
              : 'Internal server error, hidden in production',
          );
      }
      /* --- Execute Handler End --- */
    }

    return { handler, executor };
  },
});

export const createApiRoute = () => createApiRouteBuilder({});
