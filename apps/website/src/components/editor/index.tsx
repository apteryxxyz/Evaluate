'use client';

import type { PartialRuntime } from '@evaluate/engine/runtimes';
import { Button } from '@evaluate/react/components/button';
import { ScrollArea, ScrollBar } from '@evaluate/react/components/scroll-area';
import MonacoEditor from '@monaco-editor/react';
import { FilesIcon, TerminalIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useExplorer, useWatchExplorer } from './explorer/use';
import { ExecuteBar } from './header/execute-bar';
import { OpenedFilesBar } from './header/opened-files-bar';
import { useMonaco } from './use-monaco';

export function Editor(p: { runtime: PartialRuntime }) {
  const explorer = useExplorer();
  useWatchExplorer(explorer);
  const openedFile = explorer.findOpenedFile();

  const monaco = useMonaco();
  useEffect(() => {
    void openedFile;
    monaco.editor?.focus();
  }, [monaco.editor, openedFile]);

  return (
    <section className="h-full">
      <div className="flex flex-col items-center gap-1 border-b px-0.5 lg:h-10 lg:flex-row">
        <div className="flex w-full gap-1 lg:overflow-hidden">
          <ScrollArea className="flex w-full whitespace-nowrap">
            <OpenedFilesBar />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <Button
            variant="secondary"
            className="ml-auto aspect-square p-0 lg:hidden"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('mobile-explorer-open-change'),
              )
            }
          >
            <FilesIcon className="size-4" />
          </Button>
        </div>

        <div className="flex w-full gap-1 lg:w-auto">
          <ExecuteBar runtime={p.runtime} />

          <Button
            variant="secondary"
            className="ml-auto aspect-square p-0 lg:hidden"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('mobile-terminal-open-change'),
              )
            }
          >
            <TerminalIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="relative h-full w-full">
        {openedFile && (
          <MonacoEditor
            {...monaco}
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
