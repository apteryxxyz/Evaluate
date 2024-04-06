'use client';

import type { Runtime } from '@evaluate/engine/runtimes';
import { Button } from '@evaluate/react/components/button';
import { Editor } from '@monaco-editor/react';
import { FilesIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import {
  useExplorer,
  useWatchExplorer,
} from '../../_contexts/explorer/explorer';
import { useMonaco } from '../../_hooks/use-monaco';
import { ExecuteBar } from './execute-bar';

export function CodeEditor(p: { runtime: Runtime }) {
  const explorer = useExplorer();
  useWatchExplorer(explorer);
  const monaco = useMonaco();

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const openedFile = explorer.findOpenedFile();
  useEffect(() => editorRef.current?.focus(void openedFile), [openedFile]);

  return (
    <section className="h-full">
      <div className="flex h-10 w-full items-center border-b px-0.5">
        <Button
          size="icon"
          variant="secondary"
          className="aspect-square lg:hidden"
          onClick={() =>
            window.dispatchEvent(new CustomEvent('file-explorer-open-change'))
          }
        >
          <FilesIcon className="size-4" />
          <span className="sr-only">Open File Explorer</span>
        </Button>

        <ExecuteBar runtime={p.runtime} className="ml-auto" />
      </div>

      <div className="relative h-full w-full">
        {openedFile && (
          <Editor
            onMount={(e) => {
              Reflect.set(editorRef, 'current', e);
              monaco?.editor.syncTheme();
            }}
            theme={monaco?.editor.theme}
            path={openedFile.path}
            defaultValue={openedFile.content}
            onChange={(content) => {
              if (openedFile.content === content) return;
              openedFile.setContent(content ?? '');
            }}
            options={{
              ariaRequired: true,
              minimap: { enabled: false },
              wordWrap: 'on',
            }}
            className="pt-1"
          />
        )}

        {!openedFile && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Image
              src="/images/icon.png"
              alt=""
              width={64}
              height={64}
              className="grayscale"
            />

            <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
              Get started by using the file explorer to create a file.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
