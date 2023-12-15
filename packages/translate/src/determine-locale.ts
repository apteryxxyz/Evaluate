import { Locale, locales } from '.';

// =============== Pathname ===============

function determinePathnameLocale(pathname: string) {
  const pathLocale = pathname.split('/')[1];
  if (pathLocale && pathLocale in locales) return pathLocale as Locale;
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

function determineInteractionLocale(interaction: InteractionLike) {
  const possibleLocale =
    interaction.locale ??
    interaction.user?.locale ??
    interaction.member?.user?.locale ??
    interaction.guild_locale;
  if (possibleLocale && possibleLocale in locales)
    return possibleLocale as Locale;
  return undefined;
}

// =============== NextRequest ===============

interface NextRequestLike {
  nextUrl: { pathname: string };
  cookies: { get(name: string): { value: string } | undefined };
  headers: Headers;
}

function determineNextRequestLocale(request: NextRequestLike) {
  const cookieValue = request.cookies.get('evaluate.locale')?.value;
  if (cookieValue && cookieValue in locales) return cookieValue as Locale;

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((l) => l.split(';')[0]?.split('-')[0]);
    for (const language of languages) {
      if (language && language in locales) return language as Locale;
    }
  }

  return determinePathnameLocale(request.nextUrl.pathname);
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
  if (typeof value === 'string') {
    const pathLocale = determinePathnameLocale(value);
    if (pathLocale) return pathLocale;
  }

  if (typeof value === 'object' && 'nextUrl' in value) {
    const nextRequestLocale = determineNextRequestLocale(value);
    if (nextRequestLocale) return nextRequestLocale;
  }

  if (typeof value === 'object' && 'id' in value) {
    const interactionLocale = determineInteractionLocale(value);
    if (interactionLocale) return interactionLocale;
  }

  return returnDefaultIfNotFound ? locales[0] : undefined;
}
