'use client';

import { useDebouncedValue } from '@evaluate/react/hooks/debounced-value';
import { Editor, useMonaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo } from 'react';
import { EditorLoading } from './editor-loading';

export function MonacoEditor(p: {
  name: string;
  code: string;
  onChange: (code: string | undefined) => void;
}) {
  const [name] = useDebouncedValue(p.name, 500);
  const { resolvedTheme } = useTheme();
  const lineCount = useMemo(() => p.code.split('\n').length, [p.code]);

  const monaco = useMonaco();
  useEffect(() => {
    monaco?.editor.defineTheme('evaluate-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ token: '', background: '0c0a09' }],
      colors: {
        'editor.background': '#0c0a09',
        'editorSuggestWidget.background': '#171717',
        'editorHoverWidget.background': '#171717',
        'menu.background': '#171717',
        'menu.selectionBackground': '#242629',
        'input.background': '#0c0a09',
        'quickInput.background': '#171717',
        'quickInputList.focusBackground': '#242629',
      },
    });

    monaco?.editor.defineTheme('evaluate-light', {
      base: 'vs',
      inherit: true,
      rules: [{ token: '', background: 'ffffff' }],
      colors: {
        'editor.background': '#ffffff',
        'editorSuggestWidget.background': '#f3f3f3',
        'editorHoverWidget.background': '#f3f3f3',
        'menu.background': '#f3f3f3',
        'menu.selectionBackground': '#f0f0f0',
        'input.background': '#ffffff',
        'quickInput.background': '#f3f3f3',
        'quickInputList.focusBackground': '#f0f0f0',
      },
    });
  }, [monaco?.editor]);

  if (!resolvedTheme || !monaco) return <EditorLoading />;
  return (
    <div className="border-2 rounded-lg overflow-hidden">
      <Editor
        height={Math.max(300, lineCount * 19 + 44)}
        theme={resolvedTheme === 'light' ? 'evaluate-light' : 'evaluate-dark'}
        path={name}
        defaultValue={p.code}
        onChange={p.onChange}
        options={{
          minimap: { enabled: false },
          overviewRulerLanes: 0,
          wordWrap: 'on',
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
            handleMouseWheel: false,
          },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
