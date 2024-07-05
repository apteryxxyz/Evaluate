'use client';

import { Button } from '@evaluate/react/components/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@evaluate/react/components/context-menu';
import { ScrollArea } from '@evaluate/react/components/scroll-area';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { FilePlusIcon, FolderPlusIcon } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { FileExplorerFileItem } from './file-item';
import { FileExplorerItemWrapper } from './item-wrapper';
import { useExplorer, useWatchExplorer } from './use';

export function Explorer() {
  const explorer = useExplorer();
  useWatchExplorer(explorer);

  const onNewFileClick = useCallback(() => {
    explorer.findSelectedFolder().createChild('file');
  }, [explorer]);
  const onNewFileContextClick = useCallback(() => {
    explorer.createChild('file');
  }, [explorer]);

  const onNewFolderClick = useCallback(() => {
    explorer.findSelectedFolder().createChild('folder');
  }, [explorer]);
  const onNewFolderContextClick = useCallback(() => {
    explorer.createChild('folder');
  }, [explorer]);

  const onClick = useCallback(
    (ev: React.MouseEvent | React.KeyboardEvent) => {
      if ('key' in ev) {
        if (ev.key === 'Esc') explorer.setSelected(true);
      } else if (
        (ev.target as Element).getAttribute(
          'data-radix-scroll-area-viewport',
        ) === ''
      )
        explorer.setSelected(true);
    },
    [explorer],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const onUploadClick = useCallback(() => {
    inputRef.current?.click();
  }, []);
  useEffect(() => {
    const onUpload = () => {
      if (!inputRef.current?.files) return;
      for (const file of Array.from(inputRef.current.files)) {
        const reader = new FileReader();
        reader.onload = () => {
          explorer
            .createChild('file', file.name)
            .setContent(reader.result as string);
        };
        reader.readAsText(file);
      }
      inputRef.current.value = '';
    };

    inputRef.current?.addEventListener('change', onUpload);
    return () => inputRef.current?.removeEventListener('change', onUpload);
  }, [explorer]);

  const onDownloadClick = useCallback(() => {
    const zip = new JSZip();

    for (const child of explorer.descendants)
      if (child.type === 'folder') zip.folder(child.path);
      else zip.file(child.path, child.content ?? '');

    zip
      .generateAsync({ type: 'blob' })
      .then((b) => FileSaver.saveAs(b, 'evaluate.zip'));
  }, [explorer]);

  return (
    <section className="relative h-full w-full">
      <div className="flex h-10 items-center gap-1 border-b px-3 py-1">
        <span className="mr-auto font-medium text-sm">Explorer</span>

        <input ref={inputRef} type="file" className="hidden" multiple />

        <Button
          title="New File"
          size="icon"
          variant="ghost"
          className="size-auto rounded-full"
          onClick={onNewFileClick}
        >
          <FilePlusIcon className="size-4" />
          <span className="sr-only">New File</span>
        </Button>

        <Button
          title="New Folder"
          size="icon"
          variant="ghost"
          className="size-auto rounded-full"
          onClick={onNewFolderClick}
        >
          <FolderPlusIcon className="size-4" />
          <span className="sr-only">New Folder</span>
        </Button>
      </div>

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <ScrollArea
            className="relative h-full w-full py-1"
            onClick={onClick}
            onKeyDown={onClick}
          >
            <div className="mb-1 border-b">
              <FileExplorerFileItem file={explorer.args} isMeta />
              <FileExplorerFileItem file={explorer.input} isMeta />
            </div>

            {explorer.sortChildren().map((child) => (
              <FileExplorerItemWrapper key={child.path} item={child} />
            ))}

            {explorer.children.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                  This is the file explorer. Create a new file to get started.
                </span>
              </div>
            )}
          </ScrollArea>
        </ContextMenuTrigger>

        <ContextMenuContent className="p-1">
          {[
            { label: 'New File', onClick: onNewFileContextClick },
            { label: 'New Folder', onClick: onNewFolderContextClick },
            null,
            { label: 'Upload File', onClick: onUploadClick },
            { label: 'Download Folder', onClick: onDownloadClick },
          ].map((p, i) =>
            p ? (
              <ContextMenuItem key={p.label} asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-full cursor-pointer justify-start p-1 px-6 font-normal focus-visible:ring-0"
                  onClick={p.onClick}
                >
                  {p.label}
                </Button>
              </ContextMenuItem>
            ) : (
              <ContextMenuSeparator key={i} />
            ),
          )}
        </ContextMenuContent>
      </ContextMenu>
    </section>
  );
}
