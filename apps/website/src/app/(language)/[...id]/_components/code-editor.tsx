import type { Language } from '@evaluate/execute';
import type { TextareaProps } from '@evaluate/ui/textarea';
import _omit from 'lodash/omit';
import Script from 'next/script';
import Prism from 'prismjs';
import components from 'prismjs/components.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';

import { cn } from '@evaluate/ui';
import 'prismjs/themes/prism.min.css';
import './code-editor.css';

function getLanguageName(language?: Language) {
  if (!language) return 'text';
  const values = [language.name, language.key, ...(language.aliases ?? [])] //
    .map((v) => v.toLowerCase());
  const languages = Object.entries(components.languages) //
    .map(([key, value]) => [key, value.title, value.alias].flat());
  const result = languages.find((m) => m.some((m) => values.includes(m)));
  return result ? result[0] : 'text';
}

function getLineNumberDimensions(code: string) {
  const length = code.split('\n').length.toString().length;
  const borderWidth = 18 + (length - 1) * 7;
  const left = -12 - (length - 1) * 8;
  return [borderWidth, left] as const;
}

export function CodeEditor(
  p: React.HTMLAttributes<HTMLDivElement> &
    Omit<TextareaProps, 'value' | 'onChange'> & {
      language?: Language;
      code: string;
      setCode: (code: string) => void;
    },
) {
  const name = useMemo(() => getLanguageName(p.language), [p.language]);
  const isPreloaded = useMemo(() => !!Prism.languages[name], [name]);
  const [isFocused, setIsFocused] = useState(false);
  const [borderWidth, leftPosition] = //
    useMemo(() => getLineNumberDimensions(p.code), [p.code]);

  const ref = useRef<Editor>(null);
  useEffect(() => {
    const textarea: HTMLTextAreaElement = Reflect.get(ref.current!, '_input');
    const pre = textarea?.parentElement?.childNodes[0] as HTMLPreElement;
    pre?.setAttribute('data-language', name);
  }, [name]);

  return (
    <>
      {/* Dynamically load the syntax grammar stuff */}
      {!isPreloaded && (
        <Script
          src={`https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-${name}.js`}
        />
      )}

      <Editor
        {..._omit(p, ['language', 'code', 'setCode'])}
        ref={ref}
        value={p.code}
        onValueChange={p.setCode}
        highlight={(code) => {
          const grammar = Prism.languages[name];
          if (!grammar) return code;
          return (
            Prism.highlight(code, grammar, name)
              // Operator style isn't correct when in dark mode, easiest way to fix
              .replaceAll('class="token operator"', 'class="token"')
              .split('\n')
              .map(
                (l, i) => `<span
                  class="line-number font-mono"
                  data-line-number="${i + 1}"
                >${l}</span>`,
              )
              .join('\n')
          );
        }}
        //
        style={{
          // @ts-expect-error - CSS variable
          '--left-offset': `${leftPosition}px`,
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
