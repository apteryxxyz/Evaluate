import { Locale, locales } from '.';

// =============== Pathname ===============

export function determinePathnameLocale(pathname: string) {
  const pathLocale = pathname.split('/')[1];
  if (pathLocale?.match(/\d{2}|\d{2}-\d{2}/)) return pathLocale;
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
    interaction.member?.user?.locale ??
    interaction.guild_locale
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

  return request.headers
    .get('accept-language')
    ?.split(',')
    .map((l) => l.split(';')[0]?.split('-')[0]);
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
    if (pathLocale && pathLocale in locales) return pathLocale;
  }

  if (typeof value === 'object' && 'nextUrl' in value) {
    const nextRequestLocale = determineNextRequestLocale(value);
    if (nextRequestLocale && nextRequestLocale.length > 0) {
      const foundLanguage = nextRequestLocale.find((l) => l && l in locales);
      if (foundLanguage) return foundLanguage as Locale;
    }
  }

  if (typeof value === 'object' && 'id' in value) {
    const interactionLocale = determineInteractionLocale(value);
    if (interactionLocale && interactionLocale in locales)
      return interactionLocale;
  }

  return returnDefaultIfNotFound ? locales[0] : undefined;
}
