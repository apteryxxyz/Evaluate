'use client';

import { Input } from '@evaluate/components/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@evaluate/components/popover';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge as cn } from 'tailwind-merge';
import type { File, Folder } from 'virtual-file-explorer-backend';

const InvalidNameRegex = /(^\s|\s$|^\.\.|\.$|[\\/:*?"<>|])/;
const ErrorMessages = {
  EmptyName: 'A name must be provided.',
  InvalidName: 'This name is invalid.',
  NameExists: 'This name already exists.',
};

namespace ExplorerItemName {
  export interface Props {
    item: File | Folder;
    naming: boolean;
    setNaming: React.Dispatch<React.SetStateAction<boolean>>;
  }
}

export function ExplorerItemName(props: ExplorerItemName.Props) {
  const { item, naming, setNaming } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  useEffect(() => {
    if (naming || errorMessage) setTimeout(() => inputRef.current?.focus(), 0);
  }, [errorMessage, naming]);

  const handleChange = useCallback(() => {
    const name = inputRef.current?.value ?? '';
    if (!name) return setErrorMessage(ErrorMessages.EmptyName);
    if (InvalidNameRegex.test(name) || name.length > 255)
      return setErrorMessage(ErrorMessages.InvalidName);
    if (item.parent?.children.find((c) => c !== item && c.name === name))
      return setErrorMessage(ErrorMessages.NameExists);
    setErrorMessage(undefined);
  }, [item]);

  const handleKeyUp = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === 'Enter' || ev.key === 'Escape') inputRef.current?.blur();
    },
    [],
  );

  const handleBlur = useCallback(
    (ev: React.FocusEvent<HTMLInputElement>) => {
      // In some cases the input can be unintentionally blurred, so we need to
      // check if the blur was intentional
      if (ev.relatedTarget?.getAttribute('data-ignore-blur'))
        return ev.target?.focus();

      const name = inputRef.current?.value ?? '';
      if (name !== item.name && !errorMessage) item.name = name;
      else if (!item.name && !name) item.parent = null;
      setNaming(false);
    },
    [item, errorMessage, setNaming],
  );

  const name = useMemo(() => {
    if (item.name === '::args::') return 'CLI Arguments';
    if (item.name === '::input::') return 'STD Input';
    return item.name;
  }, [item.name]);

  return (
    <Popover open={Boolean(errorMessage)}>
      <PopoverAnchor asChild>
        <Input
          ref={inputRef}
          className={cn(
            'mt-[1px] ml-[1px] h-auto w-full rounded-none border-0 p-0 pb-[1px] text-sm focus:z-40',
            !naming && 'pointer-events-none',
          )}
          defaultValue={name}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
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
