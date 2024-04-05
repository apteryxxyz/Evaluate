import { useParams } from 'next/navigation';

export function useDecodedParams<
  T extends Record<string, string | string[]>,
>() {
  const params = useParams<T>();
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? value.map(decodeURIComponent)
        : decodeURIComponent(value),
    ]),
  ) as T;
}
