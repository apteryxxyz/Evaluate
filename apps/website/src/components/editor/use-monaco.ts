import type monaco from 'monaco-editor';
import type { BeforeMount, OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef } from 'react';
import themes from './themes.json' with { type: 'json' };

export function useMonaco() {
  const monacoRef = useRef<typeof monaco>();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const { resolvedTheme } = useTheme();
  const theme = `evaluate-${resolvedTheme}`;
  const syncTheme = useCallback(() => {
    monacoRef.current?.editor.setTheme(theme);
  }, [theme]);
  useEffect(() => syncTheme(), [syncTheme]);

  const beforeMount = useCallback<BeforeMount>((monaco) => {
    Reflect.set(monacoRef, 'current', monaco);
    monaco.editor.defineTheme('evaluate-dark', themes.dark as never);
    monaco.editor.defineTheme('evaluate-light', themes.light as never);
  }, []);

  const onMount = useCallback<OnMount>(
    (editor) => {
      Reflect.set(editorRef, 'current', editor);
      syncTheme();
    },
    [syncTheme],
  );

  return {
    beforeMount,
    onMount,
    theme,
    monaco: monacoRef.current,
    editor: editorRef.current,
  };
}
