import { useCallback, useEffect, useState } from 'react';
import { ApiError } from './error';
import type {
  ApiRoute,
  RequestBody,
  RequestSearch,
  ResponseData,
  ResponsePayload,
} from './types';

/* --- useQuery --- */

export type QueryResult<TRoute extends ApiRoute<unknown, unknown, unknown>> =
  | {
      data: ResponseData<TRoute>;
      error: null;
    }
  | {
      error: ApiError;
      data: null;
    }
  | {
      data: null;
      error: null;
    };

export type QueryOptions<TRoute extends ApiRoute<unknown, unknown, unknown>> =
  RequestSearch<TRoute> extends undefined
    ? RequestBody<TRoute> extends undefined
      ? { search?: undefined; body?: undefined }
      : { search?: undefined; body: RequestBody<TRoute> }
    : RequestBody<TRoute> extends undefined
    ? { search: RequestSearch<TRoute>; body?: undefined }
    : { search: RequestSearch<TRoute>; body: RequestBody<TRoute> };

export function useQuery<TRoute extends ApiRoute<unknown, unknown, unknown>>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  route: string,
  options: QueryOptions<TRoute>,
): QueryResult<TRoute> {
  const [data, setData] = useState<ResponseData<TRoute> | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const url = new URL(route, window.location.origin);
      url.search = new URLSearchParams(options.search as '').toString();

      const type =
        typeof options.body === 'string' ? 'text/plain' : 'application/json';
      const headers = new Headers({ 'Content-Type': type });

      const body =
        type === 'application/json'
          ? JSON.stringify(options.body)
          : String(options.body);

      const response = await fetch(url, { method, headers, body });
      const json = (await response.json()) as ResponsePayload<
        ResponseData<TRoute>
      >;

      if (!json.success) throw ApiError.fromObject(json.error);
      setData(json.data);
    } catch (cause) {
      if (cause instanceof ApiError) setError(cause);
      else {
        const message = cause instanceof Error ? cause.message : String(cause);
        setError(new ApiError(0o0, message));
      }
    }
  }, [method, route, setData, setError]);

  useEffect(() => {
    void fetchData();
  }, []);

  if (data) return { data, error: null };
  if (error) return { error, data: null };
  return { data: null, error: null };
}

/* --- useMutation --- */

export type MutationResult<TRoute extends ApiRoute<unknown, unknown, unknown>> =
  {
    mutate: (options: QueryOptions<TRoute>) => Promise<ResponseData<TRoute>>;
  } & (
    | {
        data: ResponseData<TRoute>;
        error: null;
      }
    | {
        error: ApiError;
        data: null;
      }
    | {
        data: null;
        error: null;
      }
  );

export function useMutation<TRoute extends ApiRoute<unknown, unknown, unknown>>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  route: string,
): MutationResult<TRoute> {
  const [data, setData] = useState<ResponseData<TRoute> | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(
    async (options: QueryOptions<TRoute>) => {
      try {
        const url = new URL(route, window.location.origin);
        url.search = new URLSearchParams(options.search as '').toString();

        const type =
          typeof options.body === 'string' ? 'text/plain' : 'application/json';
        const headers = new Headers({ 'Content-Type': type });

        const body =
          type === 'application/json'
            ? JSON.stringify(options.body)
            : String(options.body);

        const response = await fetch(url, { method, headers, body });
        const json = (await response.json()) as ResponsePayload<
          ResponseData<TRoute>
        >;

        if (!json.success) throw ApiError.fromObject(json.error);
        setData(json.data);
        return json.data;
      } catch (cause) {
        if (cause instanceof ApiError) {
          setError(cause);
          throw cause;
        } else {
          const message =
            cause instanceof Error ? cause.message : String(cause);
          const error = new ApiError(0o0, message);
          setError(error);
          throw error;
        }
      }
    },
    [method, route, setData, setError],
  );

  if (data) return { data, error: null, mutate: fetchData };
  if (error) return { error, data: null, mutate: fetchData };
  return { data: null, error: null, mutate: fetchData };
}
