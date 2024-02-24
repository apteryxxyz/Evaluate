import { match } from '@formatjs/intl-localematcher';
import { Locale, locales } from '.';

// =============== Pathname ===============

export function determinePathnameLocale(pathname: string) {
  const pathLocale = pathname.split('/')[1];
  if (pathLocale?.match(/^([a-z]{2}|[a-z]{2}-[A-Z]{2})$/)) return pathLocale;
  return undefined;
}

// =============== Interaction ===============

interface InteractionLike {
  id: string;
  locale?: string;
  guild_locale?: string;
  user?: { locale?: string };
  member?: { user?: { locale?: string } };
}

export function determineInteractionLocale(interaction: InteractionLike) {
  return (
    interaction.locale ??
    interaction.user?.locale ??
    interaction.member?.user?.locale
  );
}

// =============== NextRequest ===============

interface NextRequestLike {
  nextUrl: { pathname: string };
  cookies: { get(name: string): { value: string } | undefined };
  headers: Headers;
}

export function determineNextRequestLocale(request: NextRequestLike) {
  const cookieValue = request.cookies.get('evaluate.locale')?.value;
  if (cookieValue && cookieValue in locales) return [cookieValue] as [Locale];
  return (request.headers.get('accept-language')?.split(',') ?? []) //
    .map((l) => l.split(';')[0]!.trim());
}

// =============== Combined ===============

export function determineLocale(
  value: string | InteractionLike | NextRequestLike,
  returnDefaultIfNotFound?: true,
): Locale;
export function determineLocale(
  value: string | InteractionLike | NextRequestLike,
  returnDefaultIfNotFound: false,
): Locale | undefined;
export function determineLocale(
  value: string | InteractionLike | NextRequestLike,
  returnDefaultIfNotFound = true,
) {
  const acceptedLocales = [];

  if (typeof value === 'string') {
    const pathLocale = determinePathnameLocale(value);
    if (pathLocale) acceptedLocales.push(pathLocale);
  }

  if (typeof value === 'object' && 'nextUrl' in value) {
    const requestLocale = determineNextRequestLocale(value);
    acceptedLocales.push(...requestLocale);
  }

  if (typeof value === 'object' && 'id' in value) {
    const interactionLocale = determineInteractionLocale(value);
    if (interactionLocale) acceptedLocales.push(interactionLocale);
  }

  try {
    const result = match(acceptedLocales, locales, 'none');
    if (result === 'none' && returnDefaultIfNotFound) return locales[0];
    if (result === 'none') return undefined;
    return result as Locale;
  } catch (e) {
    console.log({ value, acceptedLocales, locales, e });
    throw e;
  }
}
