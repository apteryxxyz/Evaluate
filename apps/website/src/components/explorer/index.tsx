import { Button } from '@evaluate/react/components/button';
import { ScrollArea } from '@evaluate/react/components/scroll-area';
import { Separator } from '@evaluate/react/components/separator';
import { cn } from '@evaluate/react/utilities/class-name';
import { FilePlusIcon, FolderPlusIcon } from 'lucide-react';
import type { File } from 'virtual-file-explorer-backend';
import { ContextMenuWrapper } from '../context-menu-wrapper';
import { ExplorerFileItem } from './file/item';
import { ExplorerFolderChildren } from './folder/children';
import {
  useChildren,
  useClickable,
  useDownloadable,
  useDropzone,
  useUploadable,
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
  const { handleUploadClick, inputRef } = useUploadable(explorer);
  const {
    handleNewFileToolbarClick,
    handleNewFolderToolbarClick,
    handleNewFileContextClick,
    handleNewFolderContextClick,
  } = useChildren(explorer);

  return (
    <ContextMenuWrapper>
      <section className="h-full w-full">
        <div className="flex h-10 items-center gap-1 border-b px-3 py-1">
          <span className="mr-auto font-medium text-sm">Explorer</span>

          <input ref={inputRef} type="file" className="hidden" multiple />

          <Button
            title="New File"
            size="icon"
            variant="ghost"
            className="size-auto rounded-full"
            onClick={handleNewFileToolbarClick}
          >
            <FilePlusIcon className="size-4" />
            <span className="sr-only">New File</span>
          </Button>

          <Button
            title="New Folder"
            size="icon"
            variant="ghost"
            className="size-auto rounded-full"
            onClick={handleNewFolderToolbarClick}
          >
            <FolderPlusIcon className="size-4" />
            <span className="sr-only">New Folder</span>
          </Button>
        </div>

        <div className="h-[calc(100%_-_40px)]">
          {args && <ExplorerFileItem file={args} meta />}
          {input && <ExplorerFileItem file={input} meta />}
          <Separator />

          <ContextMenuWrapper
            items={[
              { label: 'New File', action: handleNewFileContextClick },
              { label: 'New Folder', action: handleNewFolderContextClick },
              null,
              { label: 'Upload File', action: handleUploadClick },
              { label: 'Download Folder', action: handleDownloadClick },
            ]}
          >
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
          </ContextMenuWrapper>
        </div>
      </section>
    </ContextMenuWrapper>
  );
}
