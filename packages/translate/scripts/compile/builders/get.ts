export function buildGetFile(locales: Record<string, string>) {
  return `
// This file is generated automatically, any changes will be overwritten

import IntlMessageFormat from 'intl-messageformat';
import type { Locale } from './locales';
import type { TranslateFunctions } from './interfaces';
${Object.keys(locales)
  .map((l) => `import ${l} from './${l}.json' with { type: 'json' };`)
  .join('\n')}

type AnyObject = Record<PropertyKey, unknown>;
// biome-ignore lint/suspicious/noExplicitAny: Any is okay here
type AnyFunction = (...args: any[]) => unknown;

function wrapTarget(target: AnyObject, fn: AnyFunction): AnyFunction | AnyObject {
  if (typeof target === 'string') return fn.bind(null, target);
  return Object.assign(
    Object.defineProperty(() => target?.$, 'name', { writable: true }),
    target,
  );
}

function createProxy(target: AnyObject, fn: AnyFunction): AnyFunction | AnyObject {
  return new Proxy(wrapTarget(target, fn), {
    // @ts-ignore - Proxy type stuff
    get: (target, key) => createProxy(target[key], fn),
  });
}

export function getTranslate(locale: Locale) {
  let translations: AnyObject = {};
  ${Object.keys(locales)
    .map((l) => `if (locale === '${l}') translations = ${l};`)
    .join('\n  ')}

  return createProxy(translations, ((text: string, args: Parameters<IntlMessageFormat['format']>[0]) => {
    if (!text.includes('{')) return text;
    const message = new IntlMessageFormat(text, locale);
    return message.format(args);
  })) as unknown as TranslateFunctions;
}

  `.trim();
}
