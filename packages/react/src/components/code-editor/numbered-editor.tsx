import React, { useCallback, useMemo } from 'react';
import { BaseEditor } from './base-editor';

export function NumberedEditor(p: React.ComponentProps<typeof BaseEditor>) {
  const [borderWidth, leftPosition, maxLength] = //
    useMemo(() => getLineNumberDimensions(p.code), [p.code]);

  const highlighter = useCallback(
    (code: string) => {
      return (p.highlighter ? p.highlighter(code) : code)
        .split('\n')
        .map(
          (l, i) => `<span
            class="line-number font-mono"
            data-line-number="${String(i + 1).padStart(maxLength, ' ')}"
          >${l}</span>`,
        )
        .join('\n');
    },
    [p.highlighter, maxLength],
  );

  return (
    <>
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

      <BaseEditor
        {...p}
        highlighter={highlighter}
        dynamicStyle={(isFocused) => ({
          '--left-offset': `${leftPosition}px`,
          // When the editor is focused, the line numbers should be white
          '--line-number-colour': isFocused ? 'white' : 'black',
          borderLeftWidth: `${borderWidth}px`,
        })}
      />
    </>
  );
}

function getLineNumberDimensions(code: string) {
  const maxLength = code.split('\n').length.toString().length;
  const borderWidth = 18 + (maxLength - 1) * 7;
  const left = -12 - (maxLength - 1) * 8;
  return [borderWidth, left, maxLength] as const;
}
