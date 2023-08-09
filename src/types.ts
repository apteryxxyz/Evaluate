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
  : {};

export type PageProps<
  TParams extends string[] | undefined = undefined,
  TSearchParams extends string[] | undefined = undefined,
> = {
  params: TParams extends string[] ? Params<TParams> : {};
  searchParams: TSearchParams extends string[]
    ? { [key in TSearchParams[number]]?: string | string[] }
    : {};
} & {};

export type LayoutProps<TParams extends string[] | undefined = undefined> =
  React.PropsWithChildren<{
    params: TParams extends string[] ? Params<TParams> : {};
  }>;
