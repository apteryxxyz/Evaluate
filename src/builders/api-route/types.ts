import type { NextRequest, NextResponse } from 'next/server';
import type { ApiError } from './error';

/* --- Route --- */

export type ApiRouteHandler<_TSearch, _TBody, TData> = (
  request: NextRequest,
) => Promise<NextResponse<ResponsePayload<TData>>>;

export type ApiRouteExecutor<TSearch, TBody, TData> = (data: {
  search: TSearch;
  body: TBody;
}) => Promise<TData>;

export type ApiRoute<TSearch, TBody, TData> =
  | ApiRouteHandler<TSearch, TBody, TData>
  | ApiRouteExecutor<TSearch, TBody, TData>;

/* --- Response Payload --- */

export interface ResponseSuccessPayload<TData> {
  success: true;
  data: TData;
}

export interface ResponseErrorPayload {
  success: false;
  error: ReturnType<ApiError['toObject']>;
}

export type ResponsePayload<TData> =
  | ResponseSuccessPayload<TData>
  | ResponseErrorPayload;

/* --- Response Extractors --- */

export type RequestSearch<TRoute extends ApiRoute<unknown, unknown, unknown>> =
  TRoute extends ApiRoute<infer TSearch, infer _TBody, infer _TData>
    ? TSearch
    : never;

export type RequestBody<TRoute extends ApiRoute<unknown, unknown, unknown>> =
  TRoute extends ApiRoute<infer _TServer, infer TBody, infer _TData>
    ? TBody
    : never;

export type ResponseBody<TRoute extends ApiRoute<unknown, unknown, unknown>> =
  TRoute extends ApiRoute<infer _TServer, infer _TBody, infer TData>
    ? ResponsePayload<TData>
    : never;

export type ResponseData<TRoute extends ApiRoute<unknown, unknown, unknown>> =
  TRoute extends ApiRoute<infer _TServer, infer _TBody, infer TData>
    ? TData
    : never;
