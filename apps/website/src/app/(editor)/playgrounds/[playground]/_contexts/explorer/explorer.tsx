'use client';

import { useForceUpdate } from '@evaluate/react/hooks/force-update';
import _ from 'lodash';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useHashFragment } from '~/hooks/use-hash-fragment';
import { Root } from './file-system';
import type { Runtime } from '@evaluate/engine/runtimes';

export const ExplorerContext = createContext<Root>(null!);
ExplorerContext.displayName = 'ExplorerContext';

export const ExplorerConsumer = ExplorerContext.Consumer;

export function ExplorerProvider(
  p: React.PropsWithChildren<{ runtime: Runtime }>,
) {
  const root = useMemo(() => new Root(), []);
  const [hash, setHash] = useHashFragment();
  const example = useMemo(() => p.runtime.examples[0], [p.runtime]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!root.isEmpty()) return;
    if (hash) root.fromHash(hash);
    if (root.isEmpty()) {
      if (hash) setHash();
      if (example) root.fromJSON(example);
    }
  }, []);

  useEffect(() => {
    const handler = _.debounce(() => setHash(root.hash), 1000);
    root.emitter.on('change', handler);
    return () => void root.emitter.off('change', handler);
  }, [root, setHash]);

  return (
    <ExplorerContext.Provider value={root}>
      {p.children}
    </ExplorerContext.Provider>
  );
}

export function useExplorer() {
  const context = useContext(ExplorerContext);
  if (context) return context;
  throw new Error('useExplorer must be used within a ExplorerProvider');
}

export function useWatchExplorer(root: Root) {
  useForceUpdate(
    (cb) => root.emitter.on('change', cb),
    (cb) => root.emitter.off('change', cb),
  );
}
