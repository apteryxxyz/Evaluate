'use client';

import { Button } from '@evaluate/components/button';
import { ScrollArea } from '@evaluate/components/scroll-area';
import { Separator } from '@evaluate/components/separator';
import { cn } from '@evaluate/helpers/class';
import {
  FilePlusIcon,
  FolderPlusIcon,
  HardDriveDownloadIcon,
} from 'lucide-react';
import type { File } from 'virtual-file-explorer-backend';
import { ExplorerFileItem } from './file/item';
import { ExplorerFolderChildren } from './folder/children';
import {
  useChildren,
  useClickable,
  useDownloadable,
  useDropzone,
} from './folder/hooks';
import { useExplorer, useWatch } from './use';

export function Explorer() {
  const explorer = useExplorer();
  useWatch(explorer, ['children']);
  const args = explorer.children //
    .find((c): c is File => c.name === '::args::');
  const input = explorer.children //
    .find((c): c is File => c.name === '::input::');

  const { isOver, dropzoneRef } = useDropzone(explorer);
  const { handleClick } = useClickable(explorer);
  const { handleDownloadClick } = useDownloadable(explorer);
  const { handleNewFileClick, handleNewFolderClick } = useChildren(explorer);

  return (
    <section className="h-full w-full">
      <div className="flex h-10 items-center gap-1 border-b px-3 py-1">
        <span className="mr-auto font-medium text-sm">Explorer</span>

        {/* TODO: Upload button? Would likely need a confirm dialog as this will overwrite the current content */}

        <Button
          title="Download As Zip"
          size="icon"
          variant="ghost"
          className="size-auto rounded-full"
          onClick={handleDownloadClick}
        >
          <HardDriveDownloadIcon size={16} />
          <span className="sr-only">Download As Zip</span>
        </Button>

        <Button
          title="New File"
          size="icon"
          variant="ghost"
          className="size-auto rounded-full"
          onClick={handleNewFileClick}
        >
          <FilePlusIcon className="size-4" />
          <span className="sr-only">New File</span>
        </Button>

        <Button
          title="New Folder"
          size="icon"
          variant="ghost"
          className="size-auto rounded-full"
          onClick={handleNewFolderClick}
        >
          <FolderPlusIcon className="size-4" />
          <span className="sr-only">New Folder</span>
        </Button>
      </div>

      <div className="h-[calc(100%_-_40px)]">
        {args && <ExplorerFileItem file={args} meta />}
        {input && <ExplorerFileItem file={input} meta />}
        <Separator />

        <ScrollArea
          ref={dropzoneRef}
          className={cn(
            'relative h-[calc(100%_-_45px)] w-full',
            isOver && 'bg-border',
          )}
          onClick={handleClick}
        >
          <ExplorerFolderChildren folder={explorer} />

          {/* Take into account the meta files (2) */}
          {explorer.children.length <= 2 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="max-w-64 text-balance p-1 text-center text-foreground/50 text-sm">
                This is the file explorer. Create a new file to get started.
              </span>
            </div>
          )}
        </ScrollArea>
      </div>
    </section>
  );
}
