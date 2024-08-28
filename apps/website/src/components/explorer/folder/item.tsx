import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@evaluate/react/components/accordion';
import { Button } from '@evaluate/react/components/button';
import { cn } from '@evaluate/react/utilities/class-name';
import type { Folder } from 'virtual-file-explorer-backend';
import { ContextMenuWrapper } from '~/components/context-menu-wrapper';
import { MaterialIcon } from '~/components/material-icon';
import { ExplorerItemName } from '../name';
import { useWatch } from '../use';
import { ExplorerFolderChildren } from './children';
import {
  useChildren,
  useClickable,
  useDeleteable,
  useDownloadable,
  useDraggable,
  useDropzone,
  useNameable,
  useUploadable,
} from './hooks';

namespace ExplorerFolderItem {
  export interface Props {
    folder: Folder<false>;
  }
}

export function ExplorerFolderItem({ folder }: ExplorerFolderItem.Props) {
  useWatch(folder, ['children', 'expanded', 'selected']);

  const { draggableRef } = useDraggable(folder);
  const { isOver, dropzoneRef } = useDropzone(folder);
  const { handleClick } = useClickable(folder);
  const { naming, setNaming, handleRenameClick } = useNameable(folder);
  const { handleDeleteClick } = useDeleteable(folder);
  const { handleDownloadClick } = useDownloadable(folder);
  const { handleUploadClick, inputRef } = useUploadable(folder);
  const { handleNewFileContextClick, handleNewFolderContextClick } =
    useChildren(folder);

  return (
    <Accordion
      ref={dropzoneRef}
      className={cn(isOver && 'bg-border')}
      type="single"
      collapsible
      value={folder.expanded ? 'open' : ''}
      onValueChange={handleClick}
    >
      <AccordionItem value="open" className="border-b-0">
        <AccordionTrigger className="h-auto w-full p-0 hover:no-underline">
          <ContextMenuWrapper
            items={[
              { label: 'New File', action: handleNewFileContextClick },
              { label: 'New Folder', action: handleNewFolderContextClick },
              null,
              { label: 'Rename Folder', action: handleRenameClick },
              { label: 'Delete Folder', action: handleDeleteClick },
              null,
              { label: 'Upload File', action: handleUploadClick },
              { label: 'Download Folder', action: handleDownloadClick },
            ]}
          >
            <Button
              ref={draggableRef}
              variant={folder.selected ? 'secondary' : 'ghost'}
              className="h-auto w-full justify-start rounded-none p-0"
              style={{
                paddingLeft: `${6 + (folder.ancestors.length - 1) * 6}px`,
              }}
              data-ignore-blur
            >
              <input ref={inputRef} type="file" className="hidden" multiple />
              <MaterialIcon
                type="folder"
                expanded={folder.expanded}
                name={folder.name}
              />
              <ExplorerItemName
                item={folder}
                naming={naming}
                setNaming={setNaming}
              />
            </Button>
          </ContextMenuWrapper>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col pb-0">
          <ExplorerFolderChildren folder={folder} />

          {/* The accordion glitches when there is nothing in its content */}
          <span className="h-[0.09px]" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
