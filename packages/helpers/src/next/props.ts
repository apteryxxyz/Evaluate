import type { Simplify } from 'type-fest';

type Infer<T extends string, TT extends '[]' | '@'> = TT extends '[]'
  ? T extends `[...${infer TName}]`
    ? [TName, string[]]
    : T extends `[${infer TName}]`
      ? [TName, string]
      : [never, never]
  : TT extends '@'
    ? T extends `@${infer TName}`
      ? [TName, React.ReactNode]
      : [never, never]
    : [never, never];

type ParseDynamic<T extends string[]> = Simplify<
  {
    [key: string]: string | string[] | undefined;
  } & {
    [K in T[number] as Infer<K, '[]'>[0]]: Infer<K, '[]'>[1];
  }
>;
type ParseParallel<T extends string[]> = Simplify<
  {
    [key: string]: React.ReactNode | undefined;
  } & {
    [K in T[number] as Infer<K, '@'>[0]]: Infer<K, '@'>[1];
  }
>;

//

type LayoutEntry = `[${string}]` | `[...${string}]` | `@${string}`;
export type LayoutProps<T extends LayoutEntry[] = []> = Simplify<
  {
    children?: React.ReactNode;
  } & {
    params: Promise<ParseDynamic<T>>;
  } & ParseParallel<T>
>;

type PageEntry = `[${string}]` | `[...${string}]`;
export type PageProps<T extends PageEntry[] = []> = Simplify<{
  params: Promise<ParseDynamic<T>>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}>;

//

export function deepDecodeURIComponents<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(deepDecodeURIComponents) as T;
  } else if (typeof value === 'object' && value !== null) {
    const result: Record<string, string | string[]> = {};
    for (const [k, v] of Object.entries(value))
      result[k] = deepDecodeURIComponents(v);
    return result as T;
  } else if (typeof value === 'string') {
    return decodeURIComponent(value) as T;
  } else {
    return value;
  }
}
