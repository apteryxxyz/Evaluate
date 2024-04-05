import { useMonaco as useInternalMonaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect } from 'react';

type Monaco = ReturnType<typeof useInternalMonaco> & {
  editor: { theme: `evaluate-${'light' | 'dark'}`; syncTheme: () => void };
};

export function useMonaco(): Monaco | null {
  const monaco = useInternalMonaco();
  useEffect(() => {
    monaco?.editor.defineTheme('evaluate-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ token: '', background: '1c1917' }],
      colors: {
        'editor.background': '#1c1917',
        'editorSuggestWidget.background': '#1c1917',
        'editorHoverWidget.background': '#1c1917',
        'menu.background': '#1c1917',
        'menu.selectionBackground': '#242629',
        'input.background': '#1c1917',
        'quickInput.background': '#1c1917',
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
  }, [monaco]);

  const { resolvedTheme } = useTheme();
  const theme = `evaluate-${resolvedTheme}`;

  const syncTheme = useCallback(() => {
    monaco?.editor.setTheme(theme);
  }, [monaco, theme]);
  useEffect(() => syncTheme(), [syncTheme]);

  if (!monaco) return null;
  Reflect.set(monaco?.editor ?? {}, 'theme', theme);
  Reflect.set(monaco?.editor ?? {}, 'syncTheme', syncTheme);
  return monaco as Monaco;
}
