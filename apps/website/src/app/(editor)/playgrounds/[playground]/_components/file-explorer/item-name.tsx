'use client';

import { Input } from '@evaluate/react/components/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@evaluate/react/components/popover';
import { cn } from '@evaluate/react/utilities/class-name';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { File, Folder } from '../../_contexts/explorer/file-system';

const InvalidNameRegex = /(^\s|\s$|^\.\.|\.$|[\\/:\*\?"<>\|])/;

export function FileExplorerItemName(p: {
  item: File | Folder;
  isRenaming: boolean;
  setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  useEffect(() => {
    if (errorMessage || p.isRenaming)
      setTimeout(() => inputRef.current?.focus(), 0);
  }, [errorMessage, p.isRenaming]);

  const onChange = useCallback(() => {
    const name = inputRef.current?.value!;
    if (!name)
      return setErrorMessage(`A ${p.item.type} name must be provided.`);
    if (InvalidNameRegex.test(name) || name.length > 255)
      return setErrorMessage(`The name "${name}" is invalid.`);
    if (p.item.parent.children.find((c) => c !== p.item && c.name === name))
      return setErrorMessage(`The name "${name}" already exists.`);
    setErrorMessage(undefined);
  }, [p.item]);

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const name = inputRef.current?.value!;
      if (e.key === 'Enter' && name === '')
        return setErrorMessage(`A ${p.item.type} name must be provided.`);
      else if (e.key === 'Enter' && !errorMessage) inputRef.current?.blur();
      if (e.key === 'Escape') p.setIsRenaming(false);
    },
    [p.item.type, errorMessage, p.setIsRenaming],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      // In some cases the input can be unintentionally blurred, so we need to
      // check if the blur was intentional
      if (e.relatedTarget?.getAttribute('data-ignore-blur'))
        return e.target?.focus();

      const name = inputRef.current?.value!;
      if (name !== p.item.name && !errorMessage) p.item.setName(name);
      else if (!p.item.name && !name) p.item.deleteSelf();
      p.setIsRenaming(false);
    },
    [p.item, errorMessage, p.setIsRenaming],
  );

  return (
    <Popover open={Boolean(errorMessage)}>
      <PopoverAnchor asChild>
        <Input
          ref={inputRef}
          className={cn(
            'h-auto w-full rounded-none border-0 p-0 text-sm focus:z-40',
            !p.isRenaming && 'pointer-events-none',
          )}
          defaultValue={p.item.name}
          onChange={onChange}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
        />
      </PopoverAnchor>

      <PopoverContent
        className="w-auto bg-destructive/50 p-1 text-destructive-foreground text-sm"
        data-ignore-blur
      >
        <span>{errorMessage}</span>
      </PopoverContent>
    </Popover>
  );
}
