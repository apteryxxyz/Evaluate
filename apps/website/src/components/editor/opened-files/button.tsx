'use client';

import { Button } from '@evaluate/components/button';
import { XIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import type { File } from 'virtual-file-explorer-backend';
import { useWatch } from '~/components/explorer/use';
import { MaterialIcon } from '~/components/material-icon';

export namespace OpenedFileButton {
  export interface Props {
    file: File;
    others: File[];
  }
}

export function OpenedFileButton({ file, others }: OpenedFileButton.Props) {
  useWatch(file, ['name']);

  const handleClick = useCallback(() => file.select().focus(), [file]);
  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const isFocused = file.focused;
      const currentIndex = others.findIndex((f) => f.focused);
      file.blur().close();

      if (isFocused) {
        const next = others[currentIndex + 1] ?? others[currentIndex - 1];
        if (next) next.select().focus();
      }
    },
    [file.focused, file, others],
  );

  const name = useMemo(() => {
    if (file.name === '::args::') return 'CLI Arguments';
    if (file.name === '::input::') return 'STD Input';
    return file.name || 'Untitled';
  }, [file.name]);

  return (
    <Button
      key={file.path}
      variant="secondary"
      className="group bg-card px-2 text-foreground/70 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground"
      data-state={file.focused ? 'active' : ''}
      onClick={handleClick}
    >
      <MaterialIcon type="file" name={file.name} />
      <span>&nbsp;{name ?? 'Untitled'}</span>

      <Button
        size="icon"
        variant={null}
        className="w-auto pl-2 text-white/20 hover:text-white group-hover:text-white/50"
        onClick={handleCloseClick}
        asChild
      >
        <span>
          <XIcon size={16} strokeWidth={1.5} />
        </span>
      </Button>
    </Button>
  );
}
