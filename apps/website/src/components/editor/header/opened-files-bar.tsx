'use client';

import { Button } from '@evaluate/react/components/button';
import { XIcon } from 'lucide-react';
import { FileIcon } from '../explorer/file-icon';
import { useExplorer, useWatchExplorer } from '../explorer/use';

export function OpenedFilesBar() {
  const explorer = useExplorer();
  useWatchExplorer(explorer);
  const openedFiles = explorer.findTabOpenedFiles();

  return (
    <>
      {openedFiles.map((file, index, files) => (
        <Button
          key={file.path}
          variant="secondary"
          className="group bg-card px-2 text-foreground/70 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:text-foreground"
          data-state={file.isOpened ? 'active' : ''}
          onClick={() => {
            file.setOpened(true);
            file.setSelected(true);
          }}
        >
          <FileIcon fileName={file.name ?? ''} />
          <span>&nbsp;{file.name}</span>

          <Button
            role="button"
            size="icon"
            variant={null}
            className="w-auto pl-2 text-white/20 group-hover:text-white/50 hover:text-white"
            asChild
            onClick={(ev) => {
              ev.stopPropagation();

              file.setOpened(false);
              file.setSelected(false);
              file.setTabOpened(false);

              const toOpen = files[index + 1] ?? files[index - 1];
              if (toOpen) {
                toOpen.setOpened(true);
                toOpen.setSelected(true);
              }
            }}
          >
            <span>
              <XIcon className="size-4" />
            </span>
          </Button>
        </Button>
      ))}
    </>
  );
}
