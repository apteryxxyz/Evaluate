// =============== Next.js Specific ===============

/*
export type ParamType<TParam extends string> = TParam extends `${infer TName}[]`
  ? { [key in TName]: string[] }
  : { [key in TParam]: string };

export type Params<TParams extends string[]> = TParams extends [
  infer TParam extends string,
  ...infer TRest extends string[],
]
  ? ParamType<TParam> & Params<TRest>
  : TParams extends [infer TParam extends string]
    ? ParamType<TParam>
    : object;

export type PageProps<TParams extends string[] | undefined = undefined> = {
  params: TParams extends string[] ? Params<TParams> : object;
  searchParams: Record<string, string | string[]>;
};

export type LayoutProps<TParams extends string[] | undefined = undefined> =
  React.PropsWithChildren<{
    params: TParams extends string[] ? Params<TParams> : object;
  }>;
*/

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
