'use client';

import _omit from 'lodash/omit';
import Prism from 'prismjs';
import components from 'prismjs/components.js';
import 'prismjs/themes/prism.min.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PossibleEditor from 'react-simple-code-editor';
import { cn } from '~/utilities/class-name';
import { Script } from './script';
import type { TextareaProps } from './textarea';

// Idk why we need to use default crap, but here it is
// biome-ignore lint/suspicious/noExplicitAny: Needed
const Editor: any =
  'default' in PossibleEditor ? PossibleEditor.default : PossibleEditor;

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

function getLineNumberDimensions(code: string) {
  const maxLength = code.split('\n').length.toString().length;
  const borderWidth = 18 + (maxLength - 1) * 7;
  const left = -12 - (maxLength - 1) * 8;
  return [borderWidth, left, maxLength] as const;
}

export function CodeEditor(
  p: React.HTMLAttributes<HTMLDivElement> &
    Omit<TextareaProps, 'value' | 'onChange'> & {
      language?: LanguageLike;
      code: string;
      setCode: (code: string) => void;
    },
) {
  const name = useMemo(() => getLanguageName(p.language), [p.language]);
  const [isFocused, setIsFocused] = useState(false);
  const [borderWidth, leftPosition, maxLength] = //
    useMemo(() => getLineNumberDimensions(p.code), [p.code]);

  const ref = useRef<typeof Editor>(null);
  useEffect(() => {
    const textarea: HTMLTextAreaElement = Reflect.get(ref.current!, '_input');
    const pre = textarea?.parentElement?.childNodes[0] as HTMLPreElement;
    pre?.setAttribute('data-language', name);
  }, [name]);

  return (
    <>
      {/* TODO: Add option to disable this, for the browser extension */}
      {/* Dynamically load the syntax grammar stuff */}
      {!Prism.languages[name] && (
        <Script
          src={`https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-${name}.js`}
        />
      )}

      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Yeah boi
        dangerouslySetInnerHTML={{
          __html: `
          .line-number:before {
            position: absolute;
            left: var(--left-offset);
            content: attr(data-line-number);
            color: var(--line-number-colour, white);
          }

          /* In dark mode, the line numbers should always be white */
          .dark .line-number:before {
            color: white !important;
          }
          `,
        }}
      />

      <Editor
        {..._omit(p, ['language', 'code', 'setCode'])}
        ref={ref}
        value={p.code}
        onValueChange={p.setCode}
        highlight={(code: string) => {
          const grammar = Prism.languages[name];
          return (
            (grammar ? Prism.highlight(code, grammar, name) : code)
              // Operator style isn't correct when in dark mode, easiest way to fix
              .replaceAll('class="token operator"', 'class="token"')
              .split('\n')
              .map(
                (l, i) => `<span
                  class="line-number font-mono"
                  data-line-number="${String(i + 1).padStart(maxLength, ' ')}"
                >${l}</span>`,
              )
              .join('\n')
          );
        }}
        //
        style={{
          '--left-offset': `${leftPosition}px`,
          // When the editor is focused, the line numbers should be white
          '--line-number-colour': isFocused ? 'white' : 'black',
          borderLeftWidth: `${borderWidth}px`,
        }}
        className={cn(
          '!overflow-visible min-h-[120px] rounded-md border border-input text-sm bg-transparent shadow duration-300',
          p.code && 'font-mono',
          isFocused && 'border-ring',
          p.code.length > 0 && '!font-mono',
        )}
        preClassName="!px-3 !py-2"
        textareaClassName="!px-3 !py-2 !outline-none placeholder:text-muted-foreground"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </>
  );
}
