'use client';

import type { BeforeMount, OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import themes from './themes.json' with { type: 'json' };

type Monaco = typeof import('monaco-editor');
type Editor = import('monaco-editor').editor.IStandaloneCodeEditor;

export function useEditor() {
  const monacoRef = useRef<Monaco>();
  const [editor, setEditor] = useState<Editor>();

  const theme = `evaluate-${useTheme().resolvedTheme}`;
  useEffect(() => monacoRef.current?.editor.setTheme(theme), [theme]);

  const beforeMount = useCallback<BeforeMount>((monaco) => {
    monaco.editor.defineTheme('evaluate-dark', themes.dark as never);
    monaco.editor.defineTheme('evaluate-light', themes.light as never);
    monaco.editor.addKeybindingRule({
      keybinding: 2048 | 37,
      command: 'null',
    });
  }, []);

  const onMount = useCallback<OnMount>(
    (editor, monaco) => {
      setEditor(editor);
      monaco.editor.setTheme(theme);
    },
    [theme],
  );

  return [editor, { theme, beforeMount, onMount }] as const;
}
