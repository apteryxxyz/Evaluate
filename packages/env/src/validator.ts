import { z } from 'zod';

type EmptyRecord = Record<never, never>;

type Simplify<T> = {
  [P in keyof T]: T[P];
} & {};

//

interface ListenerOptions<TVariables extends Record<string, unknown>> {
  onValid?: (env: TVariables) => void;
  onInvalid?: (error: Zod.ZodError) => void;
  onDisallowed?: (name: keyof TVariables) => void;
}

//

interface ServerOptions<
  TPrefix extends string | undefined,
  TShape extends Record<string, Zod.ZodType>,
> {
  server?: {
    [TKey in keyof TShape]: TPrefix extends undefined
      ? TShape[TKey]
      : TPrefix extends ''
        ? TShape[TKey]
        : TKey extends `${TPrefix}${string}`
          ? never
          : TShape[TKey];
  };
}

interface ClientOptions<
  TPrefix extends string | undefined,
  TShape extends Record<string, z.ZodType>,
> {
  prefix?: TPrefix;
  client?: {
    [TKey in keyof TShape]: TKey extends `${TPrefix}${string}`
      ? TShape[TKey]
      : never;
  };
}

//

interface LooseVariableOptions {
  variables: Record<string, string | undefined>;
}

interface StrictVariableOptions<TKeys extends PropertyKey> {
  variablesStrict: Record<TKeys, string | undefined>;
}

//

type Options<
  TPrefix extends string | undefined,
  TServerShape extends Record<string, z.ZodType> = EmptyRecord,
  TClientShape extends Record<string, z.ZodType> = EmptyRecord,
  TVariables extends Simplify<
    z.infer<z.ZodObject<TServerShape>> & z.infer<z.ZodObject<TClientShape>>
  > = Simplify<
    z.infer<z.ZodObject<TServerShape>> & z.infer<z.ZodObject<TClientShape>>
  >,
> = ListenerOptions<TVariables> &
  ServerOptions<TPrefix, TServerShape> &
  ClientOptions<TPrefix, TClientShape> &
  (LooseVariableOptions | StrictVariableOptions<keyof TVariables>);

//

/**
 * Validate the environment variables and return a proxy object.
 * @param options the options to use when validating the environment variables
 * @returns a proxy object that can be used to access the environment variables
 */
export function validateEnv<
  TPrefix extends string | undefined,
  TServerShape extends Record<string, z.ZodType> = EmptyRecord,
  TClientShape extends Record<string, z.ZodType> = EmptyRecord,
  TVariables extends Simplify<
    z.infer<z.ZodObject<TServerShape>> & z.infer<z.ZodObject<TClientShape>>
  > = Simplify<
    z.infer<z.ZodObject<TServerShape>> & z.infer<z.ZodObject<TClientShape>>
  >,
>(
  options: Options<TPrefix, TServerShape, TClientShape, TVariables>,
): TVariables {
  const variables =
    'variablesStrict' in options ? options.variablesStrict : options.variables;
  for (const [key, value] of Object.entries(variables))
    if (value === '') delete variables[key];

  const clientSchema = z.object(options.client ?? {});
  const serverSchema = z.object(options.server ?? {}).merge(clientSchema);

  const isServer = typeof window === 'undefined';
  const parseResult = isServer
    ? serverSchema.safeParse(variables)
    : clientSchema.safeParse(variables);

  function onValid(env: TVariables) {
    return options.onValid?.(env);
  }

  function onInvalid(error: z.ZodError) {
    if (options.onInvalid) return options.onInvalid(error);
    console.error(
      '❌ Invalid environment variables:',
      error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }

  function isClientVariable(name: keyof TVariables) {
    return (
      String(name).startsWith(options.prefix ?? '') &&
      name in (options.client ?? {})
    );
  }

  if (parseResult.success) {
    onValid(parseResult.data as TVariables);
    return buildEnvProxy(
      parseResult.data as TVariables, //
      { isClientVariable, ...options },
    );
  } else {
    onInvalid(parseResult.error);
  }

  return {} as never;
}

/**
 * Takes a record of environment variables and returns a proxy object.
 * @param variables the environment variables to use
 * @param options the options to use when creating the proxy object
 * @returns a proxy object that can be used to access the environment variables
 */
function buildEnvProxy<T extends Record<string, unknown>>(
  variables: T,
  options: {
    isClientVariable: (name: keyof T) => boolean;
    onDisallowed?: (name: keyof T) => void;
  },
): T {
  function isDisallowed(name: keyof T) {
    return typeof window !== 'undefined' && !options.isClientVariable(name);
  }

  function onDisallowed(name: keyof T) {
    if (options.onDisallowed) return options.onDisallowed(name);
    throw new Error(
      '❌ Attempted to access a server-side environment variable from the client',
    );
  }

  return new Proxy(variables, {
    get(target, name: string) {
      if (typeof name !== 'string') return Reflect.get(target, name);
      if (isDisallowed(name)) return onDisallowed(name);
      return Reflect.get(target, name);
    },
  });
}
