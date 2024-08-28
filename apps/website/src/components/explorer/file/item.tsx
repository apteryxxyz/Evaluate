import { Button } from '@evaluate/react/components/button';
import type { File } from 'virtual-file-explorer-backend';
import { ContextMenuWrapper } from '~/components/context-menu-wrapper';
import { MaterialIcon } from '~/components/material-icon';
import { ExplorerItemName } from '../name';
import { useWatch } from '../use';
import {
  useClickable,
  useDeleteable,
  useDownloadable,
  useDraggable,
  useNameable,
} from './hooks';

namespace ExplorerFileItem {
  export interface Props {
    file: File;
    meta?: boolean;
  }
}
export function ExplorerFileItem({ file, meta }: ExplorerFileItem.Props) {
  useWatch(file, ['selected']);

  const { draggableRef } = useDraggable(file);
  const { handleClick } = useClickable(file);
  const { naming, setNaming, handleRenameClick } = useNameable(file);
  const { handleDeleteClick } = useDeleteable(file);
  const { handleDownloadClick } = useDownloadable(file);

  return (
    <ContextMenuWrapper
      items={
        meta
          ? []
          : [
              { label: 'Rename File', action: handleRenameClick },
              { label: 'Delete File', action: handleDeleteClick },
              null,
              { label: 'Download File', action: handleDownloadClick },
            ]
      }
    >
      <Button
        ref={draggableRef}
        variant={file.selected ? 'secondary' : 'ghost'}
        className="flex h-auto w-full justify-start rounded-none p-0"
        style={{ paddingLeft: `${6 + (file.ancestors.length - 1) * 6}px` }}
        onClick={handleClick}
        data-ignore-blur
      >
        <MaterialIcon type="file" name={file.name} naming={naming} />
        <ExplorerItemName item={file} naming={naming} setNaming={setNaming} />
      </Button>
    </ContextMenuWrapper>
  );
}
