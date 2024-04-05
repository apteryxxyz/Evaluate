// =============== Next.js Specific ===============

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

// =============== Other ===============

export type Overloads<T> = T extends {
  (...args: infer A1): infer R1;
  (...args: infer A2): infer R2;
  (...args: infer A3): infer R3;
  (...args: infer A4): infer R4;
  (...args: infer A5): infer R5;
  (...args: infer A6): infer R6;
  (...args: infer A7): infer R7;
  (...args: infer A8): infer R8;
  (...args: infer A9): infer R9;
}
  ?
      | ((...args: A1) => R1)
      | ((...args: A2) => R2)
      | ((...args: A3) => R3)
      | ((...args: A4) => R4)
      | ((...args: A5) => R5)
      | ((...args: A6) => R6)
      | ((...args: A7) => R7)
      | ((...args: A8) => R8)
      | ((...args: A9) => R9)
  : never;
