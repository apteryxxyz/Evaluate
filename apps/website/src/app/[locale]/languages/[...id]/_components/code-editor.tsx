import type { Language } from '@evaluate/execute';
import type { TextareaProps } from '@evaluate/ui/textarea';
import _omit from 'lodash/omit';
import Script from 'next/script';
import Prism from 'prismjs';
import components from 'prismjs/components.js';
import { useMemo, useState } from 'react';
import Editor from 'react-simple-code-editor';

import { cn } from '@evaluate/ui';
import 'prismjs/themes/prism.min.css';

function getLanguageName(language: Language) {
  const values = [language.name, language.key, ...(language.aliases ?? [])] //
    .map((v) => v.toLowerCase());
  const languages = Object.entries(components.languages) //
    .map(([key, value]) => [key, value.title, value.alias].flat());
  const result = languages.find((m) => m.some((m) => values.includes(m)));
  return result ? result[0] : 'text';
}

export function CodeEditor(
  p: React.HTMLAttributes<HTMLDivElement> &
    Omit<TextareaProps, 'value' | 'onChange'> & {
      language: Language;
      code: string;
      setCode: (code: string) => void;
    },
) {
  const name = useMemo(() => getLanguageName(p.language), [p.language]);
  const isPreloaded = useMemo(() => !!Prism.languages[name], [name]);
  const [isFocused, setIsFocused] = useState(false);

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
        value={p.code}
        onValueChange={p.setCode}
        highlight={(code) => {
          const grammar = Prism.languages[name];
          if (!grammar) return code;
          return (
            Prism.highlight(code, grammar, name)
              // Operator style isn't correct when in dark mode, easiest way to fix
              .replaceAll('class="token operator"', 'class="token"')
          );
        }}
        //
        className={cn(
          'min-h-[120px] rounded-md border border-input text-sm bg-transparent shadow',
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
