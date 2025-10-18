'use client';

import { Button } from '@evaluate/components/button';
import { ScrollArea } from '@evaluate/components/scroll-area';
import { Separator } from '@evaluate/components/separator';
import { Say, useSay } from '@sayable/react';
import {
  FilePlusIcon,
  FolderPlusIcon,
  HardDriveDownloadIcon,
} from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';
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
  const say = useSay();

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
      <div className="flex h-10 items-center gap-1 border-b-2 px-3 py-1">
        <span className="mr-auto font-medium text-sm">
          <Say>Explorer</Say>
        </span>

        {/* TODO: Upload button? Would likely need a confirm dialog as this will overwrite the current content */}

        <Button
          title={say`New File`}
          size="icon"
          variant="ghost"
          className="size-auto rounded-full"
          onClick={handleNewFileClick}
        >
          <FilePlusIcon className="size-4" />
          <span className="sr-only">
            <Say>New File</Say>
          </span>
        </Button>

        <Button
          title={say`New Folder`}
          size="icon"
          variant="ghost"
          className="size-auto rounded-full"
          onClick={handleNewFolderClick}
        >
          <FolderPlusIcon className="size-4" />
          <span className="sr-only">
            <Say>New Folder</Say>
          </span>
        </Button>

        <Button
          title={say`Download as Zip`}
          size="icon"
          variant="ghost"
          className="size-auto rounded-full"
          onClick={handleDownloadClick}
        >
          <HardDriveDownloadIcon size={16} />
          <span className="sr-only">
            <Say>Download as Zip</Say>
          </span>
        </Button>
      </div>

      <div className="h-[calc(100%_-_40px)]">
        {args && <ExplorerFileItem file={args} meta />}
        {input && <ExplorerFileItem file={input} meta />}
        <Separator />

        <ScrollArea
          // TODO: Fix types
          ref={dropzoneRef as never}
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
                <Say>
                  This is the file explorer. Create a new file to get started.
                </Say>
              </span>
            </div>
          )}
        </ScrollArea>
      </div>
    </section>
  );
}
