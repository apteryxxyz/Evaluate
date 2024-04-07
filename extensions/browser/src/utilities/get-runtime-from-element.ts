import type { PartialRuntime } from '@evaluate/engine/runtimes';
import Fuse from 'fuse.js';

export async function getRuntimeFromElement(
  runtimes: PartialRuntime[],
  element: HTMLPreElement,
) {
  const elements = [
    ...[element, element.parentElement],
    ...Array.from(element.children ?? []),
  ].filter((e): e is HTMLElement => e instanceof HTMLElement);

  const hints = [];
  for (const element of elements) {
    const dataLanguage = element.getAttribute('data-language');
    const matchedLanguage = element.className.match(
      /lang(?:uage)?-([a-z]+)/,
    )?.[0];

    if (dataLanguage) hints.push(dataLanguage);
    if (matchedLanguage) hints.push(matchedLanguage);
  }
  for (const name of elements.flatMap((e) => e.className.split(/ |-/))) {
    if (!name) continue;
    hints.push(name);
  }

  if (hints.length === 0) return null;

  const fuse = new Fuse(runtimes, {
    keys: ['id', 'name', 'aliases'],
    threshold: 0.0,
    shouldSort: true,
  });

  for (const hint of hints) {
    const results = fuse.search(hint);
    if (results.length === 0) continue;

    for (const result of results)
      if (result.item.aliases.includes(hint)) return result.item;
    return results[0]!.item;
  }

  return null;
}
