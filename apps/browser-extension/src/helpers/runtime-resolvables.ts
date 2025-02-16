const LanguageExtractors = [
  // wikipedia.org
  (e) => e.className.match(/mw-highlight-lang-(\w+)/)?.[1],
  // github.com, npmjs.com
  (e) => e.className.match(/highlight-source-(\w+)/)?.[1],
  // developer.chrome.com
  (e) => e.className.match(/lang-(\w+)/)?.[1],
  // w3schools.com
  (e) => e.className.match(/(\w+)High/)?.[1],
  // plasmo.com
  (e) => e.getAttribute('data-language'),
  // developer.mozilla.org
  (e) => e.className.match(/brush: (\w+)/)?.[1],
  // freecodecamp.org
  (e) => e.className.match(/language-(\w+)/)?.[1],
  // discord.com
  (e) => e.className.match(/hljs (\w+)/)?.[1],
] satisfies ((element: HTMLElement) => string | null | undefined)[];

export function extractRuntimeResolvables(element: HTMLElement) {
  const possibleLanguages: string[] = [];

  let elementToCheck: HTMLElement | null = element;
  while (elementToCheck) {
    if (['HTML', 'BODY'].includes(elementToCheck.tagName)) break;
    for (const extractor of LanguageExtractors) {
      const language = extractor(elementToCheck);
      if (language) possibleLanguages.push(language);
    }
    elementToCheck = elementToCheck.parentElement;
  }

  return possibleLanguages;
}
