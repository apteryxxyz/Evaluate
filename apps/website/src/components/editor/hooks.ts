import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { keymap, useCodeMirror } from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo } from 'react';
import type { File } from 'virtual-file-explorer-backend';
import { useExplorer, useWatch } from '../explorer/use';
import { detectLanguage } from '../languages';
import shortcuts from './shortcuts';
import themes from './themes';

export function useEditor() {
  const explorer = useExplorer();
  useWatch(explorer, ['descendant:focused']);
  const focused = explorer.descendants //
    .find((d): d is File => d.type === 'file' && d.focused);
  useWatch(focused || explorer, ['name']);

  const { resolvedTheme } = useTheme();
  const theme = useMemo(
    () => (resolvedTheme === 'light' ? themes.light : themes.dark),
    [resolvedTheme],
  );

  const languageExtension = useMemo(() => {
    const language = detectLanguage(focused?.name);
    return loadLanguage(language)!;
  }, [focused?.name]);

  const shortcutsExtension = useMemo(() => {
    return keymap.of(shortcuts);
  }, []);

  const editor = useCodeMirror({
    onChange: (v) => focused && (focused.content = v),
    theme: theme,
    extensions: [languageExtension, shortcutsExtension],
    basicSetup: {
      defaultKeymap: false,
      searchKeymap: false,
      foldKeymap: false,
      lintKeymap: false,
    },
  });

  useEffect(() => {
    if (!editor.view) return;
    editor.view.dispatch({
      changes: {
        from: 0,
        to: editor.view.state.doc.length,
        insert: focused?.content ?? '',
      },
    });
  }, [editor.view, focused]);

  const handleExecuteClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent('execute-code'));
  }, []);
  const handleCopyClick = useCallback(() => {
    document.execCommand('copy');
  }, []);
  const handleCutClick = useCallback(() => {
    document.execCommand('cut');
  }, []);
  const handlePasteClick = useCallback(async () => {
    const text = await navigator.clipboard.readText();
    document.execCommand('insertText', false, text);
  }, []);

  return {
    ...editor,
    file: focused,
    handlers: {
      execute: handleExecuteClick,
      copy: handleCopyClick,
      cut: handleCutClick,
      paste: handlePasteClick,
    },
  };
}
