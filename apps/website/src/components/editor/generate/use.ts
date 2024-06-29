'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Editor = import('monaco-editor').editor.IStandaloneCodeEditor;
type State = { id?: string; width: number };

export function useGenerate(editor?: Editor) {
  const [state, setState] = useState<State>({ width: 500 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const onOpen = useCallback(() => {
    if (!editor || !widgetRef.current) return;

    const widgetElement = widgetRef.current;
    const getLine = () => editor?.getPosition()?.lineNumber ?? 1;

    editor.changeViewZones((changeAccessor) => {
      const id = changeAccessor.addZone({
        afterLineNumber: getLine(),
        heightInLines: 2,
        domNode: widgetElement,
      });

      const width = editor.getLayoutInfo().contentWidth;
      setState(() => ({ id, width }));
      widgetElement.classList.remove('!hidden');
      setTimeout(() => widgetElement.querySelector('input')?.focus(), 100);
    });

    editor.addContentWidget({
      getId: () => 'generate.widget',
      getDomNode: () => widgetElement,
      getPosition: () => ({
        position: { lineNumber: getLine(), column: 1 },
        preference: [2],
      }),
    });
  }, [editor]);

  const onClose = useCallback(() => {
    if (!editor || !state.id) return;

    editor.changeViewZones((c) => c.removeZone(state.id!));
    widgetRef.current?.classList.add('!hidden');
    setState((prev) => ({ ...prev, id: undefined }));
  }, [editor, state.id]);

  const onExpand = useCallback(() => {
    if (!editor) return;

    editor.changeViewZones((changeAccessor) => {
      if (!widgetRef.current) return;
      const widgetElement = widgetRef.current;

      if (state.id) changeAccessor.removeZone(state.id!);
      const id = changeAccessor.addZone({
        afterLineNumber: 1,
        domNode: widgetElement,
      });

      const width = editor.getLayoutInfo().contentWidth;
      setState(() => ({ id, width }));
      widgetElement.classList.remove('!hidden');
    });
  }, [editor, state.id]);

  useEffect(() => {
    const out = editor?.addAction({
      id: 'generate',
      label: 'Generate Code',
      contextMenuGroupId: '1_modification',
      keybindings: [2048 | 37],
      run: () => {
        onClose();
        onOpen();
      },
    });
    return () => out?.dispose();
  }, [editor, onClose, onOpen]);

  return [state, { widgetRef, onClose, onExpand }] as const;
}
