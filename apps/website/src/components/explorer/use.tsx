'use client';

import { toast } from '@evaluate/components/toast';
import { compress, decompress } from '@evaluate/engine/compress';
import { useEventListener } from '@evaluate/hooks/event-listener';
import type { Runtime } from '@evaluate/types';
import _ from 'lodash';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { File, Folder } from 'virtual-file-explorer-backend';
import { useHashFragment } from '~/hooks/use-hash-fragment';

export const ExplorerContext = //
  createContext<Folder<true>>(null!);
ExplorerContext.displayName = 'ExplorerContext';

export const ExplorerConsumer = ExplorerContext.Consumer;

export function ExplorerProvider({
  runtime,
  children,
}: React.PropsWithChildren<{ runtime: Runtime }>) {
  const [hash, setHash] = useHashFragment();
  const example = useMemo(() => runtime.examples[0], [runtime]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const root = useMemo(() => {
    const root = hash
      ? parseExplorer(hash)
      : example
        ? expandExplorer(example)
        : new Folder<true>('::root::');

    if (!root.children.some((c) => c.name === '::args::'))
      new File('::args::').parent = root;
    if (!root.children.some((c) => c.name === '::input::'))
      new File('::input::').parent = root;

    root.select().expand();
    if (typeof window !== 'undefined') Reflect.set(window, 'root', root);
    return root;
  }, []);

  const saveAndCopyUrl = useCallback(
    (e: Event) => {
      e.preventDefault();
      setHash(stringifyExplorer(root));
      navigator.clipboard.writeText(location.href);
      toast.info('Saved and copied URL to clipboard');
    },
    [setHash, root],
  );
  useEventListener('copy-url' as never, saveAndCopyUrl);

  return (
    <DndProvider backend={HTML5Backend}>
      <ExplorerContext.Provider value={root}>
        {children}
      </ExplorerContext.Provider>
    </DndProvider>
  );
}

export function useExplorer() {
  const context = useContext(ExplorerContext);
  if (context) return context;
  throw new Error('useExplorer must be used within a ExplorerProvider');
}

export function useWatch(
  item: Folder | File | null,
  events: string[],
  callback?: () => unknown,
) {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    if (callback) callback();
    else setTick((t) => t + 1);
  }, [callback]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    for (const e of events) item?.changes.on(e, update);
    return () => {
      for (const e of events) item?.changes.off(e, update);
    };
  }, [item, update, ...events]);
}

function stringifyExplorer(explorer: Folder) {
  if (explorer.children.length === 0) return '';
  return compress(flattenExplorer(explorer));
}

function parseExplorer(hash: string) {
  if (!hash) return new Folder<true>('::root::');
  return expandExplorer(decompress(hash));
}

function flattenExplorer(explorer: Folder) {
  if (explorer.children.length === 0) return { files: {} };

  const files: Record<string, string> = {};
  let entry: string | undefined;
  let focused: string | undefined;

  for (const file of explorer.descendants //
    .filter((f): f is File => f.type === 'file')) {
    const path = file.path;
    const content = file.content;
    const isEntry = Reflect.get(file, 'entry');
    const isFocused = file.focused;

    if (isEntry) entry = path;
    if (isFocused) focused = path;

    files[path] = content;
  }

  return {
    files,
    entry,
    focused,
  };
}

function expandExplorer(
  object: Omit<ReturnType<typeof flattenExplorer>, 'entry'> & {
    entry?: string;
  },
) {
  const root = new Folder<true>('::root::');

  for (const [path, content] of Object.entries(object.files)) {
    let parent = root as unknown as Folder;

    for (const name of path.split('/').slice(0, -1)) {
      const child = parent.children.find((c) => c.name === name);

      if (child instanceof File) {
        throw new Error('Invalid state');
      } else if (child instanceof Folder) {
        parent = child;
      } else {
        const newParent = new Folder(name);
        newParent.parent = parent;
        parent = newParent;
      }
    }

    if (!path.endsWith('/')) {
      const name = path.split('/').pop();
      const file = new File(name!);
      file.content = content;
      file.parent = parent;

      if (path === object.entry) Reflect.set(file, 'entry', true);
      if (path === (object.focused ?? object.entry)) {
        file.opened = true;
        file.focused = true;
      }
    }
  }

  return root;
}
