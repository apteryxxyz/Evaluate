import { Button } from '@evaluate/react/components/button';
import { ScrollBar, Scrollable } from '@evaluate/react/components/scrollable';
import { cn } from '@evaluate/react/utilities/class-name';
import { XIcon } from 'lucide-react';
import {
  useExplorer,
  useWatchExplorer,
} from '../../_contexts/explorer/explorer';
import { FileIcon } from '../file-explorer/file-icon';

export function OpenedFilesBar() {
  const explorer = useExplorer();
  useWatchExplorer(explorer);
  const openedFiles = explorer.findTabOpenedFiles();

  return (
    <Scrollable>
      <div className="w-full whitespace-nowrap">
        {openedFiles.map((file, index) => (
          <Button
            key={file.path}
            className={cn(
              'group px-2',
              file.isOpened ? 'bg-secondary' : 'bg-card',
            )}
            variant={null}
            onClick={() => {
              file.setOpened(true);
              file.setSelected(true);
            }}
          >
            <FileIcon fileName={file.name ?? ''} />
            <span>{file.name}</span>
            <Button
              variant={null}
              size="icon"
              className="w-auto pl-2 text-white/20 group-hover:text-white/50 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();

                file.setOpened(false);
                file.setSelected(false);
                file.setTabOpened(false);

                const toOpen = openedFiles[index + 1] ?? openedFiles[index - 1];
                if (toOpen) {
                  toOpen.setOpened(true);
                  toOpen.setSelected(true);
                }
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </Scrollable>
  );
}
