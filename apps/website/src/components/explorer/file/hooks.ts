import FileSaver from 'file-saver';
import { useCallback, useState } from 'react';
import { useDrag } from 'react-dnd';
import type { File } from 'virtual-file-explorer-backend';

export function useDraggable(file: File) {
  const [, draggableRef] = useDrag(
    () => ({ type: 'file', item: file }),
    [file],
  );
  return {
    draggableRef: draggableRef as unknown as React.RefCallback<unknown>,
  };
}

export function useDownloadable(file: File) {
  const handleDownloadClick = useCallback(() => {
    const blob = new Blob([file.content]);
    return FileSaver.saveAs(blob, file.name);
  }, [file]);
  return { handleDownloadClick };
}

export function useClickable(file: File) {
  const handleClick = useCallback(() => {
    file.selected = true;
    file.opened = true;
    file.focused = true;
  }, [file]);
  return { handleClick };
}

export function useNameable(file: File) {
  const [naming, setNaming] = useState(!file.name);
  const handleRenameClick = useCallback(() => setNaming(true), []);
  return { naming, setNaming, handleRenameClick };
}

export function useDeleteable(file: File) {
  const handleDeleteClick = useCallback(() => {
    file.opened = false;
    file.focused = false;
    file.parent = null;
  }, [file]);
  return { handleDeleteClick };
}
