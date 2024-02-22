import Prism from 'prismjs';
import components from 'prismjs/components.js';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Script } from '../script';
import { BaseEditor } from './base-editor';
import { NumberedEditor } from './numbered-editor';

export function HighlightedEditor(
  p: React.ComponentProps<typeof BaseEditor> & { language: LanguageLike },
) {
  const name = useMemo(() => getLanguageName(p.language), [p.language]);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea: HTMLTextAreaElement = Reflect.get(
      ref.current ?? {},
      '_input',
    );
    const pre = textarea?.parentElement?.childNodes[0] as HTMLPreElement;
    pre?.setAttribute('data-language', name);
  }, [name]);

  const highlighter = useCallback(
    (code: string) => {
      const grammar = name && Prism.languages[name];
      if (!grammar) return code;
      return Prism.highlight(code, grammar, name);
    },
    [name],
  );

  return (
    <>
      {!Prism.languages[name] && (
        <Script
          src={`https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-${name}.js`}
        />
      )}

      {/* [BROWSER EXTENSION] Importing prism theme via esm import affects
        the whole page, manually declare theme here to fix */}
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Yeah boi
        dangerouslySetInnerHTML={{
          __html: `code[class*="language-"],pre[class*="language-"]{color:black;text-shadow:0 1px white;font-family:Consolas,Monaco,'Andale Mono',monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*="language-"]::-moz-selection,pre[class*="language-"] ::-moz-selection,code[class*="language-"]::-moz-selection,code[class*="language-"] ::-moz-selection{text-shadow:none;background:#b3d4fc}pre[class*="language-"]::selection,pre[class*="language-"] ::selection,code[class*="language-"]::selection,code[class*="language-"] ::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*="language-"],pre[class*="language-"]{text-shadow:none}}pre[class*="language-"]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*="language-"],pre[class*="language-"]{background:#f5f2f0}:not(pre)>code[class*="language-"]{padding:.1em;border-radius:.3em}.token.comment,.token.prolog,.token.doctype,.token.cdata{color:slategray}.token.punctuation{color:#999}.namespace{opacity:.7}.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol,.token.deleted{color:#905}.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.inserted{color:#690}.token.operator,.token.entity,.token.url,.language-css .token.string,.style .token.string{color:#a67f59;background:hsla(0,0,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.function{color:#dd4a68}.token.regex,.token.important,.token.variable{color:#e90}.token.important,.token.bold{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}`,
        }}
      />

      <NumberedEditor
        {...p}
        // @ts-ignore
        ref={ref}
        highlighter={highlighter}
      />
    </>
  );
}

interface LanguageLike {
  short: string;
  name: string;
  key: string;
  aliases?: string[];
}

function getLanguageName(language?: LanguageLike) {
  if (!language) return 'text';
  const values = [
    language.short,
    language.name,
    language.key,
    ...(language.aliases ?? []),
    // Remove any numbers for extra aliases, e.g. `python2` -> `python`
    language.key.replace(/\d+/g, ''),
  ].map((v) => v.toLowerCase());
  const languages = Object.entries(components.languages) //
    .map(([key, value]) => [key, value.title, value.alias].flat());
  const result = languages.find((m) => m.some((m) => values.includes(m)));
  return String(result?.[0] || 'text');
}
