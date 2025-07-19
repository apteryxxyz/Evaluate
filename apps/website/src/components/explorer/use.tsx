'use client';

import { toast } from '@evaluate/components/toast';
import {
  compress,
  decompress,
  ExecuteOptions,
  type FilesOptions,
} from '@evaluate/execute';
import { useEventListener } from '@evaluate/hooks/event-listener';
import { getRuntimeExamples, type Runtime } from '@evaluate/runtimes';
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
import { useHashFragment } from '~/hooks/hash-fragment';

export const ExplorerContext = //
  createContext<Folder<true>>(null!);
ExplorerContext.displayName = 'ExplorerContext';

export const ExplorerConsumer = ExplorerContext.Consumer;

export function ExplorerProvider({
  runtime,
  children,
}: React.PropsWithChildren<{
  runtime: Runtime;
}>) {
  const [hash, setHash] = useHashFragment();
  const example = useMemo(
    () => getRuntimeExamples(runtime.id)?.[0],
    [runtime.id],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only want triggered once
  const root = useMemo(() => {
    let root: Folder<true>;
    if (hash) root = decodeExplorer(hash);
    else if (example) root = optionsToFolder(example);
    else root = new Folder<true>('::root::');

    if (!root.children.some((c) => c.name === '::args::'))
      new File('::args::').parent = root;
    if (!root.children.some((c) => c.name === '::input::'))
      new File('::input::').parent = root;

    root.select().expand();
    return root;
  }, []);

  const saveAndCopyUrl = useCallback(
    (e: Event) => {
      e.preventDefault();
      setHash(encodeExplorer(root));
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Rest of the deps
  useEffect(() => {
    for (const e of events) item?.changes.on(e, update);
    return () => {
      for (const e of events) item?.changes.off(e, update);
    };
  }, [item, update, ...events]);
}

//

function encodeExplorer(explorer: Folder) {
  if (explorer.children.length === 0) return '';
  return compress(folderToOptions(explorer));
}

function decodeExplorer(hash: string) {
  if (!hash) return new Folder<true>('::root::');
  return optionsToFolder(decompress(hash));
}

function folderToOptions(folder: Folder) {
  const files: Record<string, string> = {};
  let entry: string | undefined;
  let focused: string | undefined;

  for (const file of folder.descendants //
    .filter((f): f is File => f.type === 'file')) {
    if (Reflect.get(file, 'entry')) entry = file.path;
    if (file.focused) focused = file.path;
    files[file.path] = file.content;
  }

  return ExecuteOptions.parse({ files, entry, focused });
}

function optionsToFolder(options: FilesOptions & { focused?: string }) {
  const root = new Folder<true>('::root::');

  for (const [path, content] of Object.entries(options.files)) {
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

      if (path === options.entry) Reflect.set(file, 'entry', true);
      if (path === (options.focused ?? options.entry))
        file.opened = file.focused = true;
    }
  }

  return root;
}
